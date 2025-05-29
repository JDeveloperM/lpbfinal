import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full shadow-top mt-12 bg-[#151313]">
      <div className="container mx-auto px-4 py-8 text-center md:flex md:items-center md:justify-between">
        <p className="text-sm text-foreground/70 mb-4 md:mb-0">
          &copy; {currentYear} LoopBurn. All rights reserved. Built on Sonic.
        </p>
        <div className="flex justify-center space-x-6">
        <Link href="https://x.com/LoopBurnSonic" target="_blank" rel="noopener noreferrer" aria-label="X (formerly Twitter)" className="text-foreground/70 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faXTwitter} className="h-5 w-5" />
          </Link>
          <Link href="https://t.me/LoopBurn" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-foreground/70 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faTelegram} className="h-5 w-5" />
          </Link>
          <Link href="https://loopburn-sonic.gitbook.io/loopburn/" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-foreground/70 hover:text-primary transition-colors">
            <FontAwesomeIcon icon={faGithub} className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}