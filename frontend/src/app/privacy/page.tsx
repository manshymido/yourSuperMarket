'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  return (
    <div className="container py-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including your name, email address, phone number, delivery address, and payment information.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Process and fulfill your orders</li>
            <li>Send you order confirmations and updates</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Improve our services and user experience</li>
            <li>Send you promotional communications (with your consent)</li>
          </ul>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share your information with:
          </p>
          <ul>
            <li>Delivery partners to fulfill your orders</li>
            <li>Payment processors to process payments</li>
            <li>Service providers who assist us in operating our platform</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.
          </p>

          <h2>5. Cookies</h2>
          <p>
            We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. You can control cookies through your browser settings.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to:
          </p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2>7. Children's Privacy</h2>
          <p>
            Our service is not intended for children under 18. We do not knowingly collect personal information from children.
          </p>

          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.
          </p>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us through our customer service.
          </p>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

