'use client';

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBurnCountdown } from "@/hooks/use-burn-countdown";
import { ExternalLink, Flame, Loader2 } from "lucide-react";

export default function ActionButtons() {
  const {
    executeHyperloop,
    isExecuting,
    isReadyToHyperloop,
    isExecuted,
    hyperloopTimeLeft
  } = useBurnCountdown();

  const handleTradeRedirect = () => {
    // Redirect to Shadow DEX with LPB trading pair
    window.open('https://shadow.so/swap', '_blank', 'noopener,noreferrer');
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto border-2 border-primary/30 hover:bg-primary/10 text-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl"
              onClick={executeHyperloop}
              disabled={!isReadyToHyperloop || isExecuting}
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Executing...
                </>
              ) : isExecuted ? (
                <>
                  <Flame className="h-4 w-4 mr-2" />
                  Executed!
                </>
              ) : (
                <>
                  <Flame className="h-4 w-4 mr-2" />
                  Execute Hyper Loop
                </>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isReadyToHyperloop ? (
              <p>Ready to execute hyperloop! Claims fees, burns $LPB, and amplifies volume.</p>
            ) : (
              <p>Next hyperloop in {hyperloopTimeLeft.hours}h {hyperloopTimeLeft.minutes}m {hyperloopTimeLeft.seconds}s</p>
            )}
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border-2 border-primary/30 hover:bg-primary/10 hover:text-white text-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl"
              onClick={handleTradeRedirect}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Trade on ShadowDex
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Trade $LPB on Shadow DEX - Opens in new tab</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
