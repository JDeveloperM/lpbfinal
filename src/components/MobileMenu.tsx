'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Menu } from "lucide-react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative z-50"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm">
          <nav className="fixed inset-0 flex flex-col items-center justify-center space-y-8">
            <a href="/" className="text-2xl font-semibold hover:text-primary" onClick={() => setIsOpen(false)}>
              Home
            </a>
            <a href="/explorer" className="text-2xl font-semibold hover:text-primary" onClick={() => setIsOpen(false)}>
              Explorer
            </a>
            <a href="/yield-reactor" className="text-2xl font-semibold hover:text-primary" onClick={() => setIsOpen(false)}>
              Yield Reactor
            </a>
          </nav>
        </div>
      )}
    </div>
  );
}
