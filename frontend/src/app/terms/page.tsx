'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using YourSuperMarket, you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials on YourSuperMarket's website for personal, non-commercial transitory viewing only.
          </p>

          <h2>3. User Account</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
          </p>

          <h2>4. Products and Pricing</h2>
          <p>
            We reserve the right to change prices and product availability at any time. All prices are in Egyptian Pounds (EGP) unless otherwise stated.
          </p>

          <h2>5. Orders and Payment</h2>
          <p>
            By placing an order, you agree to pay the full amount including shipping fees. We accept cash on delivery and online payment methods.
          </p>

          <h2>6. Delivery</h2>
          <p>
            Delivery times are estimates and not guaranteed. We are not responsible for delays caused by circumstances beyond our control.
          </p>

          <h2>7. Returns and Refunds</h2>
          <p>
            Returns are accepted within 7 days of delivery for unused products in original packaging. Refunds will be processed within 14 business days.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            YourSuperMarket shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
          </p>

          <h2>9. Contact Information</h2>
          <p>
            For questions about these Terms and Conditions, please contact us through our customer service.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

