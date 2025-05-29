'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';

const CONTRACT_ADDRESS = '0xD6Aa36aF8C559Ad10374b343bC54749aA00ddf52' as const;
const BASE_BURN_INTERVAL = 12 * 60 * 60; // 12 hours base interval
const HYPERLOOP_INTERVAL = 15 * 60; // 15 minutes for hyperloop
const BURNLOOP_INTERVAL = 8 * 60 * 60; // 8 hours for burnloop

// Real contract ABI - using the exact functions from your contract
const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'burnFUEGO',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'hyperloop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'burnloop',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextBurnTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextHyperloopTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'nextBurnloopTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'chaosTimes',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'chaosCap',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'FUEGO',
    outputs: [{ internalType: 'contract Fuego', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

// ERC20 ABI for reading FUEGO token balance
const ERC20_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

// Calculate current burn interval based on burned supply (from contract logic)
const calculateBurnInterval = (burnedSupply: bigint): number => {
  const TOKEN_SUPPLY = BigInt('100000000000000000000000000'); // 100M tokens with 18 decimals
  const BENCHMARK_SUPPLY = TOKEN_SUPPLY / BigInt(100); // 1M tokens

  const emberRate = Number(burnedSupply / BENCHMARK_SUPPLY);
  let interval = 12 * 60 * 60; // 12 hours base

  if (emberRate >= 5) interval += 6 * 60 * 60;   // +6h = 18h total
  if (emberRate >= 10) interval += 6 * 60 * 60;  // +6h = 24h total
  if (emberRate >= 15) interval += 6 * 60 * 60;  // +6h = 30h total
  if (emberRate >= 30) interval += 6 * 60 * 60;  // +6h = 36h total
  if (emberRate >= 50) interval += 12 * 60 * 60; // +12h = 48h total

  return interval;
};

export function useBurnCountdown() {
  const [timeLeft, setTimeLeft] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });
  const [hyperloopTimeLeft, setHyperloopTimeLeft] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });
  const [burnloopTimeLeft, setBurnloopTimeLeft] = useState<CountdownTime>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0
  });
  const [nextBurnTime, setNextBurnTime] = useState<number>(0);
  const [nextHyperloopTime, setNextHyperloopTime] = useState<number>(0);
  const [nextBurnloopTime, setNextBurnloopTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentInterval, setCurrentInterval] = useState<number>(BASE_BURN_INTERVAL);

  // Read the real contract data
  const { data: contractNextBurnTime, error: nextBurnError, isLoading: isContractLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextBurnTime',
    query: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  // Read hyperloop time
  const { data: contractNextHyperloopTime, error: nextHyperloopError, isLoading: isHyperloopLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextHyperloopTime',
    query: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  // Read burnloop time
  const { data: contractNextBurnloopTime, error: nextBurnloopError, isLoading: isBurnloopLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextBurnloopTime',
    query: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  });

  const { data: chaosTimes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'chaosTimes',
    query: {
      enabled: true,
    }
  });

  const { data: chaosCap } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'chaosCap',
    query: {
      enabled: true,
    }
  });

  // Get FUEGO token address
  const { data: fuegoAddress } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'FUEGO',
    query: {
      enabled: true,
    }
  });

  // Get burned supply (balance of address(0))
  const { data: burnedSupply } = useReadContract({
    address: fuegoAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: ['0x0000000000000000000000000000000000000000'],
    query: {
      enabled: !!fuegoAddress,
    }
  });

  // Calculate current interval when burned supply changes
  useEffect(() => {
    if (burnedSupply && typeof burnedSupply === 'bigint') {
      const interval = calculateBurnInterval(burnedSupply);
      setCurrentInterval(interval);
      console.log('🔥 Burned supply:', formatUnits(burnedSupply, 18), 'FUEGO');
      console.log('⏱️ Current burn interval:', interval / 3600, 'hours');
    }
  }, [burnedSupply]);

  // Initialize countdown with real contract data
  useEffect(() => {
    // Wait for contract data to load
    if (isContractLoading) {
      return;
    }

    // Use contract's nextBurnTime if available
    if (contractNextBurnTime && typeof contractNextBurnTime === 'bigint') {
      const contractTime = Number(contractNextBurnTime);
      setNextBurnTime(contractTime);
      setIsLoading(false);
      console.log('✅ Using real contract nextBurnTime:', contractTime);
      console.log('✅ Next burn at:', new Date(contractTime * 1000).toLocaleString());
      return;
    }

    // Handle contract read error
    if (nextBurnError) {
      console.error('❌ Error reading contract:', nextBurnError);
      // Fallback to demo mode
      const now = Math.floor(Date.now() / 1000);
      const randomTimeLeft = Math.floor(Math.random() * currentInterval);
      setNextBurnTime(now + randomTimeLeft);
      setIsLoading(false);
      console.log('⚠️ Using demo mode due to contract error');
      return;
    }

    // Still loading or no data yet
    if (!contractNextBurnTime && !nextBurnError) {
      console.log('⏳ Waiting for contract data...');
    }
  }, [contractNextBurnTime, nextBurnError, isContractLoading, currentInterval]);

  // Initialize hyperloop countdown with real contract data
  useEffect(() => {
    // Wait for contract data to load
    if (isHyperloopLoading) {
      return;
    }

    // Use contract's nextHyperloopTime if available
    if (contractNextHyperloopTime && typeof contractNextHyperloopTime === 'bigint') {
      const contractTime = Number(contractNextHyperloopTime);
      setNextHyperloopTime(contractTime);
      console.log('✅ Using real contract nextHyperloopTime:', contractTime);
      console.log('✅ Next hyperloop at:', new Date(contractTime * 1000).toLocaleString());
      return;
    }

    // Handle contract read error
    if (nextHyperloopError) {
      console.error('❌ Error reading hyperloop contract:', nextHyperloopError);
      // Fallback to demo mode
      const now = Math.floor(Date.now() / 1000);
      const randomTimeLeft = Math.floor(Math.random() * HYPERLOOP_INTERVAL);
      setNextHyperloopTime(now + randomTimeLeft);
      console.log('⚠️ Using demo mode for hyperloop due to contract error');
      return;
    }

    // Still loading or no data yet
    if (!contractNextHyperloopTime && !nextHyperloopError) {
      console.log('⏳ Waiting for hyperloop contract data...');
    }
  }, [contractNextHyperloopTime, nextHyperloopError, isHyperloopLoading]);

  // Initialize burnloop countdown with real contract data
  useEffect(() => {
    // Wait for contract data to load
    if (isBurnloopLoading) {
      return;
    }

    // Use contract's nextBurnloopTime if available
    if (contractNextBurnloopTime && typeof contractNextBurnloopTime === 'bigint') {
      const contractTime = Number(contractNextBurnloopTime);
      setNextBurnloopTime(contractTime);
      console.log('✅ Using real contract nextBurnloopTime:', contractTime);
      console.log('✅ Next burnloop at:', new Date(contractTime * 1000).toLocaleString());
      return;
    }

    // Handle contract read error
    if (nextBurnloopError) {
      console.error('❌ Error reading burnloop contract:', nextBurnloopError);
      // Fallback to demo mode
      const now = Math.floor(Date.now() / 1000);
      const randomTimeLeft = Math.floor(Math.random() * BURNLOOP_INTERVAL);
      setNextBurnloopTime(now + randomTimeLeft);
      console.log('⚠️ Using demo mode for burnloop due to contract error');
      return;
    }

    // Still loading or no data yet
    if (!contractNextBurnloopTime && !nextBurnloopError) {
      console.log('⏳ Waiting for burnloop contract data...');
    }
  }, [contractNextBurnloopTime, nextBurnloopError, isBurnloopLoading]);

  // Calculate countdown based on next burn time
  useEffect(() => {
    if (nextBurnTime === 0) return;

    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = Math.max(0, nextBurnTime - now);

      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds: secondsLeft
      });

      // Reset countdown when it reaches zero
      if (secondsLeft === 0) {
        const newNextBurnTime = now + currentInterval;
        setNextBurnTime(newNextBurnTime);
      }
    };

    calculateTimeLeft();

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [nextBurnTime]);

  // Calculate hyperloop countdown based on next hyperloop time
  useEffect(() => {
    if (nextHyperloopTime === 0) return;

    const calculateHyperloopTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = Math.max(0, nextHyperloopTime - now);

      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      setHyperloopTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds: secondsLeft
      });

      // Reset countdown when it reaches zero
      if (secondsLeft === 0) {
        const newNextHyperloopTime = now + HYPERLOOP_INTERVAL;
        setNextHyperloopTime(newNextHyperloopTime);
      }
    };

    calculateHyperloopTimeLeft();

    // Update every second
    const interval = setInterval(calculateHyperloopTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [nextHyperloopTime]);

  // Calculate burnloop countdown based on next burnloop time
  useEffect(() => {
    if (nextBurnloopTime === 0) return;

    const calculateBurnloopTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const secondsLeft = Math.max(0, nextBurnloopTime - now);

      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      setBurnloopTimeLeft({
        hours,
        minutes,
        seconds,
        totalSeconds: secondsLeft
      });

      // Reset countdown when it reaches zero
      if (secondsLeft === 0) {
        const newNextBurnloopTime = now + BURNLOOP_INTERVAL;
        setNextBurnloopTime(newNextBurnloopTime);
      }
    };

    calculateBurnloopTimeLeft();

    // Update every second
    const interval = setInterval(calculateBurnloopTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [nextBurnloopTime]);

  // Format time for display
  const formatTime = (time: CountdownTime) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(time.hours)}:${pad(time.minutes)}:${pad(time.seconds)}`;
  };

  // Calculate progress percentage (0-100) based on dynamic interval
  const getProgress = () => {
    if (timeLeft.totalSeconds === 0) return 100;
    const elapsed = currentInterval - timeLeft.totalSeconds;
    return Math.max(0, Math.min(100, (elapsed / currentInterval) * 100));
  };

  // Calculate burnloop progress percentage (0-100) based on 8-hour interval
  const getBurnloopProgress = () => {
    if (burnloopTimeLeft.totalSeconds === 0) return 100;
    const elapsed = BURNLOOP_INTERVAL - burnloopTimeLeft.totalSeconds;
    return Math.max(0, Math.min(100, (elapsed / BURNLOOP_INTERVAL) * 100));
  };

  // Calculate hyperloop progress percentage (0-100) based on 15-minute interval
  const getHyperloopProgress = () => {
    if (hyperloopTimeLeft.totalSeconds === 0) return 100;
    const elapsed = HYPERLOOP_INTERVAL - hyperloopTimeLeft.totalSeconds;
    return Math.max(0, Math.min(100, (elapsed / HYPERLOOP_INTERVAL) * 100));
  };

  // Contract write functionality
  const { writeContract, data: hash, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const executeBurn = () => {
    if (timeLeft.totalSeconds !== 0) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'burnFUEGO',
    });
  };

  const executeHyperloop = () => {
    if (hyperloopTimeLeft.totalSeconds !== 0) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'hyperloop',
    });
  };

  const executeBurnloop = () => {
    if (burnloopTimeLeft.totalSeconds !== 0) return;

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'burnloop',
    });
  };

  return {
    // Burn countdown
    timeLeft,
    formattedTime: formatTime(timeLeft),
    progress: getProgress(),
    isLoading: isLoading || isContractLoading,
    isReadyToBurn: timeLeft.totalSeconds === 0,
    contractAddress: CONTRACT_ADDRESS,
    burnInterval: currentInterval,
    executeBurn,
    isExecuting: isWritePending || isConfirming,
    isExecuted: isConfirmed,
    transactionHash: hash,
    // Hyperloop countdown
    hyperloopTimeLeft,
    hyperloopFormattedTime: formatTime(hyperloopTimeLeft),
    hyperloopProgress: getHyperloopProgress(),
    isReadyToHyperloop: hyperloopTimeLeft.totalSeconds === 0,
    executeHyperloop,
    // Burnloop countdown
    burnloopTimeLeft,
    burnloopFormattedTime: formatTime(burnloopTimeLeft),
    burnloopProgress: getBurnloopProgress(),
    isReadyToBurnloop: burnloopTimeLeft.totalSeconds === 0,
    executeBurnloop,
    // Contract status
    hasContractData: !!contractNextBurnTime,
    contractError: nextBurnError,
    hasHyperloopData: !!contractNextHyperloopTime,
    hyperloopError: nextHyperloopError,
    hasBurnloopData: !!contractNextBurnloopTime,
    burnloopError: nextBurnloopError,
    chaosTimes: chaosTimes ? Number(chaosTimes) : null,
    chaosCap: chaosCap ? Number(chaosCap) : null,
    // Burn mechanics
    burnedSupply: burnedSupply ? formatUnits(burnedSupply, 18) : '0',
    fuegoAddress: fuegoAddress as string
  };
}
