import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, TrendingUp, ShieldCheck, Flame, Copy } from "lucide-react";
import Image from "next/image";
import Orb from '@/components/animations/Orb';
import CopyButton from "@/components/CopyButton";
import ActionButtons from "@/components/ActionButtons";




export default function Home() {
  return (
    <div className="flex flex-col gap-8 items-center max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center relative w-full flex flex-col md:flex-row md:items-center md:justify-between md:text-left md:gap-8">
        {/* Show Orb at top on mobile, hidden on desktop */}
        <div className="relative min-h-[300px] md:hidden mb-8">
          <Orb />
        </div>
        
        <div className="flex-1 flex flex-col items-center">
          <h1 className="text-center text-4xl font-bold">LoopBurn</h1>
          <p className="text-center text-xl text-muted-foreground mb-4">The Yield Magnet Fueling Deflation</p>
          
          {/* Compact Contract Address Display */}
          <div className="flex items-center justify-center bg-card/50 backdrop-blur-sm p-2 rounded-lg max-w-2xl w-full gap-2">
            <p className="text-xs text-muted-foreground">CA:</p>
            <code className="font-mono text-xs"> C o m i n g --   S o o n </code>
            <CopyButton text="0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" />
          </div>
          
          {/* Add Built on Sonic section */}
          <div className="flex items-center justify-center gap-3 w-full mt-4">
            <span className="text-2xl text-muted-foreground">Built on</span>
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-orange-500/30 animate-pulse rounded-full"></div>
              <Image 
                src="/sonic-logo.png"
                alt="Sonic Blockchain"
                width={250}
                height={85}
                className="object-contain relative z-10 hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          <div className="max-w-[300px] md:max-w-[600px] text-center md:text-center mt-4">
            <p className="text-base md:text-lg text-muted-foreground">
              $LPB is a deflationary ERC-20 token on the Sonic network designed to boost trading volume 
              and incentivize liquidity — all without relying on token taxes. Through a unique burn-and-recycle mechanism, 
              LoopBurn attracts liquidity yield farmers while continuously reducing the total supply of $LPB over time.
            </p>
          </div>

          <section className="mt-8 w-full flex flex-col items-center">
            <ActionButtons />
          </section>
        </div>

        {/* Desktop Orb - hidden on mobile */}
        <div className="flex-1 relative min-h-[400px] hidden md:block">
          <Orb />
        </div>
      </section>

        <Card className="border-none bg-transparent shadow-none">
          
          <CardContent>
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              <Card className="shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center text-base">
                    <Zap className="w-5 h-5 text-green-500" />
                    No Tax
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="h-[1px] w-full bg-border mb-4" />
                  <p className="text-muted-foreground text-base">No Tax on buys or sells</p>
                </CardContent>
              </Card>
            
              <Card className="shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center text-base">
                    <Flame className="w-5 h-5 text-purple-500" />
                    Deflationary
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="h-[1px] w-full bg-border mb-4" />
                  <p className="text-muted-foreground text-base">Burn mechanism reduces supply over time</p>
                </CardContent>
              </Card>
            
              <Card className="shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center text-base">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    Volume Engineered
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="h-[1px] w-full bg-border mb-4" />
                  <p className="text-muted-foreground text-base">Boosts trading volume to attract LP farmers</p>
                </CardContent>
              </Card>
            
              <Card className="shadow-[0_0_15px_rgba(234,88,12,0.2)] hover:shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-center text-base">
                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                    Self-Reinforcing
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="h-[1px] w-full bg-border mb-4" />
                  <p className="text-muted-foreground text-base">Converts fees and liquidity into more volume and burns</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
    </div>
  )
}
