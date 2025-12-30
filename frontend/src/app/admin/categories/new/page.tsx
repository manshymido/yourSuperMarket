'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryForm, CategoryFormValues } from '@/components/admin/CategoryForm';
import { toast } from 'sonner';
import Link from 'next/link';

export default function NewCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const createCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormValues) => {
      const categoryData: any = {
        name: data.name,
        isActive: data.isActive,
      };

      if (data.description) {
        categoryData.description = data.description;
      }
      if (data.parentId) {
        categoryData.parentId = data.parentId;
      }

      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories', 'all'] });
      toast.success('Category created successfully');
      router.push('/admin/categories');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Failed to create category'
      );
    },
  });

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/admin/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryForm
            onSubmit={async (data) => {
              await createCategoryMutation.mutateAsync(data);
            }}
            isSubmitting={createCategoryMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}

