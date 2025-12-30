'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/lib/use-auth';
import { logoutAndRedirect } from '@/lib/store/auth-store';
import { Separator } from '@/components/ui/separator';

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const handleLogout = async () => {
    setOpen(false);
    await logoutAndRedirect(router);
  };

  const navItems = [
    { href: '/products', label: 'Products' },
    { href: '/cart', label: 'Cart' },
    { href: '/orders', label: 'Orders' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <SheetTitle>YourSuperMarket</SheetTitle>
            <Separator />
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Separator />
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="px-3 py-2 text-sm">
                <p className="font-medium">
                  {user?.firstName
                    ? `${user.firstName} ${user.lastName || ''}`.trim()
                    : user?.email || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-start"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link href="/login" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setOpen(false)}>
                <Button className="w-full">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

