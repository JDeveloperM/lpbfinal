'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplets, TrendingUp, Lock } from "lucide-react"
export default function LiquidityVisualization() {

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-blue-400 text-lg font-semibold">
        <Droplets className="h-5 w-5" />
        Liquidity Pool
      </div>
      <Card className="border-blue-500/30 h-full">
        <CardContent className="space-y-6 px-3 sm:px-6 pt-6 pb-6 h-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Main Liquidity Display */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-300">$2,847,392</div>
              <div className="text-sm text-muted-foreground">Total Value Locked</div>
            </div>

            {/* Liquidity Composition */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">LPB Tokens</span>
                <span className="text-sm font-medium">900,000 LPB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sonic (S)</span>
                <span className="text-sm font-medium">1,423,696 S</span>
              </div>
            </div>

            {/* Liquidity Lock Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Liquidity Locked</span>
                <span className="text-blue-400 font-medium">90%</span>
              </div>
              <div className="h-3 bg-blue-900/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: '90%' }}
                />
              </div>
              <div className="text-xs text-muted-foreground text-center">
                900,000 LPB permanently locked
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-xs">
              <Lock className="h-3 w-3 text-orange-500" />
              <span className="text-muted-foreground">Locked Forever</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">Auto-Compounding</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
