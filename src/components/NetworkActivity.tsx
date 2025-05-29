'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart, Tooltip } from "recharts"
import { Activity, Zap, TrendingUp, Clock } from "lucide-react"
import { useState, useEffect } from "react"

// Generate real-time activity data
const generateActivityData = () => {
  const data = []
  const now = Date.now()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now - i * 60 * 60 * 1000) // Last 24 hours
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      timestamp: time.getTime(),
      volume: Math.random() * 50000 + 10000,
      transactions: Math.floor(Math.random() * 200 + 50),
      burns: Math.floor(Math.random() * 500 + 100),
      holders: 1247 + Math.floor(Math.random() * 20 - 10), // Slight variation
    })
  }

  return data
}

export default function NetworkActivity() {
  const [activityData, setActivityData] = useState<any[]>([])
  const [currentMetrics, setCurrentMetrics] = useState({
    volume: 0,
    transactions: 0,
    burns: 0,
    holders: 0
  })
  const [pulsePhase, setPulsePhase] = useState(0)

  useEffect(() => {
    const data = generateActivityData()
    setActivityData(data)
    setCurrentMetrics({
      volume: data[data.length - 1]?.volume || 0,
      transactions: data[data.length - 1]?.transactions || 0,
      burns: data[data.length - 1]?.burns || 0,
      holders: data[data.length - 1]?.holders || 0
    })

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newData = [...data]
      const lastPoint = newData[newData.length - 1]
      const newPoint = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        timestamp: Date.now(),
        volume: Math.max(0, lastPoint.volume + (Math.random() - 0.5) * 5000),
        transactions: Math.max(0, lastPoint.transactions + Math.floor((Math.random() - 0.5) * 20)),
        burns: Math.max(0, lastPoint.burns + Math.floor((Math.random() - 0.5) * 50)),
        holders: Math.max(0, lastPoint.holders + Math.floor((Math.random() - 0.5) * 2))
      }

      newData.push(newPoint)
      newData.shift() // Remove oldest point

      setActivityData(newData)
      setCurrentMetrics({
        volume: newPoint.volume,
        transactions: newPoint.transactions,
        burns: newPoint.burns,
        holders: newPoint.holders
      })
    }, 3000)

    const pulseInterval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 3)
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(pulseInterval)
    }
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="font-semibold text-sm mb-2">{label}</div>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const pulseColors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500']

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-green-950/20 to-blue-950/20 border-green-500/30">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Network nodes */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 ${pulseColors[i % 3]} rounded-full opacity-60 animate-pulse`}
            style={{
              left: `${10 + i * 9}%`,
              top: `${15 + (i % 4) * 20}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: '2s'
            }}
          />
        ))}

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          {[...Array(5)].map((_, i) => (
            <line
              key={i}
              x1={`${20 + i * 15}%`}
              y1={`${30 + i * 10}%`}
              x2={`${40 + i * 10}%`}
              y2={`${50 + i * 5}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </svg>
      </div>

      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-green-400">
          <Activity className="h-5 w-5 animate-pulse" />
          Network Activity
          <div className="ml-auto flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            <span className="text-xs text-muted-foreground">LIVE</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 space-y-6">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-green-400">
              ${currentMetrics.volume.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">24h Volume</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-blue-400">
              {currentMetrics.transactions.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Transactions</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-red-400">
              {currentMetrics.burns.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Tokens Burned</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-purple-400">
              {currentMetrics.holders.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Holders</div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="volume"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#volumeGradient)"
                name="Volume ($)"
              />
              <Area
                type="monotone"
                dataKey="transactions"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#transactionGradient)"
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Activity Indicators */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-xs">
            <Zap className="h-3 w-3 text-yellow-500 animate-pulse" />
            <span className="text-muted-foreground">High Activity</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">Growing Network</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock className="h-3 w-3 text-blue-500" />
            <span className="text-muted-foreground">Real-time Data</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
