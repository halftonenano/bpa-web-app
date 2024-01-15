import MeshGradientRenderer from '@/components/MeshGradientRenderer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden">
        <MeshGradientRenderer className="h-full md:w-full" />
      </div>
      <main className="relative grid min-h-screen place-items-center">
        <div>
          <h1 className="text-7xl font-bold text-center">404</h1>
          <div className="flex justify-between gap-3">
            <h2 className="font-bold">LearnX</h2>
            <p>NOT FOUND</p>
          </div>
          <Button asChild variant="outline" className="mt-2 w-full bg-white">
            <Link className="" href="/home">
              Homepage →
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
