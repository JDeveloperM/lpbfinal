
"use client";

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const NUM_ORBS = 3;
const MIN_SPEED_FACTOR = 0.1; // Factor for speed calculation
const MAX_SPEED_FACTOR = 0.1; // Factor for speed calculation

const ORB_CONFIGS = [
  { colorClass: 'bg-primary/40', sizeClass: 'w-[250px] h-[250px] md:w-[400px] md:h-[400px]' },
  { colorClass: 'bg-accent/40', sizeClass: 'w-[300px] h-[300px] md:w-[550px] md:h-[550px]' },
  { colorClass: 'bg-orange/30', sizeClass: 'w-[200px] h-[200px] md:w-[350px] md:h-[350px]' },
];

interface OrbState {
  id: number;
  x: number;
  y: number;
  sizeClass: string;
  colorClass: string;
  vx: number; // velocity x
  vy: number; // velocity y
  baseSize: number; // store base size for collision
}

const AnimatedOrbBackground = () => {
  const [orbs, setOrbs] = useState<OrbState[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const initialOrbs: OrbState[] = [];
    if (typeof window !== 'undefined') {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      for (let i = 0; i < NUM_ORBS; i++) {
        const config = ORB_CONFIGS[i % ORB_CONFIGS.length];
        const speedFactor = MIN_SPEED_FACTOR + Math.random() * (MAX_SPEED_FACTOR - MIN_SPEED_FACTOR);
        // Speed relative to viewport diagonal for somewhat consistent perceived speed
        const speed = Math.sqrt(viewportWidth*viewportWidth + viewportHeight*viewportHeight) * speedFactor * 0.01;

        const angle = Math.random() * 2 * Math.PI;

        const sizeMatch = config.sizeClass.match(/w-\[(\d+)px\]/);
        const baseSize = sizeMatch ? parseInt(sizeMatch[1], 10) : 300;


        initialOrbs.push({
          id: i,
          x: Math.random() * (viewportWidth - baseSize),
          y: Math.random() * (viewportHeight - baseSize),
          sizeClass: config.sizeClass,
          colorClass: config.colorClass,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseSize: baseSize,
        });
      }
      setOrbs(initialOrbs);
    }
  }, []);

  useEffect(() => {
    if (!isMounted || orbs.length === 0) return;

    let animationFrameId: number;

    const animate = () => {
      if (containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        setOrbs(prevOrbs =>
          prevOrbs.map(orb => {
            let newX = orb.x + orb.vx;
            let newY = orb.y + orb.vy;
            let newVx = orb.vx;
            let newVy = orb.vy;

            const currentOrbSize = window.innerWidth < 768 ? orb.baseSize : parseInt(orb.sizeClass.match(/md:w-\[(\d+)px\]/)?.[1] || String(orb.baseSize), 10) ;


            if (newX <= 0 || newX + currentOrbSize >= bounds.width) {
              newVx = -newVx;
              newX = newX <= 0 ? 0 : Math.max(0, bounds.width - currentOrbSize);
            }
            if (newY <= 0 || newY + currentOrbSize >= bounds.height) {
              newVy = -newVy;
              newY = newY <= 0 ? 0 : Math.max(0, bounds.height - currentOrbSize);
            }

            return { ...orb, x: newX, y: newY, vx: newVx, vy: newVy };
          })
        );
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [orbs, isMounted]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {orbs.map(orb => (
        <div
          key={orb.id}
          className={cn(
            'absolute mix-blend-screen filter blur-sm animate-pulse-slow',
            orb.sizeClass
          )}
          style={{
            transform: `translate(${orb.x}px, ${orb.y}px)`,
          }}
        >
          {/* Infinity symbol using two overlapping circles */}
          <div className="relative w-full h-full">
            <div
              className={cn('absolute rounded-full', orb.colorClass)}
              style={{
                width: '60%',
                height: '60%',
                left: '5%',
                top: '20%',
              }}
            />
            <div
              className={cn('absolute rounded-full', orb.colorClass)}
              style={{
                width: '60%',
                height: '60%',
                right: '5%',
                top: '20%',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnimatedOrbBackground;
