'use client';

import { useBurnCountdown } from '@/hooks/use-burn-countdown';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Loader2, ExternalLink } from 'lucide-react';

export default function BurnloopCountdown() {
  const {
    hyperloopFormattedTime,
    hyperloopProgress,
    isLoading,
    isReadyToHyperloop,
    isHyperloopOnCooldown,
    hyperloopTimeLeft,
    executeHyperloop,
    isExecuting,
    isExecuted,
    contractAddress,
    hasHyperloopData,
    hyperloopError,
    hyperInterval
  } = useBurnCountdown();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Clock className="h-3 w-3 animate-spin text-muted-foreground" />
        <span className="text-[10px] text-muted-foreground">Loading contract...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Countdown Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {isHyperloopOnCooldown ? (
            <Clock className="h-4 w-4 text-orange-500" />
          ) : (
            <Flame className="h-4 w-4 text-blue-500 animate-pulse" />
          )}
          <span className={`text-sm font-mono ${isHyperloopOnCooldown ? 'text-orange-500' : 'text-blue-500 font-bold animate-pulse'}`}>
            {isHyperloopOnCooldown ? hyperloopFormattedTime : 'READY!'}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isHyperloopOnCooldown ? 'Cooldown Active' : 'Hyper Loop Available'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={hyperloopProgress}
          className="h-2 w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Last Hyper Loop</span>
          <span>{Math.round(hyperloopProgress)}%</span>
          <span>{Math.round(hyperInterval / 60)}m Cycle</span>
        </div>
      </div>

      {/* Hyper Loop Button - Always Visible */}
      <div className="space-y-2">
        <Button
          onClick={executeHyperloop}
          disabled={isExecuting || isHyperloopOnCooldown}
          size="sm"
          className={`w-full h-8 text-xs ${
            isHyperloopOnCooldown
              ? 'bg-gray-600 hover:bg-gray-600 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700'
          } text-white`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              Executing...
            </>
          ) : isExecuted ? (
            'Executed!'
          ) : isHyperloopOnCooldown ? (
            <>
              <Clock className="h-3 w-3 mr-1" />
              Cooldown: {hyperloopFormattedTime}
            </>
          ) : (
            <>
              <Flame className="h-3 w-3 mr-1" />
              Execute Hyper Loop
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          {isExecuted ? 'Hyper Loop executed successfully!' :
           isHyperloopOnCooldown ? `Next execution available in ${hyperloopFormattedTime}` :
           'Ready to execute hyper loop'}
        </p>
      </div>

      {/* Mechanism Info */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-xs text-muted-foreground text-center mt-2">
          hyperloop() • {Math.round(hyperInterval / 60)}m cooldown
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1 opacity-75">
          Claims fees • Burns $LBP • Amplifies volume
        </p>
      </div>
    </div>
  );
}
