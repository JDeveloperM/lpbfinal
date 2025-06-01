'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, TrendingUp, Wallet, Loader2, ExternalLink } from 'lucide-react'
import { useTokenData } from '@/hooks/use-token-data'
import { useRealHolders } from '@/hooks/use-real-holders'
import { formatUnits } from 'viem'

interface Holder {
  name: string
  value: number
  category: string
  address: string
}

// Demo data generation function removed - now using only real blockchain data

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

  const { tokenData, isLoading: tokenLoading, error: tokenError, hasTokenData } = useTokenData()
  const {
    holders: realHolders,
    isLoading: holdersLoading,
    error: holdersError,
    hasRealData,
    totalHolders
  } = useRealHolders()

  useEffect(() => {
    if (hasRealData && realHolders.length > 0) {
      // Convert real holder data to our format - ONLY real data, no demo
      const convertedHolders = realHolders.map((holder) => ({
        name: `Holder #${holder.rank}`,
        value: holder.percentage,
        category: holder.percentage > 2 ? 'whale' : holder.percentage > 1 ? 'medium' : 'small',
        address: holder.address
      }));

      setHolders(convertedHolders);
      console.log('✅ Using ONLY real holder data:', convertedHolders.length, 'holders');
    } else {
      // If no real data, show empty state
      setHolders([]);
      console.log('⚠️ No real holder data available');
    }
  }, [realHolders, hasRealData])

  return (
    <div className="space-y-3">
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-orange-400 text-lg font-semibold">
          <Users className="h-5 w-5" />
          Top 100 Real Holders
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground">
            {hasRealData
              ? `Real SonicScan API data • ${totalHolders > 0 ? totalHolders.toLocaleString() + ' total holders' : 'Loading holder count...'}`
              : 'Loading real holder data from SonicScan...'
            }
          </p>
          <a
            href="https://sonicscan.org/token/tokenholderchart/0x001bFF4b6da770f445A740227224D3c8b48e6fb2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 underline"
          >
            View Complete Data on SonicScan
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
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
        {(tokenLoading || holdersLoading) ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {holdersLoading ? 'Loading real holder data...' : 'Loading token data...'}
              </span>
            </div>
          </div>
        ) : (tokenError && holdersError) ? (
          <div className="flex items-center justify-center h-32">
            <span className="text-sm text-red-400">Using demo holder data</span>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold" style={{ color: '#fd7b0f' }}>
                  {holders.filter(h => h.category === 'whale').length}
                </div>
                <div className="text-xs text-muted-foreground">Whales (>2%)</div>
              </div>
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold" style={{ color: '#2a4aff' }}>
                  {holders.filter(h => h.category === 'medium').length}
                </div>
                <div className="text-xs text-muted-foreground">Medium (1-2%)</div>
              </div>
              <div className="space-y-1">
                <div className="text-base sm:text-lg font-bold" style={{ color: '#607d8b' }}>
                  {holders.filter(h => h.category === 'small').length}
                </div>
                <div className="text-xs text-muted-foreground">Small (&lt;1%)</div>
              </div>
            </div>
          </>
        )}

        {/* Holders Grid Visualization */}
        {!(tokenLoading || holdersLoading) && holders.length > 0 && (
          <div className="p-2 sm:p-4">
            <div className="text-xs text-center text-muted-foreground mb-2">
              Showing top {holders.length} holders from SonicScan API
            </div>
            <div
              className="w-full max-w-full mx-auto overflow-x-auto"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(20, 1fr)',
                gridTemplateRows: 'repeat(5, 1fr)',
                gap: '2px',
                aspectRatio: '4/1'
              }}
            >
            {holders.slice(0, 100).map((holder, index) => (
              <div
                key={index}
                className="aspect-square transition-all duration-200 hover:scale-110 cursor-pointer relative overflow-hidden p-1"
                style={{
                  borderRadius: '50%',
                  boxShadow: `
                    0 0 6px ${getColorByCategory(holder.category)}40,
                    0 0 12px ${getColorByCategory(holder.category)}20,
                    inset 0 1px 0 rgba(255,255,255,0.3),
                    inset 0 -1px 0 rgba(0,0,0,0.5),
                    0 1px 4px rgba(0,0,0,0.6)
                  `,
                  background: `
                    radial-gradient(circle at 30% 30%, ${getColorByCategory(holder.category)}FF, ${getColorByCategory(holder.category)}CC 40%, ${getDarkerColorByCategory(holder.category)}AA 70%, ${getDarkerColorByCategory(holder.category)}88)
                  `,
                  border: `1px solid ${getColorByCategory(holder.category)}60`,
                  position: 'relative',
                  transform: 'scale(0.8)',
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
        )}

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
                  {hoveredHolder.name} • SonicScan API
                </div>
                <div className="text-lg font-bold text-white">
                  {hoveredHolder.value.toFixed(3)}% of supply
                </div>
                <div className="text-xs text-muted-foreground">
                  {hasTokenData && tokenData
                    ? `${(hoveredHolder.value * Number(formatUnits(tokenData.totalSupply, tokenData.decimals)) / 100).toLocaleString()} ${tokenData.symbol} tokens`
                    : `${(hoveredHolder.value * 10000).toLocaleString()} LPB tokens`
                  }
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {hoveredHolder.address}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Distribution Summary */}
        {!(tokenLoading || holdersLoading) && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-muted-foreground">
                {hasRealData ? 'SonicScan API Data' : 'Loading API Data...'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Wallet className="h-3 w-3 text-blue-500" />
              <span className="text-muted-foreground">
                {hasRealData ? `${totalHolders.toLocaleString()} Total Holders` : 'Fetching holder count...'}
              </span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!(tokenLoading || holdersLoading) && holders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">No Holder Data Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Unable to load real holder data at this time.
            </p>
            <a
              href="https://sonicscan.org/token/tokenholderchart/0x001bFF4b6da770f445A740227224D3c8b48e6fb2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 underline"
            >
              View on SonicScan
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  )
}

export default HoldersVisualization
