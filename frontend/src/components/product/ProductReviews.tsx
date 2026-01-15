'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, User } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const response = await apiClient.get(`/reviews/products/${productId}`, {
        params: { page: 1, limit: 20 },
      });
      return response.data;
    },
  });

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(`/reviews/products/${productId}`, {
        rating,
        comment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product'] });
      setComment('');
      setRating(5);
      setShowReviewForm(false);
      toast.success('Review submitted! It will be visible after approval.');
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please login to submit a review');
        router.push('/login');
      } else {
        toast.error('Failed to submit review');
      }
    },
  });

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    createReviewMutation.mutate();
  };

  const reviews = reviewsData?.reviews || [];
  const totalReviews = reviewsData?.total || 0;
  const approvedReviews = reviews.filter((r: any) => r.approved);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Reviews</h2>
        {user && !showReviewForm && (
          <Button onClick={() => setShowReviewForm(true)}>
            Write a Review
          </Button>
        )}
      </div>

      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rating</Label>
              <div className="flex gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={createReviewMutation.isPending}
              >
                {createReviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowReviewForm(false);
                  setComment('');
                  setRating(5);
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : approvedReviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {approvedReviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-muted p-3">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-muted-foreground whitespace-pre-line">
                        {review.comment}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

