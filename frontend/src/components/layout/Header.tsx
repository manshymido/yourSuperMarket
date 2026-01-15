'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShoppingCart, User } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';
import { logoutAndRedirect } from '@/lib/store/auth-store';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SearchBar } from './SearchBar';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, loading } = useAuth();
  const { itemCount } = useCart();
  const [logoError, setLogoError] = useState(false);

  const handleLogout = async () => {
    await logoutAndRedirect(router);
  };

  const getInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName[0].toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        {/* Mobile Menu */}
        <MobileMenu />

        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            {logoError ? (
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                YourSuperMarket
              </span>
            ) : (
              <img
                src="/yoursupermarketlogo.png"
                alt="YourSuperMarket Logo"
                className="h-8 w-auto object-contain"
                onError={() => setLogoError(true)}
              />
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link
            href="/products"
            className={`transition-colors hover:text-primary ${
              pathname === '/products' || pathname.startsWith('/products/')
                ? 'text-primary font-semibold'
                : 'text-foreground/60'
            }`}
          >
            Products
          </Link>
          <Link
            href="/orders"
            className={`transition-colors hover:text-primary ${
              pathname === '/orders' || pathname.startsWith('/orders/')
                ? 'text-primary font-semibold'
                : 'text-foreground/60'
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex flex-1 max-w-md">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Cart Icon */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {itemCount > 99 ? '99+' : itemCount}
                </Badge>
              )}
              <span className="sr-only">Shopping cart</span>
            </Link>
          </Button>

          {/* User Menu */}
          {loading ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.firstName
                        ? `${user.firstName} ${user.lastName || ''}`.trim()
                        : 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/orders">My Orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

