'use client';

import { useState, useEffect } from 'react';
import { useReadContract } from 'wagmi';
import { formatUnits } from 'viem';

// LPB Token contract address (for explorer page)
const LPB_TOKEN_ADDRESS = '0x001bFF4b6da770f445A740227224D3c8b48e6fb2' as const;
// Yield Reactor contract address (for getting pool address)
const YIELD_REACTOR_ADDRESS = '0xdb6a2fc2bc6e77d9fdfdfc588befdbb9c055bede' as const;

// Yield Reactor ABI (to get token and pool addresses)
const YIELD_REACTOR_ABI = [
  {
    "inputs": [],
    "name": "LBP",
    "outputs": [
      {
        "internalType": "contract LoopBurn",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "LIQUIDITY_POOL",
    "outputs": [
      {
        "internalType": "contract IRamsesV3Pool",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Standard ERC20 ABI
const ERC20_ABI = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Ramses V3 Pool ABI (basic functions for liquidity data)
const RAMSES_V3_POOL_ABI = [
  {
    "inputs": [],
    "name": "token0",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "token1",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "liquidity",
    "outputs": [
      {
        "internalType": "uint128",
        "name": "",
        "type": "uint128"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

interface TokenData {
  totalSupply: bigint;
  currentSupply: bigint;
  burnedTokens: bigint;
  burnedPercentage: number;
  name: string;
  symbol: string;
  decimals: number;
}

interface LiquidityData {
  token0Address: string;
  token1Address: string;
  token0Balance: bigint;
  token1Balance: bigint;
  token0Symbol: string;
  token1Symbol: string;
  totalLiquidity: bigint;
}

interface HolderData {
  address: string;
  balance: string;
  percentage: number;
  rank: number;
}

interface HoldersData {
  holders: HolderData[];
  totalHolders: number;
  lastUpdated: number;
}

export function useTokenData() {
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [liquidityData, setLiquidityData] = useState<LiquidityData | null>(null);
  const [holdersData, setHoldersData] = useState<HoldersData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use the direct LPB token address instead of fetching from yield reactor
  const lbpAddress = LPB_TOKEN_ADDRESS;
  const lbpError = null;

  console.log('🔍 useTokenData hook initialized with LPB address:', lbpAddress);

  // Function to fetch real holder data from SonicScan API
  const fetchHoldersData = async (): Promise<HoldersData | null> => {
    try {
      console.log('🔍 Fetching real holder data from SonicScan...');

      // Note: SonicScan doesn't have a direct holders endpoint, so we'll use a placeholder
      // In a real implementation, you would need to:
      // 1. Get an API key from SonicScan
      // 2. Use the tokentx endpoint to analyze transfer events
      // 3. Build holder balances from transfer history

      // For now, we'll return null to indicate real data is not available
      // and fall back to demo data in the component

      console.log('⚠️ Real holder data not available - SonicScan API requires complex analysis');
      return null;

    } catch (error) {
      console.error('❌ Error fetching holder data:', error);
      return null;
    }
  };

  // Get liquidity pool address from yield reactor
  const { data: poolAddress, error: poolError } = useReadContract({
    address: YIELD_REACTOR_ADDRESS,
    abi: YIELD_REACTOR_ABI,
    functionName: 'LIQUIDITY_POOL',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get token data directly from the LPB token contract
  const { data: totalSupply } = useReadContract({
    address: lbpAddress,
    abi: ERC20_ABI,
    functionName: 'totalSupply',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: tokenName } = useReadContract({
    address: lbpAddress,
    abi: ERC20_ABI,
    functionName: 'name',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: tokenSymbol } = useReadContract({
    address: lbpAddress,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: tokenDecimals } = useReadContract({
    address: lbpAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get pool token addresses
  const { data: token0Address } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: RAMSES_V3_POOL_ABI,
    functionName: 'token0',
    query: {
      enabled: !!poolAddress,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: token1Address } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: RAMSES_V3_POOL_ABI,
    functionName: 'token1',
    query: {
      enabled: !!poolAddress,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get pool liquidity
  const { data: poolLiquidity } = useReadContract({
    address: poolAddress as `0x${string}`,
    abi: RAMSES_V3_POOL_ABI,
    functionName: 'liquidity',
    query: {
      enabled: !!poolAddress,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get token balances in the pool
  const { data: token0Balance } = useReadContract({
    address: token0Address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [poolAddress as `0x${string}`],
    query: {
      enabled: !!(token0Address && poolAddress),
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: token1Balance } = useReadContract({
    address: token1Address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [poolAddress as `0x${string}`],
    query: {
      enabled: !!(token1Address && poolAddress),
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get token symbols for the pool tokens
  const { data: token0Symbol } = useReadContract({
    address: token0Address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!token0Address,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  const { data: token1Symbol } = useReadContract({
    address: token1Address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'symbol',
    query: {
      enabled: !!token1Address,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Process token data when available
  useEffect(() => {
    if (totalSupply && tokenName && tokenSymbol && tokenDecimals !== undefined) {
      console.log('✅ Token data received:', {
        totalSupply: totalSupply.toString(),
        name: tokenName,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        address: lbpAddress
      });

      // For now, assume initial supply was 1,000,000 tokens (this could be fetched from contract events)
      const INITIAL_SUPPLY = BigInt(1000000) * BigInt(10 ** Number(tokenDecimals));
      const currentSupply = totalSupply as bigint;
      const burnedTokens = INITIAL_SUPPLY - currentSupply;
      const burnedPercentage = Number(burnedTokens * BigInt(10000) / INITIAL_SUPPLY) / 100;

      setTokenData({
        totalSupply: INITIAL_SUPPLY,
        currentSupply,
        burnedTokens,
        burnedPercentage,
        name: tokenName as string,
        symbol: tokenSymbol as string,
        decimals: Number(tokenDecimals),
      });

      console.log('✅ Token data processed:', {
        currentSupply: currentSupply.toString(),
        burnedTokens: burnedTokens.toString(),
        burnedPercentage: burnedPercentage.toFixed(2) + '%'
      });
    }
  }, [totalSupply, tokenName, tokenSymbol, tokenDecimals, lbpAddress]);

  // Process liquidity data when available
  useEffect(() => {
    if (token0Address && token1Address && token0Balance && token1Balance && token0Symbol && token1Symbol && poolLiquidity) {
      setLiquidityData({
        token0Address: token0Address as string,
        token1Address: token1Address as string,
        token0Balance: token0Balance as bigint,
        token1Balance: token1Balance as bigint,
        token0Symbol: token0Symbol as string,
        token1Symbol: token1Symbol as string,
        totalLiquidity: poolLiquidity as bigint,
      });
    }
  }, [token0Address, token1Address, token0Balance, token1Balance, token0Symbol, token1Symbol, poolLiquidity]);

  // Update loading state
  useEffect(() => {
    if (poolError) {
      setError(poolError?.message || 'Failed to fetch pool address');
      setIsLoading(false);
    } else if (lbpAddress) {
      // We have the token address, so we can start loading
      setIsLoading(false);
    }
  }, [lbpAddress, poolAddress, poolError]);

  // Fetch holders data on component mount
  useEffect(() => {
    const loadHoldersData = async () => {
      const holders = await fetchHoldersData();
      setHoldersData(holders);
    };

    loadHoldersData();
  }, []);

  return {
    tokenData,
    liquidityData,
    holdersData,
    isLoading,
    error,
    lbpAddress: lbpAddress,
    poolAddress: poolAddress as string,
    hasTokenData: !!tokenData,
    hasLiquidityData: !!liquidityData,
    hasHoldersData: !!holdersData,
  };
}
