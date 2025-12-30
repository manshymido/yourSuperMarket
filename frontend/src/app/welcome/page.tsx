'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function WelcomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const [redirectUrl, setRedirectUrl] = useState<string>('/');

  // Get and validate redirect URL on mount
  useEffect(() => {
    let url = searchParams.get('redirect') || '/';
    
    // Validate redirect URL - ensure it's a valid path
    try {
      // If it's a full URL, extract the pathname
      if (url.startsWith('http://') || url.startsWith('https://')) {
        const urlObj = new URL(url);
        url = urlObj.pathname;
      }
      // Ensure it starts with / and is a valid internal path
      if (!url.startsWith('/') || url.includes('//')) {
        url = '/';
      }
    } catch (e) {
      // Invalid URL, use default
      url = '/';
    }
    
    setRedirectUrl(url);
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [countdown]);

  // Handle redirect when countdown reaches 0
  useEffect(() => {
    if (countdown === 0 && redirectUrl) {
      router.push(redirectUrl);
    }
  }, [countdown, redirectUrl, router]);

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md animate-scale-in">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="space-y-4">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-scale-in">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <p className="text-muted-foreground">
                You have successfully logged in.
              </p>
            </div>
            {countdown > 0 && (
              <p className="text-sm text-muted-foreground">
                Redirecting you in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" asChild className="w-full" size="lg">
              <Link href="/orders">
                <Package className="mr-2 h-5 w-5" />
                View Orders
              </Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(redirectUrl)}
              className="w-full"
            >
              Continue to {redirectUrl === '/' ? 'Home' : 'Previous Page'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted animate-pulse mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
