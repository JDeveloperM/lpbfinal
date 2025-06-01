'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, TrendingDown, Zap, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useTokenData } from "@/hooks/use-token-data"
import { formatUnits } from "viem"

export default function BurnedTokensCard() {
  const [flameIntensity, setFlameIntensity] = useState(0)
  const { tokenData, isLoading, error, hasTokenData } = useTokenData()

  useEffect(() => {
    const interval = setInterval(() => {
      setFlameIntensity(prev => (prev + 1) % 3)
    }, 800)

    return () => {
      clearInterval(interval)
    }
  }, [])

  const flameColors = [
    'from-red-500 to-orange-500',
    'from-orange-500 to-yellow-500',
    'from-yellow-500 to-red-500'
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-red-400 text-lg font-semibold">
        <Flame className="h-5 w-5 animate-pulse" />
        Burned Tokens
      </div>
      <Card className="border-red-500/30 h-full">
        <CardContent className="space-y-6 px-3 sm:px-6 pt-6 pb-6 h-full flex flex-col justify-between">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Loading burn data...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <span className="text-sm text-red-400">Failed to load burn data</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Burn Display */}
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-red-300">
                  {hasTokenData && tokenData
                    ? `${Number(formatUnits(tokenData.burnedTokens, tokenData.decimals)).toLocaleString()} ${tokenData.symbol}`
                    : '15,420 LPB'
                  }
                </div>
                <div className="text-sm text-muted-foreground">Permanently Removed</div>
              </div>

              {/* Burn Rate */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Supply Reduction</span>
                  <span className="text-sm font-medium text-red-400">
                    {hasTokenData && tokenData
                      ? `${tokenData.burnedPercentage.toFixed(2)}%`
                      : '1.54%'
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Supply</span>
                  <span className="text-sm font-medium text-red-400">
                    {hasTokenData && tokenData
                      ? `${Number(formatUnits(tokenData.currentSupply, tokenData.decimals)).toLocaleString()} ${tokenData.symbol}`
                      : '984,580 LPB'
                    }
                  </span>
                </div>
              </div>

              {/* Burn Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Burn Progress</span>
                  <span className="text-red-400">
                    {hasTokenData && tokenData
                      ? `${tokenData.burnedPercentage.toFixed(2)}%`
                      : '1.54%'
                    }
                  </span>
                </div>
                <div className="h-3 bg-red-900/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out animate-pulse"
                    style={{
                      width: `${hasTokenData && tokenData
                        ? Math.min(tokenData.burnedPercentage, 100)
                        : 1.54
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Burn Mechanisms */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-xs">
              <Zap className="h-3 w-3 text-yellow-500" />
              <span className="text-muted-foreground">Hyperloop Burns</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingDown className="h-3 w-3 text-red-500" />
              <span className="text-muted-foreground">Burnloop Cycles</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
