import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Browse our full menu – burgers, pizzas, biryani, drinks and more. Order online for fast delivery across Pakistan.'
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
