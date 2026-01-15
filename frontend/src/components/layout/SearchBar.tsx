'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products } = useQuery({
    queryKey: ['products', 'search', searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await apiClient.get('/products', {
        params: { search: searchQuery, limit: 5 },
      });
      return response.data.products || [];
    },
    enabled: open && searchQuery.length > 0,
  });

  const handleSelect = (product: any) => {
    router.push(`/products/${product.slug || product.id}`);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start rounded-md border bg-background pl-8 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-64 lg:w-96"
        onClick={() => setOpen(true)}
      >
        <Search className="absolute left-2 top-2.5 h-4 w-4" />
        <span className="hidden sm:inline-flex">Search products...</span>
        <span className="sm:hidden">Search...</span>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search products..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No products found.</CommandEmpty>
          {products && products.length > 0 && (
            <CommandGroup heading="Products">
              {products.map((product: any) => (
                <CommandItem
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    {product.images && product.images.length > 0 && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{product.name}</span>
                      <span className="text-xs text-muted-foreground">
                        EGP {Number(product.price).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}

