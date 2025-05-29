import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function WalletConnect() {
  return (
    <Card className="w-[380px] bg-orange-500/90 backdrop-blur supports-[backdrop-filter]:bg-orange-500/90">
      <CardHeader>
        <CardTitle>Connect Wallet</CardTitle>
        <CardDescription>Connect your wallet to start using LoopBurn</CardDescription>
      </CardHeader>
      <CardContent>
        <appkit-button />
      </CardContent>
    </Card>
  )
}