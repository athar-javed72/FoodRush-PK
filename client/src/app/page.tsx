import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="mb-4 text-3xl font-bold text-red-500">Athar&apos;s Foodie</h1>
      <p className="mb-6 text-muted-foreground">Food delivery platform – Phase 1 ready</p>
      <Button>Get started</Button>
    </main>
  );
}
