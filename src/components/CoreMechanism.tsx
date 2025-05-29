import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownToLine, ChartBarDecreasing, Flame, RefreshCcw, Timer, Clock } from "lucide-react"
import BurnCountdown from "@/components/BurnCountdown"
import BurnloopCountdown from "@/components/BurnloopCountdown"
import BurnloopButton from "@/components/BurnloopButton"

export default function CoreMechanism() {
  return (
    <Card className="border-0 bg-transparent">
      <CardContent className="space-y-4 md:space-y-8 p-0 md:p-6">

        {/* Protocol Benefits & Active Processes Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          <Card className="bg-[#191e29] border border-orange-500/20 hover:border-orange-500/40 transition-colors shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-3">
                <Flame className="h-6 w-6 text-orange-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">Supply Reduction</h4>
                  <p className="text-sm text-muted-foreground">Reduces circulating supply of $LPB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#191e29] border border-blue-500/20 hover:border-blue-500/40 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-3">
                <ChartBarDecreasing className="h-6 w-6 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">Volume Growth</h4>
                  <p className="text-sm text-muted-foreground">Increases trading volume through automation</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#191e29] border border-green-500/20 hover:border-green-500/40 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">Yield Incentives</h4>
                  <p className="text-sm text-muted-foreground">Rising APYs from increased fees</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#191e29] border border-purple-500/20 hover:border-purple-500/40 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <CardContent className="p-2 md:p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-6 w-6 text-purple-500 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-base">Active Processes</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">8-hour cycles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs">15-min hyperloop</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Unified Yield Reactor Dashboard */}
        <Card className="relative bg-gradient-to-br from-[#191e29] to-[#1a1f2e] border border-orange-500/20 shadow-[0_0_25px_rgba(249,115,22,0.15)] overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
            style={{
              backgroundImage: "url('/reactor.png')"
            }}
          />
          <CardHeader className="relative text-center pb-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
              Yield Reactor Dashboard
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Automated deflationary engine with dual burn mechanisms
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Automation Controls Heading */}
            <h3 className="text-lg font-semibold text-center mb-6 text-orange-400">Automation Controls</h3>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Left Panel - 8-Hour Cycle */}
              <div className="space-y-4">
                {/* 8-Hour Burn Cycle */}
                <Card className="bg-[#0f1419] border border-orange-500/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Flame className="h-4 w-4 text-orange-500" />
                        8-Hour Automation Cycle
                      </CardTitle>
                      <div className="text-xs text-orange-500 animate-pulse">LIVE</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <BurnCountdown />
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel - Hyperloop */}
              <div className="space-y-4">
                {/* Hyperloop Mechanism */}
                <Card className="bg-[#0f1419] border border-blue-500/30">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Flame className="h-4 w-4 text-blue-500" />
                        Hyperloop Mechanism
                      </CardTitle>
                      <div className="text-xs text-blue-500 animate-pulse">15MIN</div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <BurnloopCountdown />
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Token Mechanism Flow - Bottom Section */}
        <Card className="bg-transparent border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-500 to-green-500 bg-clip-text text-transparent">
              Token Mechanism Flow
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Automated 4-step process executed during 8-hour cycles
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Step 1 */}
              <Card className="bg-[#191e29] border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Timer className="w-6 h-6 text-purple-500" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Claims Fees</h4>
                  <p className="text-xs text-muted-foreground">From protocol owned liquidity</p>
                  <div className="mt-2 text-xs text-purple-400">Step 1</div>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="bg-[#191e29] border border-blue-500/30 hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <ArrowDownToLine className="w-6 h-6 text-blue-500" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Withdraws 1% POL</h4>
                  <p className="text-xs text-muted-foreground">From Protocol Owned Liquidity</p>
                  <div className="mt-2 text-xs text-blue-400">Step 2</div>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="bg-[#191e29] border border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Flame className="w-6 h-6 text-orange-500" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Burns $LPB</h4>
                  <p className="text-xs text-muted-foreground">From withdrawn LP tokens</p>
                  <div className="mt-2 text-xs text-orange-400">Step 3</div>
                </CardContent>
              </Card>

              {/* Step 4 */}
              <Card className="bg-[#191e29] border border-green-500/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                <CardContent className="p-2 md:p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <RefreshCcw className="w-6 h-6 text-green-500" />
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Recycles $wS</h4>
                  <p className="text-xs text-muted-foreground">To buy back and recycle $LPB</p>
                  <div className="mt-2 text-xs text-green-400">Step 4</div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

      </CardContent>
    </Card>
  )
}