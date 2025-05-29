'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Flame, TrendingDown, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export default function BurnedTokensCard() {
  const [flameIntensity, setFlameIntensity] = useState(0)
  const [burnCount, setBurnCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFlameIntensity(prev => (prev + 1) % 3)
    }, 800)

    const burnInterval = setInterval(() => {
      setBurnCount(prev => prev + Math.floor(Math.random() * 10) + 1)
    }, 3000)

    return () => {
      clearInterval(interval)
      clearInterval(burnInterval)
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
          <div className="space-y-6">
            {/* Main Burn Display */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-red-300">
                {(15420 + burnCount).toLocaleString()} LPB
              </div>
              <div className="text-sm text-muted-foreground">Permanently Removed</div>
            </div>

            {/* Burn Rate */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last 24h Burns</span>
                <span className="text-sm font-medium text-red-400">2,847 LPB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Burn Rate</span>
                <span className="text-sm font-medium text-red-400">~118 LPB/hour</span>
              </div>
            </div>

            {/* Burn Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Supply Reduction</span>
                <span className="text-red-400">1.54%</span>
              </div>
              <div className="h-3 bg-red-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-1000 ease-out animate-pulse"
                  style={{ width: '1.54%' }}
                />
              </div>
            </div>
          </div>

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
