'use client';

import { useBurnCountdown } from '@/hooks/use-burn-countdown';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Clock, Flame, Loader2, ExternalLink } from 'lucide-react';

export default function BurnCountdown() {
  const {
    formattedTime,
    progress,
    isLoading,
    isReadyToBurn,
    timeLeft,
    executeBurn,
    isExecuting,
    isExecuted,
    contractAddress,
    hasContractData,
    contractError,
    burnInterval
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
          {isReadyToBurn ? (
            <Flame className="h-4 w-4 text-red-500 animate-pulse" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className={`text-sm font-mono ${isReadyToBurn ? 'text-red-500 font-bold animate-pulse' : 'text-foreground'}`}>
            {isReadyToBurn ? 'READY!' : formattedTime}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {isReadyToBurn ? 'Burn Available' : 'Next Burn'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <Progress
          value={progress}
          className="h-2 w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Last Burn</span>
          <span>{Math.round(progress)}%</span>
          <span>{Math.round(burnInterval / 3600)}h Cycle</span>
        </div>
      </div>

      {/* Status Text and Burn Button */}
      {isReadyToBurn ? (
        <div className="space-y-2">
          <Button
            onClick={executeBurn}
            disabled={isExecuting}
            size="sm"
            className="w-full h-8 text-xs bg-red-600 hover:bg-red-700 text-white"
          >
            {isExecuting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Burning...
              </>
            ) : isExecuted ? (
              'Burned!'
            ) : (
              <>
                <Flame className="h-3 w-3 mr-1" />
                Execute Burn
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            {isExecuted ? 'Burn executed successfully!' : 'Ready to burn tokens'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center">
          {`${timeLeft.hours}h ${timeLeft.minutes}m until next burn`}
        </p>
      )}

      {/* Contract Info */}
      <div className="pt-3 border-t border-border/50">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Contract:</span>
          <a
            href={`https://sonicscan.org/address/${contractAddress}`}
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
            {hasContractData ? 'Live Contract' : contractError ? 'Contract Error' : 'Demo Mode'}
          </span>
          <div className={`h-2 w-2 rounded-full ${
            hasContractData ? 'bg-green-500' :
            contractError ? 'bg-red-500' :
            'bg-yellow-500'
          }`} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          burnloop() • {Math.round(burnInterval / 3600)}h intervals
        </p>
        <p className="text-xs text-muted-foreground text-center mt-1 opacity-75">
          Withdraws 1% POL • Burns $LPB • Sends $wS to Yield Reactor
        </p>
      </div>
    </div>
  );
}
