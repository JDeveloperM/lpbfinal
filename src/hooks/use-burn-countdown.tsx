'use client';

import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { formatUnits } from 'viem';

const CONTRACT_ADDRESS = '0xdb6a2fc2bc6e77d9fdfdfc588befdbb9c055bede' as const;
const BASE_BURN_INTERVAL = 12 * 60 * 60; // 12 hours base interval
const HYPERLOOP_INTERVAL = 15 * 60; // 15 minutes for hyperloop
const BURNLOOP_INTERVAL = 8 * 60 * 60; // 8 hours for burnloop

// Production contract ABI for LoopBurn Yield Reactor
const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "burnloop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "hyperloop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextBurnTime",
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
    "name": "nextHyperTime",
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
    "name": "burnInterval",
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
    "name": "hyperInterval",
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
    "name": "swingTrades",
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



interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}



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

  // Testing new contract - enable real mode
  const CONTRACT_ACCESSIBLE = true; // Testing with new contract address

  // Read the real contract data with better error handling
  const { data: contractNextBurnTime, error: nextBurnError, isLoading: isContractLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextBurnTime',
    query: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Read hyperloop time
  const { data: contractNextHyperloopTime, error: nextHyperloopError, isLoading: isHyperloopLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextHyperTime',
    query: {
      enabled: true,
      refetchInterval: 30000, // Refetch every 30 seconds
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });



  // Get burn interval from contract
  const { data: contractBurnInterval, error: burnIntervalError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'burnInterval',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Get hyperloop interval from contract
  const { data: contractHyperInterval, error: hyperIntervalError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'hyperInterval',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Test basic contract connectivity
  const { data: swingTradesData, error: swingTradesError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'swingTrades',
    query: {
      enabled: true,
      retry: 1,
      retryDelay: 2000,
      throwOnError: false,
    }
  });

  // Test burnloop function to see if it's callable (this is a write function, so we'll simulate it)
  const { writeContract: testWriteContract } = useWriteContract();

  // Log contract connectivity status
  useEffect(() => {
    if (swingTradesData !== undefined) {
      console.log('✅ Contract is accessible - swingTrades:', swingTradesData.toString());
    } else if (swingTradesError) {
      console.warn('⚠️ Contract connectivity issue:', swingTradesError.message);
    }
  }, [swingTradesData, swingTradesError]);

  // Use contract burn interval when available, fallback to default
  useEffect(() => {
    if (contractBurnInterval && typeof contractBurnInterval === 'bigint') {
      const intervalSeconds = Number(contractBurnInterval);
      // Validate interval is reasonable (between 1 hour and 48 hours)
      if (intervalSeconds >= 3600 && intervalSeconds <= 172800) {
        setCurrentInterval(intervalSeconds);
        console.log('✅ Using contract burn interval:', intervalSeconds / 3600, 'hours');
      } else {
        console.warn('⚠️ Invalid burn interval from contract:', intervalSeconds, 'using default');
        setCurrentInterval(BASE_BURN_INTERVAL);
      }
    } else if (burnIntervalError) {
      const errorMsg = burnIntervalError.message || 'Unknown error';
      if (errorMsg.includes('execution reverted')) {
        console.warn('⚠️ burnInterval() reverted - using default interval');
      } else {
        console.warn('⚠️ Error reading burn interval:', errorMsg);
      }
      setCurrentInterval(BASE_BURN_INTERVAL);
    }
  }, [contractBurnInterval, burnIntervalError]);

  // Get hyperloop interval for display, with fallback
  const hyperInterval = (() => {
    if (contractHyperInterval && typeof contractHyperInterval === 'bigint') {
      const intervalSeconds = Number(contractHyperInterval);
      // Validate interval is reasonable (between 1 minute and 1 hour)
      if (intervalSeconds >= 60 && intervalSeconds <= 3600) {
        return intervalSeconds;
      }
    }
    return HYPERLOOP_INTERVAL;
  })();

  // Initialize countdown with real contract data or fallback
  useEffect(() => {
    const initializeCountdown = () => {
      const now = Math.floor(Date.now() / 1000);

      // Try to use contract data first
      if (contractNextBurnTime && typeof contractNextBurnTime === 'bigint') {
        const contractTime = Number(contractNextBurnTime);
        // Validate the timestamp is reasonable
        if (contractTime > now - 86400 && contractTime < now + 31536000) {
          setNextBurnTime(contractTime);
          setIsLoading(false);
          console.log('✅ Using real contract nextBurnTime:', contractTime);
          console.log('✅ Next burn at:', new Date(contractTime * 1000).toLocaleString());
          return;
        } else {
          console.warn('⚠️ Invalid nextBurnTime from contract:', contractTime);
        }
      }

      // Fallback to demo mode if contract fails or data is invalid
      if (nextBurnError || !isContractLoading) {
        if (nextBurnError) {
          const errorMsg = nextBurnError.message || 'Unknown error';
          if (errorMsg.includes('execution reverted')) {
            console.warn('⚠️ Contract function nextBurnTime() reverted - using demo mode');
          } else {
            console.error('❌ Error reading contract:', errorMsg);
          }
        }
        const randomTimeLeft = Math.floor(Math.random() * currentInterval);
        setNextBurnTime(now + randomTimeLeft);
        setIsLoading(false);
        console.log('⚠️ Using demo mode - next burn in', Math.round(randomTimeLeft / 3600 * 10) / 10, 'hours');
      }
    };

    // Don't initialize if still loading
    if (!isContractLoading) {
      initializeCountdown();
    }
  }, [contractNextBurnTime, nextBurnError, isContractLoading, currentInterval]);

  // Initialize hyperloop countdown with real contract data or fallback
  useEffect(() => {
    const initializeHyperloop = () => {
      const now = Math.floor(Date.now() / 1000);

      // Try to use contract data first
      if (contractNextHyperloopTime && typeof contractNextHyperloopTime === 'bigint') {
        const contractTime = Number(contractNextHyperloopTime);
        // Validate the timestamp is reasonable
        if (contractTime > now - 86400 && contractTime < now + 31536000) {
          // If contract time is in the future, someone executed hyperloop and it's on cooldown
          if (contractTime > now) {
            setNextHyperloopTime(contractTime);
            console.log('✅ Hyperloop on cooldown until:', new Date(contractTime * 1000).toLocaleString());
          } else {
            // Contract time is in the past, hyperloop is available
            setNextHyperloopTime(0); // 0 means available immediately
            console.log('✅ Hyperloop available for execution');
          }
          return;
        } else {
          console.warn('⚠️ Invalid nextHyperTime from contract:', contractTime);
        }
      }

      // Fallback to demo mode if contract fails or data is invalid
      if (nextHyperloopError || !isHyperloopLoading) {
        if (nextHyperloopError) {
          const errorMsg = nextHyperloopError.message || 'Unknown error';
          if (errorMsg.includes('execution reverted')) {
            console.warn('⚠️ Contract function nextHyperTime() reverted - hyperloop available');
          } else {
            console.error('❌ Error reading hyperloop contract:', errorMsg);
          }
        }
        // In demo mode, make hyperloop available immediately
        setNextHyperloopTime(0);
        console.log('⚠️ Demo mode: Hyperloop available for execution');
      }
    };

    // Don't initialize if still loading
    if (!isHyperloopLoading) {
      initializeHyperloop();
    }
  }, [contractNextHyperloopTime, nextHyperloopError, isHyperloopLoading, hyperInterval]);

  // Initialize burnloop countdown with demo data (no contract function available)
  useEffect(() => {
    const now = Math.floor(Date.now() / 1000);
    const randomTimeLeft = Math.floor(Math.random() * BURNLOOP_INTERVAL);
    setNextBurnloopTime(now + randomTimeLeft);
    console.log('⚠️ Using demo mode for burnloop - no contract function available');
  }, []);

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
    const calculateHyperloopTimeLeft = () => {
      // If nextHyperloopTime is 0, hyperloop is available immediately
      if (nextHyperloopTime === 0) {
        setHyperloopTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0
        });
        return;
      }

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

      // When countdown reaches zero, hyperloop becomes available
      if (secondsLeft === 0) {
        setNextHyperloopTime(0); // Make available immediately
        console.log('✅ Hyperloop cooldown finished - now available for execution');
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
    if (timeLeft.totalSeconds !== 0) {
      console.warn('⚠️ Cannot execute burn - countdown not ready');
      return;
    }

    if (!CONTRACT_ACCESSIBLE) {
      console.warn('🎭 DEMO MODE: Contract not accessible - burnloop() would fail');
      console.warn('🔧 Fix contract initialization to enable real transactions');
      return;
    }

    try {
      console.log('🔥 Executing burnloop...');
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'burnloop',
      });
    } catch (error) {
      console.error('❌ Error executing burn:', error);
    }
  };

  const executeHyperloop = () => {
    // Allow execution if not on cooldown
    if (hyperloopTimeLeft.totalSeconds > 0) {
      console.warn('⚠️ Cannot execute hyperloop - still on cooldown');
      return;
    }

    if (!CONTRACT_ACCESSIBLE) {
      console.warn('🎭 DEMO MODE: Contract not accessible - hyperloop() would fail');
      console.warn('🔧 Fix contract initialization to enable real transactions');
      return;
    }

    try {
      console.log('⚡ Executing hyperloop...');
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'hyperloop',
      });

      // Start cooldown after execution
      const now = Math.floor(Date.now() / 1000);
      const newNextHyperloopTime = now + hyperInterval;
      setNextHyperloopTime(newNextHyperloopTime);
      console.log('⏰ Hyperloop cooldown started - next available in', hyperInterval / 60, 'minutes');
    } catch (error) {
      console.error('❌ Error executing hyperloop:', error);
    }
  };

  const executeBurnloop = () => {
    if (burnloopTimeLeft.totalSeconds !== 0) {
      console.warn('⚠️ Cannot execute burnloop - countdown not ready');
      return;
    }

    if (!CONTRACT_ACCESSIBLE) {
      console.warn('🎭 DEMO MODE: Contract not accessible - burnloop() would fail');
      console.warn('🔧 Fix contract initialization to enable real transactions');
      return;
    }

    try {
      console.log('🔥 Executing burnloop...');
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'burnloop',
      });
    } catch (error) {
      console.error('❌ Error executing burnloop:', error);
    }
  };

  // Test function to check if burnloop is callable (for debugging)
  const testBurnloop = () => {
    if (!CONTRACT_ACCESSIBLE) {
      console.warn('🎭 DEMO MODE: Cannot test burnloop - contract not accessible');
      console.warn('🔧 All contract functions revert - fix initialization first');
      return;
    }

    try {
      console.log('🧪 Testing burnloop function...');
      testWriteContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'burnloop',
      });
    } catch (error) {
      console.error('❌ Error testing burnloop:', error);
    }
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
    isHyperloopOnCooldown: hyperloopTimeLeft.totalSeconds > 0,
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
    hasBurnloopData: true, // Always true since we use demo mode
    burnloopError: null,
    // Intervals
    hyperInterval,
    // Test functions for debugging
    testBurnloop
  };
}
