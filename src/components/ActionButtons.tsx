'use client';

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink, Flame } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ActionButtons() {
  const router = useRouter();

  const handleYieldReactorRedirect = () => {
    // Redirect to yield reactor page
    router.push('/yield-reactor');
  };

  const handleTradeRedirect = () => {
    // Redirect to Shadow DEX with LPB trading pair
    window.open('https://www.shadow.so/trade?inputCurrency=0x0000000000000000000000000000000000000000&outputCurrency=0x001bFF4b6da770f445A740227224D3c8b48e6fb2', '_blank', 'noopener,noreferrer');
  };

  return (
    <TooltipProvider>
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className="w-full sm:w-auto border-2 border-orange-500/30 hover:bg-orange-500/10 text-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300 px-4 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-xl bg-gradient-to-r from-orange-600/20 to-red-600/20 hover:from-orange-600/30 hover:to-red-600/30"
              onClick={handleYieldReactorRedirect}
            >
              <Flame className="h-4 w-4 mr-2" />
              Execute Hyper Loop
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to Yield Reactor to execute hyperloop and manage burn mechanisms</p>
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
