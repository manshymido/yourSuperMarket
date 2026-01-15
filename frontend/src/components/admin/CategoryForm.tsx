'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialValues?: Partial<CategoryFormValues>;
  onSubmit: (data: CategoryFormValues) => Promise<void>;
  isSubmitting?: boolean;
  excludeCategoryId?: string; // For excluding current category from parent selection
}

export function CategoryForm({
  initialValues,
  onSubmit,
  isSubmitting = false,
  excludeCategoryId,
}: CategoryFormProps) {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/categories', {
        params: { includeInactive: true },
      });
      return response.data || [];
    },
  });

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      parentId: initialValues?.parentId || null,
      isActive: initialValues?.isActive ?? true,
    },
  });

  // Filter out the current category and its children from parent options
  const availableParents = categories
    ? categories.filter((cat: any) => {
        if (excludeCategoryId && cat.id === excludeCategoryId) return false;
        // Prevent circular references - exclude if current category is a parent/ancestor
        if (excludeCategoryId) {
          let current = cat;
          while (current?.parentId) {
            if (current.parentId === excludeCategoryId) return false;
            current = categories.find((c: any) => c.id === current.parentId);
            if (!current) break;
          }
        }
        return true;
      })
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter category description"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === 'none' ? null : value)
                    }
                    value={field.value || 'none'}
                    disabled={categoriesLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None (Top-level category)</SelectItem>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading...
                        </SelectItem>
                      ) : availableParents.length > 0 ? (
                        availableParents.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-categories" disabled>
                          No categories available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Select a parent category to create a subcategory
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Active</FormLabel>
                    <FormDescription>
                      Active categories are visible to customers
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialValues ? 'Update Category' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

