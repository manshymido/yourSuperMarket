'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { MapPin, CreditCard, Wallet, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { useCart } from '@/hooks/use-cart';
import { useAuthStore } from '@/lib/store/auth-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const checkoutSchema = z.object({
  addressId: z.string().min(1, 'Please select or create an address'),
  paymentMethod: z.enum(['cash', 'paymob'], {
    required_error: 'Please select a payment method',
  }),
  notes: z.string().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cart, isLoading: cartLoading } = useCart();
  const { user } = useAuthStore();
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      addressId: '',
      paymentMethod: 'cash',
      notes: '',
    },
  });

  // Fetch user addresses
  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const response = await apiClient.get('/users/addresses');
      return response.data || [];
    },
    enabled: !!user,
  });

  // Fetch governorates for address form
  const { data: governorates } = useQuery({
    queryKey: ['governorates'],
    queryFn: async () => {
      const response = await apiClient.get('/governorates');
      return response.data || [];
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const response = await apiClient.post('/orders', {
        addressId: data.addressId,
        notes: data.notes,
      });
      return response.data;
    },
    onSuccess: async (order) => {
      // Clear cart
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      
      // Handle payment
      const paymentMethod = form.getValues('paymentMethod');
      
      if (paymentMethod === 'paymob') {
        try {
          const paymentResponse = await apiClient.post(`/payments/orders/${order.id}`, {
            method: 'paymob',
          });
          
          // Redirect to Paymob payment page
          if (paymentResponse.data?.paymentUrl) {
            window.location.href = paymentResponse.data.paymentUrl;
            return;
          }
        } catch (error: any) {
          console.error('Payment initiation failed:', error);
          toast.error('Failed to initiate payment. Please try again.');
        }
      } else {
        // Cash on delivery - redirect to order tracking
        toast.success('Order placed successfully!');
        router.push(`/orders/${order.id}/track`);
      }
    },
    onError: (error: any) => {
      if (error.response?.status === 401) {
        toast.error('Please login to place an order');
        router.push('/login?redirect=/checkout');
      } else {
        toast.error(error.response?.data?.message || 'Failed to place order');
      }
    },
  });

  const createAddressMutation = useMutation({
    mutationFn: async (addressData: any) => {
      const response = await apiClient.post('/users/addresses', addressData);
      return response.data;
    },
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      setSelectedAddressId(newAddress.id);
      form.setValue('addressId', newAddress.id);
      setShowNewAddressForm(false);
      toast.success('Address added successfully');
    },
    onError: () => {
      toast.error('Failed to create address');
    },
  });

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
      return;
    }

    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find((a: any) => a.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress.id);
      form.setValue('addressId', defaultAddress.id);
    }
  }, [addresses, user, router, selectedAddressId, form]);

  const onSubmit = (data: CheckoutFormValues) => {
    if (!cart || !cart.items || cart.items.length === 0) {
      toast.error('Your cart is empty');
      router.push('/cart');
      return;
    }
    createOrderMutation.mutate(data);
  };

  if (!user) {
    return null;
  }

  if (cartLoading) {
    return (
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container py-10">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-semibold mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add items to your cart before checkout
            </p>
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum: number, item: any) => {
    return sum + Number(item.product.price) * item.quantity;
  }, 0);

  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="container py-6 md:py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Address and Payment */}
          <div className="space-y-6">
            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addressesLoading ? (
                  <Skeleton className="h-32 w-full" />
                ) : addresses && addresses.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {addresses.map((address: any) => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => {
                            setSelectedAddressId(address.id);
                            form.setValue('addressId', address.id);
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className="font-semibold">
                                {address.street}, {address.city}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {address.governorate?.name || address.governorate}
                              </p>
                              {address.isDefault && (
                                <Badge variant="secondary" className="mt-2">
                                  Default
                                </Badge>
                              )}
                            </div>
                            <RadioGroupItem
                              value={address.id}
                              checked={selectedAddressId === address.id}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                    >
                      {showNewAddressForm ? 'Cancel' : '+ Add New Address'}
                    </Button>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No addresses found. Please add an address.
                  </p>
                )}

                {showNewAddressForm && (
                  <NewAddressForm
                    governorates={governorates || []}
                    onSubmit={(addressData) => createAddressMutation.mutate(addressData)}
                    onCancel={() => setShowNewAddressForm(false)}
                  />
                )}

                <FormField
                  control={form.control}
                  name="addressId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input type="hidden" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-4"
                        >
                          <div className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <Wallet className="h-5 w-5" />
                                <div>
                                  <p className="font-semibold">Cash on Delivery</p>
                                  <p className="text-sm text-muted-foreground">
                                    Pay when you receive your order
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2 border rounded-lg p-4">
                            <RadioGroupItem value="paymob" id="paymob" />
                            <Label htmlFor="paymob" className="flex-1 cursor-pointer">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                <div>
                                  <p className="font-semibold">Paymob</p>
                                  <p className="text-sm text-muted-foreground">
                                    Pay securely with credit/debit card
                                  </p>
                                </div>
                              </div>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Order Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Order Notes (Optional)</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Any special instructions for delivery..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product.name} x {item.quantity}
                      </span>
                      <span>
                        EGP {(Number(item.product.price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>EGP {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `EGP ${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">EGP {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={createOrderMutation.isPending}
                >
                  {createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Free shipping on orders over EGP 500
                </p>
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}

// New Address Form Component
function NewAddressForm({
  governorates,
  onSubmit,
  onCancel,
}: {
  governorates: any[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    governorateId: '',
    postalCode: '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="governorate">Governorate</Label>
        <select
          id="governorate"
          value={formData.governorateId}
          onChange={(e) => setFormData({ ...formData, governorateId: e.target.value })}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          required
        >
          <option value="">Select governorate</option>
          {governorates.map((gov) => (
            <option key={gov.id} value={gov.id}>
              {gov.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor="postalCode">Postal Code (Optional)</Label>
        <Input
          id="postalCode"
          value={formData.postalCode}
          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
        />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
          Set as default address
        </Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          Save Address
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

