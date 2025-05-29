'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Wallet } from 'lucide-react'

interface Holder {
  name: string
  value: number
  category: string
  address: string
}

const generateHolderData = (): Holder[] => {
  const holders: Holder[] = []

  // Top 10 holders (whales) - positions 1-10
  const whalePercentages = [8.5, 6.2, 4.8, 3.9, 3.1, 2.7, 2.3, 1.9, 1.6, 1.4]
  whalePercentages.forEach((percentage, i) => {
    holders.push({
      name: `Whale #${i + 1}`,
      value: percentage,
      category: 'whale',
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  })

  // Medium holders (11-30) - positions 11-30
  for (let i = 10; i < 30; i++) {
    const percentage = Math.random() * 1.2 + 0.3
    holders.push({
      name: `Holder #${i + 1}`,
      value: percentage,
      category: 'medium',
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  // Small holders (31-100) - positions 31-100
  for (let i = 30; i < 100; i++) {
    const percentage = Math.random() * 0.3 + 0.05
    holders.push({
      name: `Holder #${i + 1}`,
      value: percentage,
      category: 'small',
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  // Ensure we have exactly 100 holders
  console.log(`Generated ${holders.length} holders`)
  return holders.sort((a, b) => b.value - a.value)
}

const getColorByCategory = (category: string): string => {
  switch (category) {
    case 'whale':
      return '#fd7b0f'
    case 'medium':
      return '#2a4aff'
    case 'small':
      return '#607d8b'
    default:
      return '#6B7280'
  }
}

const getDarkerColorByCategory = (category: string): string => {
  switch (category) {
    case 'whale':
      return '#8a4008' // Much darker orange
    case 'medium':
      return '#162890' // Much darker blue
    case 'small':
      return '#37474f' // Much darker blue-grey
    default:
      return '#374151'
  }
}

const HoldersVisualization: React.FC = () => {
  const [holders, setHolders] = useState<Holder[]>([])
  const [hoveredHolder, setHoveredHolder] = useState<Holder | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setHolders(generateHolderData())
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-2 text-orange-400 text-lg font-semibold">
        <Users className="h-5 w-5" />
        Top 100 Holders Distribution
      </div>
      <Card className="relative bg-gradient-to-br from-[#191e29] to-[#1a1f2e] border border-orange-500/20 shadow-[0_0_25px_rgba(249,115,22,0.15)] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{
            backgroundImage: "url('/explorergrid.jpg')"
          }}
        />
        <CardContent className="space-y-4 sm:space-y-6 px-3 sm:px-6 py-4 sm:py-6 relative" style={{ zIndex: 2 }}>
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold" style={{ color: '#fd7b0f' }}>10</div>
            <div className="text-xs text-muted-foreground">Whales (>1%)</div>
          </div>
          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold" style={{ color: '#2a4aff' }}>20</div>
            <div className="text-xs text-muted-foreground">Medium (0.3-1%)</div>
          </div>
          <div className="space-y-1">
            <div className="text-base sm:text-lg font-bold" style={{ color: '#607d8b' }}>70</div>
            <div className="text-xs text-muted-foreground">Small (&lt;0.3%)</div>
          </div>
        </div>

        {/* Holders Grid Visualization */}
        <div className="p-2 sm:p-4">
          <div className="text-xs text-center text-muted-foreground mb-2">
            Showing {Math.min(holders.length, 100)} holders
          </div>
          <div
            className="w-full max-w-full mx-auto overflow-x-auto holders-grid"
            style={{
              display: 'grid',
              gap: '3px'
            }}
          >
            {holders.slice(0, 100).map((holder, index) => (
              <div
                key={index}
                className="aspect-square transition-all duration-200 hover:scale-110 cursor-pointer relative overflow-hidden"
                style={{
                  borderRadius: '50%',
                  boxShadow: `
                    0 0 10px ${getColorByCategory(holder.category)}40,
                    0 0 20px ${getColorByCategory(holder.category)}20,
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -1px 0 rgba(0,0,0,0.5),
                    0 2px 8px rgba(0,0,0,0.6)
                  `,
                  background: `
                    radial-gradient(circle at 30% 30%, ${getColorByCategory(holder.category)}FF, ${getColorByCategory(holder.category)}CC 40%, ${getDarkerColorByCategory(holder.category)}AA 70%, ${getDarkerColorByCategory(holder.category)}88)
                  `,
                  border: `1px solid ${getColorByCategory(holder.category)}60`,
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  setHoveredHolder(holder)
                  const rect = e.currentTarget.getBoundingClientRect()
                  setTooltipPosition({
                    x: rect.left + rect.width / 2,
                    y: rect.top - 10
                  })
                }}
                onMouseLeave={() => setHoveredHolder(null)}
              >
                {/* Cyberpunk highlight effect */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `
                      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 30%, transparent 60%),
                      linear-gradient(135deg, ${getColorByCategory(holder.category)}30 0%, transparent 50%)
                    `,
                    borderRadius: '50%',
                  }}
                />
                {/* Pulse effect */}
                <div
                  className="absolute inset-0 pointer-events-none animate-pulse"
                  style={{
                    background: `radial-gradient(circle, ${getColorByCategory(holder.category)}20 0%, transparent 70%)`,
                    borderRadius: '50%',
                    animation: 'pulse 3s ease-in-out infinite',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Tooltip */}
        {hoveredHolder && (
          <div
            className="fixed z-50 pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <div className="bg-gray-900/95 backdrop-blur-sm border border-orange-500/30 rounded-lg p-3 shadow-xl">
              <div className="text-center space-y-1">
                <div className="font-semibold text-orange-400 text-sm">
                  {hoveredHolder.name}
                </div>
                <div className="text-lg font-bold text-white">
                  {hoveredHolder.value.toFixed(3)}% of supply
                </div>
                <div className="text-xs text-muted-foreground">
                  {(hoveredHolder.value * 10000).toLocaleString()} LPB tokens
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {hoveredHolder.address}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Distribution Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">Healthy Distribution</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Wallet className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">1,247 Total Holders</span>
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default HoldersVisualization
