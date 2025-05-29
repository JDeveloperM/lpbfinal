'use client';

import { Copy } from "lucide-react";

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <button 
      onClick={copyToClipboard}
      className="p-2 hover:bg-gray-700/20 rounded-full transition-colors"
    >
      <Copy className="h-5 w-5" />
    </button>
  );
}