'use client';

import { Card, CardContent } from "@/components/ui/card"
import { Coins, Flame, Receipt, Lock } from "lucide-react"
import LiquidityVisualization from "@/components/LiquidityVisualization"
import BurnedTokensCard from "@/components/BurnedTokensCard"
import HoldersVisualization from "@/components/HoldersVisualization"
import TokenSupplyCard from "@/components/TokenSupplyCard"

export default function TokenInformation() {
  return (
    <Card className="w-full sm:w-4/5 mx-auto bg-transparent border-0">
      <CardContent className="px-2 sm:px-6">
        <div className="grid gap-4 sm:gap-8 mt-2 sm:mt-4">

          {/* Token Details Section - MOVED AND RESTYLED */}
          <div className="mt-2 sm:mt-4 mb-2">
            <Card> {/* Added Card component for background and border */}
              <CardContent className="py-3 sm:py-4 px-3 sm:px-6"> {/* Added CardContent and adjusted padding */}
                <ul className="flex flex-col sm:flex-row flex-wrap justify-around items-center gap-x-6 gap-y-3 text-xs sm:text-sm">
                  <li className="flex items-center gap-2">
                    <Coins className="h-4 w-4 text-blue-500" />
                    <span>1,000,000 LPB</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-green-500" />
                    <span>Tax: 0% Buy/Sell</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-orange-500" />
                    <span>LP: Locked ∞</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span>Deflationary Burns</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Holders Visualization */}
          <div className="mt-4 sm:mt-8">
            <HoldersVisualization />
          </div>

          {/* New Visualizations Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-8">
            <LiquidityVisualization />
            <BurnedTokensCard />
            <TokenSupplyCard />
          </div>

        </div>
      </CardContent>
    </Card>
  )
}