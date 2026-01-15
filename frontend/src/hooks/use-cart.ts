'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export function useCart() {
  const { data: cart, isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      try {
        const response = await apiClient.get('/cart');
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 30 * 1000, // 30 seconds
  });

  const itemCount = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;

  return {
    cart,
    isLoading,
    itemCount,
    refetch,
  };
}

