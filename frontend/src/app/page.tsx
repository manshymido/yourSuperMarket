'use client';

import Link from 'next/link';
import { ArrowRight, ShoppingBag, Truck, Shield, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/products', {
        params: { limit: 8, isFeatured: true },
      });
      return response.data.products || [];
    },
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'featured'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      const allCategories = response.data || [];
      // Limit to 4 categories on frontend since backend doesn't support limit
      return allCategories.slice(0, 4);
    },
  });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32">
        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center space-y-6 animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Welcome to YourSuperMarket
            </h1>
            <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
              Shop for groceries online and get them delivered to your door. Fast, fresh, and convenient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-lg px-8">
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Fast Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Get your orders delivered quickly and safely to your doorstep
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment information is safe and secure with us
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center text-center space-y-2 p-6">
                <div className="rounded-full bg-primary/10 p-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">Quality Products</h3>
                <p className="text-sm text-muted-foreground">
                  Fresh, high-quality products sourced directly from trusted suppliers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Shop by Category</h2>
              <Button variant="ghost" asChild>
                <Link href="/products">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {categoriesLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {categories.map((category: any) => (
                  <Card key={category.id} className="group hover-lift card-hover overflow-hidden">
                    <Link href={`/products?category=${category.id}`}>
                      <CardContent className="p-0 relative aspect-square">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                          <ShoppingBag className="h-16 w-16 text-primary/50 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur p-4">
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">Browse products</p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Button variant="ghost" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {productsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <ProductGrid products={featuredProducts} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container">
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-none">
            <CardContent className="p-12 text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to start shopping?</h2>
              <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                Browse our wide selection of fresh products and get them delivered to your door.
              </p>
              <Button size="lg" variant="secondary" className="mt-6" asChild>
                <Link href="/products">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
