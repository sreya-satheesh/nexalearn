'use client';

import { usePathname } from 'next/navigation';
import { Logo } from '@/components/shared/icons';

export default function Header() {
  const pathname = usePathname();
  const showLogoutButton = pathname.includes('/dashboard');

  return (
    <header className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between ml-4">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            NexaLearn
          </h1>
        </div>
      </div>
    </header>
  );
}
