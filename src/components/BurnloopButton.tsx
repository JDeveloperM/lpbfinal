'use client';

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBurnCountdown } from "@/hooks/use-burn-countdown";
import { ArrowDownToLine, Loader2, Timer } from "lucide-react";

export default function BurnloopButton() {
  const {
    executeBurnloop,
    isExecuting,
    isReadyToBurnloop,
    isExecuted,
    burnloopTimeLeft,
    burnloopFormattedTime
  } = useBurnCountdown();

  return (
    <TooltipProvider>
      <div className="flex justify-center w-full">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto border-2 border-blue-500/30 hover:bg-blue-500/10 text-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-4 text-base rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30"
              onClick={executeBurnloop}
              disabled={!isReadyToBurnloop || isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Executing Burnloop...
                </>
              ) : isExecuted ? (
                <>
                  <ArrowDownToLine className="h-5 w-5 mr-2" />
                  Burnloop Executed!
                </>
              ) : isReadyToBurnloop ? (
                <>
                  <ArrowDownToLine className="h-5 w-5 mr-2" />
                  Execute Burnloop
                </>
              ) : (
                <>
                  <Timer className="h-5 w-5 mr-2" />
                  Burnloop in {burnloopFormattedTime}
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            {isReadyToBurnloop ? (
              <div className="space-y-1">
                <p className="font-semibold">Ready to execute burnloop!</p>
                <p className="text-sm">• Withdraws 1% of protocol-owned liquidity</p>
                <p className="text-sm">• Burns $LPB tokens</p>
                <p className="text-sm">• Sends $wS to Yield Reactor</p>
                <p className="text-sm">• 8-hour cooldown cycle</p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold">Next burnloop in {burnloopFormattedTime}</p>
                <p className="text-sm">Automated 8-hour cycle that:</p>
                <p className="text-sm">• Withdraws 1% POL</p>
                <p className="text-sm">• Burns $LPB portion</p>
                <p className="text-sm">• Recycles paired tokens</p>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
