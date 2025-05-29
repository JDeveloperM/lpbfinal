'use client';

import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import BurnloopCountdown from "@/components/BurnloopCountdown";
import { useBurnCountdown } from "@/hooks/use-burn-countdown";
import { Flame } from "lucide-react";

export default function BurnloopCard() {
  const {
    isLoading
  } = useBurnCountdown();

  return (
    <Card className="relative h-full">
      <div className="absolute top-3 right-3">
        <Flame className="h-5 w-5 text-muted-foreground" />
      </div>
      <CardHeader className="text-center relative pt-4 px-6 pb-2">
        <CardDescription className="text-[1.5rem] animate-pulse text-blue-500 font-semibold relative">
          <span className="relative inline-block">
            Burnloop Mechanism
            <span className="absolute inset-0 bg-blue-500/20 blur-sm animate-ping rounded-lg"></span>
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-3">
        <BurnloopCountdown />
      </CardContent>
    </Card>
  );
}
