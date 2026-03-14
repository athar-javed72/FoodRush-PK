import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your order – address, payment, and confirmation.'
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
