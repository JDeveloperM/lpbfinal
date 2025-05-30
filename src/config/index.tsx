import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { Chain } from 'viem'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('NEXT_PUBLIC_PROJECT_ID is not defined. Please set it in .env.local')
}

// Sonic Mainnet configuration
export const sonic: Chain = {
  id: 146,
  name: 'Sonic',
  nativeCurrency: {
    decimals: 18,
    name: 'Sonic',
    symbol: 'S',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.soniclabs.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'SonicScan',
      url: 'https://sonicscan.org',
    },
  },
}

export const networks: [Chain, ...Chain[]] = [sonic]

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  projectId,
  networks,
})

export const config = wagmiAdapter.wagmiConfig