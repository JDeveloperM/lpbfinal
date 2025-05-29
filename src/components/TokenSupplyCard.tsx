'use client';

import { Card, CardContent } from "@/components/ui/card"
import { PieChart, Users, Droplets, Flame } from "lucide-react"

export default function TokenSupplyCard() {
  const supplyData = [
    {
      label: "LP Supply",
      percentage: 5,
      value: "50,000 LPB",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-900/30",
      icon: Droplets,
      iconColor: "text-blue-400"
    },
    {
      label: "Burned Supply",
      percentage: 25,
      value: "250,000 LPB",
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-900/30",
      icon: Flame,
      iconColor: "text-red-400"
    },
    {
      label: "Holder Supply",
      percentage: 70,
      value: "700,000 LPB",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-900/30",
      icon: Users,
      iconColor: "text-green-400"
    }
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-green-400 text-lg font-semibold">
        <PieChart className="h-5 w-5" />
        Token Information
      </div>
      <Card className="border-green-500/30 h-full">
        <CardContent className="space-y-6 px-3 sm:px-6 pt-6 pb-6 h-full flex flex-col justify-between">
          <div className="space-y-6">
            {/* Main Supply Display */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-green-300">1,000,000</div>
              <div className="text-sm text-muted-foreground">Total LPB Supply</div>
            </div>

            {/* Supply Distribution Bars */}
            <div className="space-y-4">
              {supplyData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${item.iconColor}`}>
                        {item.percentage}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.value}
                      </div>
                    </div>
                  </div>
                  <div className={`h-3 ${item.bgColor} rounded-full overflow-hidden`}>
                    <div
                      className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supply Status */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-xs">
              <PieChart className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">Live Distribution</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Flame className="h-3 w-3 text-red-500" />
              <span className="text-muted-foreground">Deflationary Model</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
