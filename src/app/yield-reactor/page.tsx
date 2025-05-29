'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CoreMechanism from "@/components/CoreMechanism";

export default function YieldReactorPage() {
  return (
    <main className="flex flex-col gap-4 md:gap-8 items-center max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center">Yield Reactor</h1>
      <div className="space-y-4">
        <p className="text-center text-muted-foreground text-sm md:text-base px-2">
          The heart of LoopBurn's automated deflationary engine. Every 8 hours, the Yield Reactor <span className="hidden md:inline"><br></br></span>executes burn cycles and volume amplification to create sustainable yield and token scarcity.
        </p>
      </div>

      <div className="w-full space-y-8">
        <Card className="border-0 bg-transparent shadow-none">
          <CardContent>
            <CoreMechanism />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}