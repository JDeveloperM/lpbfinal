'use client';

import { useState } from 'react';
import { Copy, ExternalLink, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WalletAddressProps {
  address: string;
  label?: string;
  className?: string;
}

export default function WalletAddress({ address, label, className = '' }: WalletAddressProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const openBaseScan = () => {
    window.open(`https://basescan.org/address/${address}`, '_blank', 'noopener,noreferrer');
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <p className="text-[8px] text-muted-foreground font-medium">{label}</p>
      )}
      
      <div className="flex items-center justify-between space-x-1">
        <span className="text-[9px] font-mono text-foreground">
          {formatAddress(address)}
        </span>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={copyToClipboard}
            className="h-4 w-4 p-0 hover:bg-muted/50"
            title="Copy address"
          >
            {copied ? (
              <Check className="h-2 w-2 text-green-500" />
            ) : (
              <Copy className="h-2 w-2 text-muted-foreground hover:text-foreground" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={openBaseScan}
            className="h-4 w-4 p-0 hover:bg-muted/50"
            title="View on BaseScan"
          >
            <ExternalLink className="h-2 w-2 text-muted-foreground hover:text-foreground" />
          </Button>
        </div>
      </div>
    </div>
  );
}
