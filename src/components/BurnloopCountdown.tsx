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
    hyperloopTimeLeft,
    executeHyperloop,
    isExecuting,
    isExecuted,
    contractAddress,
    hasHyperloopData,
    hyperloopError
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
          {isReadyToHyperloop ? (
            <Flame className="h-4 w-4 text-blue-500 animate-pulse" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={`text-sm font-mono ${isReadyToHyperloop ? 'text-blue-500 font-bold animate-pulse' : 'text-foreground'}`}>
            {isReadyToHyperloop ? 'READY!' : hyperloopFormattedTime}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isReadyToHyperloop ? 'Hyper Loop Available' : 'Next Hyper Loop'}
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
          <span>15m Cycle</span>
        </div>
      </div>

      {/* Status Text and Hyper Loop Button */}
      {isReadyToHyperloop ? (
        <div className="space-y-2">
          <Button
            onClick={executeHyperloop}
            disabled={isExecuting}
            size="sm"
            className="w-full h-8 text-xs bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Executing...
              </>
            ) : isExecuted ? (
              'Executed!'
            ) : (
              <>
                <Flame className="h-3 w-3 mr-1" />
                Execute Hyper Loop
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {isExecuted ? 'Hyper Loop executed successfully!' : 'Ready to execute hyper loop'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          {`${hyperloopTimeLeft.hours}h ${hyperloopTimeLeft.minutes}m until next hyper loop`}
        </p>
      )}

      {/* Contract Info */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Contract:</span>
          <a
            href={`https://etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            <span className="font-mono">{contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {hasHyperloopData ? 'Live Contract' : hyperloopError ? 'Contract Error' : 'Demo Mode'}
          </span>
          <div className={`h-2 w-2 rounded-full ${
            hasHyperloopData ? 'bg-green-500' :
            hyperloopError ? 'bg-red-500' :
            'bg-yellow-500'
          }`} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          hyperloop() • 15m intervals
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1 opacity-75">
          Claims fees • Burns $LPB • Amplifies volume
        </p>
      </div>
    </div>
  );
}
