'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiClient from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  isMobile?: boolean;
}

export function ProductFilters({
  selectedCategories,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  isMobile = false,
}: ProductFiltersProps) {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/categories');
      return response.data || [];
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handleClearFilters = () => {
    onCategoryChange([]);
    onPriceChange(0, 10000);
  };

  const filterContent = (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-3">
          {categories?.map((category: any) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryToggle(category.id)}
              />
              <Label
                htmlFor={`category-${category.id}`}
                className="text-sm font-normal cursor-pointer"
              >
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="min-price" className="text-xs text-muted-foreground">
                Min (EGP)
              </Label>
              <input
                id="min-price"
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="max-price" className="text-xs text-muted-foreground">
                Max (EGP)
              </Label>
              <input
                id="max-price"
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <Button variant="outline" onClick={handleClearFilters} className="w-full">
        Clear Filters
      </Button>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:hidden">
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] mt-6">
            {filterContent}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="w-64 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        {(selectedCategories.length > 0 || minPrice > 0 || maxPrice < 10000) && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <ScrollArea className="h-[calc(100vh-200px)]">
        {filterContent}
      </ScrollArea>
    </div>
  );
}

