// @ts-nocheck
// remove ts-nocheck if you want to address the type issues
"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";

import "./Orb.css";

import { FC } from 'react';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  gradient?: string[]; // Added gradient prop
}

const Orb: FC<OrbProps> = ({
  hue = 0,
  hoverIntensity = 0.5,
  rotateOnHover = true,
  forceHoverState = false,
  gradient = [], // Default to empty array
}) => {
  const ctnDom = useRef(null);

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    // Instead of "extractAlpha" that normalizes the color,
    // we keep the computed color as-is and later multiply by alpha.
    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const vec3 baseColor1 = vec3(1.0, 0.5, 0.0);  // Bright Orange
    const vec3 baseColor2 = vec3(0.0, 0.1, 0.4);  // Dark Blue
    const vec3 baseColor3 = vec3(0.0, 0.15, 0.5);  // Slightly lighter Dark Blue
    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }
    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    // Function to calculate distance to infinity symbol
    float infinityDistance(vec2 uv) {
      // Scale the UV coordinates for better infinity shape
      vec2 p = uv * 1.2;

      // Infinity symbol parametric equation: x = cos(t)/(1+sin²(t)), y = sin(t)*cos(t)/(1+sin²(t))
      float minDist = 10.0;

      // Sample the infinity curve at multiple points
      for(float t = 0.0; t < 6.28318; t += 0.1) {
        float sinT = sin(t);
        float cosT = cos(t);
        float denom = 1.0 + sinT * sinT;

        vec2 infinityPoint = vec2(
          cosT / denom,
          sinT * cosT / denom
        );

        float dist = distance(p, infinityPoint);
        minDist = min(minDist, dist);
      }

      return minDist;
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(baseColor1, hue);
      vec3 color2 = adjustHue(baseColor2, hue);
      vec3 color3 = adjustHue(baseColor3, hue);

      // Calculate distance to infinity symbol
      float infDist = infinityDistance(uv);

      // Static thickness for stable outer shape (very thin/minimal)
      float thickness = 0.06;

      // Create the static infinity shape
      float v0 = light1(1.0, 10.0, infDist);
      v0 *= smoothstep(thickness + 0.05, thickness, infDist);

      // Single flame particle moving along the infinity curve
      float a = iTime * -1.0;
      float sinA = sin(a);
      float cosA = cos(a);
      float denomA = 1.0 + sinA * sinA;
      vec2 flamePos = vec2(cosA / denomA, sinA * cosA / denomA) * 1.2;

      float flameDistance = distance(uv, flamePos);
      float flameIntensity = light2(1.5, 4.0, flameDistance);
      flameIntensity *= light1(1.0, 50.0, infDist); // Keep flame inside the shape

      // Static color variation (no time-based movement)
      float ang = atan(uv.y, uv.x);
      float cl = cos(ang) * 0.5 + 0.5;

      // Fade out towards edges
      float fadeOut = smoothstep(1.5, 0.8, length(uv));
      float v2 = fadeOut;
      float v3 = smoothstep(thickness + 0.1, thickness - 0.05, infDist);

      // Clean color mixing
      vec3 col = mix(color1, color2, cl);
      col = mix(color3, col, v0);
      col = (col + flameIntensity) * v2 * v3;
      col = clamp(col, 0.0, 1.0);

      return extractAlpha(col);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;

      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(75, 75, 1)
        },
        hue: { value: hue },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Set the canvas size to match container size exactly
      renderer.setSize(width, height);
      gl.canvas.style.width = `${width}px`;
      gl.canvas.style.height = `${height}px`;

      program.uniforms.iResolution.value.set(width, height, width / height);
    }

    // Initial resize to set correct size
    resize();
    window.addEventListener("resize", resize);

    let lastTime = 0;

    let rafId;
    const update = (t) => {
      rafId = requestAnimationFrame(update);
      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.hue.value = hue;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      if (container && gl.canvas && container.contains(gl.canvas)) {
        container.removeChild(gl.canvas);
      }
      // Attempt to lose context if extension is available
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hue]);

  return (
    <div ref={ctnDom} className="orb-container mx-auto w-[75px] sm:w-[75px] md:w-[75px] lg:w-[75px] aspect-square relative">
      {/* Add text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4">

      </div>
    </div>
  );
}
export default Orb;
