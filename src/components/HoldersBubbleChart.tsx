'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, ResponsiveContainer, Cell, Tooltip } from "recharts"
import { Users, Crown, Sparkles, Eye } from "lucide-react"
import { useState, useEffect } from "react"

// Generate more sophisticated holder data with clustering
const generateBubbleData = () => {
  const holders = []

  // Whale cluster (top 10)
  for (let i = 0; i < 10; i++) {
    const percentage = Math.random() * 6 + 2 // 2-8%
    holders.push({
      id: i,
      name: `Whale #${i + 1}`,
      x: Math.random() * 30 + 70, // High holding time
      y: percentage,
      z: percentage * 1000, // Bubble size
      category: 'whale',
      holdingTime: Math.floor(Math.random() * 200 + 100), // Days
      transactions: Math.floor(Math.random() * 50 + 10),
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  // Institutional cluster
  for (let i = 10; i < 25; i++) {
    const percentage = Math.random() * 2 + 0.5 // 0.5-2.5%
    holders.push({
      id: i,
      name: `Institution #${i - 9}`,
      x: Math.random() * 20 + 60, // Medium-high holding time
      y: percentage,
      z: percentage * 1000,
      category: 'institution',
      holdingTime: Math.floor(Math.random() * 150 + 80),
      transactions: Math.floor(Math.random() * 30 + 5),
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  // Active traders cluster
  for (let i = 25; i < 50; i++) {
    const percentage = Math.random() * 1 + 0.1 // 0.1-1.1%
    holders.push({
      id: i,
      name: `Trader #${i - 24}`,
      x: Math.random() * 40 + 10, // Lower holding time, more active
      y: percentage,
      z: percentage * 1000,
      category: 'trader',
      holdingTime: Math.floor(Math.random() * 60 + 5),
      transactions: Math.floor(Math.random() * 200 + 50),
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  // Long-term holders cluster
  for (let i = 50; i < 100; i++) {
    const percentage = Math.random() * 0.5 + 0.05 // 0.05-0.55%
    holders.push({
      id: i,
      name: `HODLer #${i - 49}`,
      x: Math.random() * 30 + 70, // High holding time
      y: percentage,
      z: percentage * 1000,
      category: 'hodler',
      holdingTime: Math.floor(Math.random() * 300 + 150),
      transactions: Math.floor(Math.random() * 10 + 1),
      address: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
    })
  }

  return holders.sort((a, b) => b.y - a.y)
}

const getColorByCategory = (category: string) => {
  switch (category) {
    case 'whale': return '#3B82F6' // Blue
    case 'institution': return '#8B5CF6' // Purple
    case 'trader': return '#EF4444' // Red
    case 'hodler': return '#10B981' // Green
    default: return '#6B7280' // Gray
  }
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'whale': return <Crown className="h-3 w-3" />
    case 'institution': return <Sparkles className="h-3 w-3" />
    case 'trader': return <Eye className="h-3 w-3" />
    case 'hodler': return <Users className="h-3 w-3" />
    default: return <Users className="h-3 w-3" />
  }
}

export default function HoldersBubbleChart() {
  const [holders, setHolders] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hoveredHolder, setHoveredHolder] = useState<any>(null)

  useEffect(() => {
    setHolders(generateBubbleData())
  }, [])

  const filteredHolders = selectedCategory
    ? holders.filter(h => h.category === selectedCategory)
    : holders

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-xl max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            {getCategoryIcon(data.category)}
            <span className="font-semibold text-sm">{data.name}</span>
          </div>
          <div className="space-y-1 text-xs">
            <div className="text-muted-foreground">{data.address}</div>
            <div className="font-medium text-primary">{data.y.toFixed(3)}% of supply</div>
            <div className="text-muted-foreground">{(data.y * 10000).toLocaleString()} LPB</div>
            <div className="text-muted-foreground">Holding: {data.holdingTime} days</div>
            <div className="text-muted-foreground">Transactions: {data.transactions}</div>
          </div>
        </div>
      )
    }
    return null
  }

  const categories = [
    { name: 'whale', label: 'Whales', color: '#3B82F6', count: holders.filter(h => h.category === 'whale').length },
    { name: 'institution', label: 'Institutions', color: '#8B5CF6', count: holders.filter(h => h.category === 'institution').length },
    { name: 'trader', label: 'Traders', color: '#EF4444', count: holders.filter(h => h.category === 'trader').length },
    { name: 'hodler', label: 'HODLers', color: '#10B981', count: holders.filter(h => h.category === 'hodler').length },
  ]

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-950/20 to-purple-950/20 border-indigo-500/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-5 animate-pulse"
            style={{
              width: `${20 + i * 10}px`,
              height: `${20 + i * 10}px`,
              background: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)`,
              left: `${5 + i * 12}%`,
              top: `${10 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: '4s'
            }}
          />
        ))}
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-indigo-400">
          <Users className="h-5 w-5" />
          Holder Behavior Analysis
        </CardTitle>
        <div className="text-sm text-muted-foreground">
          Bubble size = holding percentage • X-axis = holding time • Y-axis = token percentage
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !selectedCategory
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            All ({holders.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name === selectedCategory ? null : cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                selectedCategory === cat.name
                  ? 'text-white shadow-lg'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
              style={{
                backgroundColor: selectedCategory === cat.name ? cat.color : undefined
              }}
            >
              {getCategoryIcon(cat.name)}
              {cat.label} ({cat.count})
            </button>
          ))}
        </div>

        {/* Bubble Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart data={filteredHolders}>
              <XAxis
                type="number"
                dataKey="x"
                name="Holding Time (Days)"
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Token %"
                domain={[0, 'dataMax']}
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <ZAxis type="number" dataKey="z" range={[20, 400]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={filteredHolders}>
                {filteredHolders.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getColorByCategory(entry.category)}
                    fillOpacity={0.7}
                    stroke={getColorByCategory(entry.category)}
                    strokeWidth={1}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="font-medium text-blue-400">Largest Whale</div>
            <div className="text-muted-foreground">{holders[0]?.y.toFixed(2)}% holding</div>
          </div>
          <div className="space-y-1">
            <div className="font-medium text-green-400">Avg Hold Time</div>
            <div className="text-muted-foreground">
              {Math.round(holders.reduce((acc, h) => acc + h.holdingTime, 0) / holders.length)} days
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
