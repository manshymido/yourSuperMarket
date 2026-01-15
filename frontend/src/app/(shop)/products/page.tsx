'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductSort, SortOption } from '@/components/product/ProductSort';
import { SearchBar } from '@/components/layout/SearchBar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', selectedCategories, minPrice, maxPrice, sortBy, page],
    queryFn: async () => {
      const params: any = {
        page,
        limit: pageSize,
      };

      if (selectedCategories.length > 0) {
        params.categories = selectedCategories.join(',');
      }

      if (minPrice > 0) {
        params.minPrice = minPrice;
      }

      if (maxPrice < 10000) {
        params.maxPrice = maxPrice;
      }

      // Map sort options to API params
      if (sortBy === 'price-asc') {
        params.sortBy = 'price';
        params.sortOrder = 'asc';
      } else if (sortBy === 'price-desc') {
        params.sortBy = 'price';
        params.sortOrder = 'desc';
      } else if (sortBy === 'name-asc') {
        params.sortBy = 'name';
        params.sortOrder = 'asc';
      } else if (sortBy === 'name-desc') {
        params.sortBy = 'name';
        params.sortOrder = 'desc';
      } else if (sortBy === 'rating-desc') {
        params.sortBy = 'rating';
        params.sortOrder = 'desc';
      }

      const response = await apiClient.get('/products', { params });
      return response.data;
    },
  });

  const products = data?.products || [];
  const totalPages = Math.ceil((data?.total || 0) / pageSize);

  const handlePriceChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    setPage(1); // Reset to first page when filters change
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="container py-6 md:py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Products</h1>
        <p className="text-muted-foreground">
          Discover our wide range of products
        </p>
      </div>

      {/* Mobile Search */}
      <div className="mb-6 md:hidden">
        <SearchBar />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block">
          <ProductFilters
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            {/* Mobile Filters */}
            <div className="md:hidden w-full">
              <ProductFilters
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onPriceChange={handlePriceChange}
                isMobile
              />
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <ProductSort value={sortBy} onValueChange={setSortBy} />
              <div className="text-sm text-muted-foreground ml-auto">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    Showing {products.length} of {data?.total || 0} products
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          {error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-semibold text-destructive mb-2">
                Failed to load products
              </p>
              <p className="text-sm text-muted-foreground">
                Please try again later
              </p>
            </div>
          ) : (
            <>
              <ProductGrid products={products} isLoading={isLoading} />

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          disabled={isLoading}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages || isLoading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
