'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBurnCountdown } from "@/hooks/use-burn-countdown";
import { useReadContract, useBlockNumber, useBalance } from 'wagmi';
import { useEffect, useState } from 'react';

const CONTRACT_ADDRESS = '0xdb6a2fc2bc6e77d9fdfdfc588befdbb9c055bede' as const;

// Simple ABI for testing individual functions
const TEST_ABI = [
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
  },
  {
    "inputs": [],
    "name": "owner",
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

export default function ContractDebugger() {
  const { testBurnloop } = useBurnCountdown();
  const [contractCode, setContractCode] = useState<string>('');

  // Check if we're on the right network
  const { data: blockNumber } = useBlockNumber();

  // Check if there's any balance at the contract address
  const { data: contractBalance } = useBalance({
    address: CONTRACT_ADDRESS,
  });

  // Check if there's code at the contract address
  useEffect(() => {
    const checkContractCode = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const code = await window.ethereum.request({
            method: 'eth_getCode',
            params: [CONTRACT_ADDRESS, 'latest']
          });
          setContractCode(code);
          console.log('Contract code length:', code.length);
          if (code === '0x' || code.length <= 2) {
            console.error('❌ No contract code found at address - contract may not be deployed');
          } else {
            console.log('✅ Contract code found at address');
          }
        }
      } catch (error) {
        console.error('Error checking contract code:', error);
      }
    };

    checkContractCode();
  }, []);

  // Test individual contract functions
  const { data: swingTrades, error: swingTradesError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'swingTrades',
    query: { throwOnError: false }
  });

  const { data: burnInterval, error: burnIntervalError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'burnInterval',
    query: { throwOnError: false }
  });

  const { data: hyperInterval, error: hyperIntervalError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'hyperInterval',
    query: { throwOnError: false }
  });

  const { data: nextBurnTime, error: nextBurnTimeError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'nextBurnTime',
    query: { throwOnError: false }
  });

  const { data: nextHyperTime, error: nextHyperTimeError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'nextHyperTime',
    query: { throwOnError: false }
  });

  // Test basic contract info functions
  const { data: owner, error: ownerError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'owner',
    query: { throwOnError: false }
  });

  const { data: lbpAddress, error: lbpError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'LBP',
    query: { throwOnError: false }
  });

  const { data: liquidityPool, error: liquidityPoolError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: TEST_ABI,
    functionName: 'LIQUIDITY_POOL',
    query: { throwOnError: false }
  });

  const testFunction = (functionName: string, data: any, error: any) => {
    if (data !== undefined) {
      console.log(`✅ ${functionName}:`, data.toString());
      return `✅ ${data.toString()}`;
    } else if (error) {
      console.error(`❌ ${functionName}:`, error.message);
      return `❌ ${error.message}`;
    } else {
      return `⏳ Loading...`;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Contract Debugger</CardTitle>
        <p className="text-sm text-muted-foreground">
          Contract: {CONTRACT_ADDRESS}
        </p>
        <div className="text-sm space-y-1">
          <div>Network Block: {blockNumber?.toString() || 'Loading...'}</div>
          <div>Contract Balance: {contractBalance ? `${contractBalance.formatted} ${contractBalance.symbol}` : 'Loading...'}</div>
          <div>Contract Code: {contractCode === '0x' || contractCode.length <= 2 ? '❌ No code found' : `✅ ${contractCode.length} bytes`}</div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Basic Contract Info</h3>
            <div className="space-y-1 text-sm">
              <div>owner: {testFunction('owner', owner, ownerError)}</div>
              <div>LBP: {testFunction('LBP', lbpAddress, lbpError)}</div>
              <div>LIQUIDITY_POOL: {testFunction('LIQUIDITY_POOL', liquidityPool, liquidityPoolError)}</div>
            </div>

            <h3 className="font-semibold mt-4">State Functions</h3>
            <div className="space-y-1 text-sm">
              <div>swingTrades: {testFunction('swingTrades', swingTrades, swingTradesError)}</div>
              <div>burnInterval: {testFunction('burnInterval', burnInterval, burnIntervalError)}</div>
              <div>hyperInterval: {testFunction('hyperInterval', hyperInterval, hyperIntervalError)}</div>
              <div>nextBurnTime: {testFunction('nextBurnTime', nextBurnTime, nextBurnTimeError)}</div>
              <div>nextHyperTime: {testFunction('nextHyperTime', nextHyperTime, nextHyperTimeError)}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Write Functions</h3>
            <div className="space-y-2">
              <Button 
                onClick={testBurnloop}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Test burnloop()
              </Button>
              <p className="text-xs text-muted-foreground">
                Check console for results. This will attempt to call the burnloop function.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Diagnosis:</h4>
          <div className="text-sm space-y-2">
            {contractCode === '0x' || contractCode.length <= 2 ? (
              <div className="text-red-500">
                ❌ <strong>No contract found at this address</strong>
                <ul className="ml-4 mt-1 list-disc">
                  <li>Contract may not be deployed to Sonic network</li>
                  <li>Address might be incorrect</li>
                  <li>You might be on the wrong network</li>
                </ul>
              </div>
            ) : (
              <div className="text-orange-500">
                ⚠️ <strong>Contract exists but all functions revert</strong>
                <div className="mt-2 text-sm">
                  <strong>Possible causes:</strong>
                  <ul className="ml-4 mt-1 list-disc">
                    <li><strong>Not initialized:</strong> Contract constructor may require parameters</li>
                    <li><strong>Missing dependencies:</strong> LBP or LIQUIDITY_POOL not set</li>
                    <li><strong>Access control:</strong> Functions may be owner-only</li>
                    <li><strong>Paused state:</strong> Contract may have a pause mechanism</li>
                    <li><strong>Reentrancy guard:</strong> May be blocking all calls</li>
                  </ul>

                  <div className="mt-2">
                    <strong>Check if basic info functions work:</strong>
                    <ul className="ml-4 mt-1 list-disc">
                      <li>If <code>owner()</code> works → Contract is accessible</li>
                      <li>If <code>LBP()</code> works → Dependencies might be set</li>
                      <li>If all fail → Global issue (paused/reentrancy)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          <h4 className="font-semibold mb-2 mt-4">Instructions:</h4>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>Check the contract existence info above</li>
            <li>Verify you're on Sonic network (Chain ID 146)</li>
            <li>Open browser console (F12) to see detailed logs</li>
            <li>If no contract code found, check the deployment</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}
