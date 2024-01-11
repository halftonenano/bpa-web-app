import MeshGradientRenderer from '@/components/MeshGradientRenderer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className="absolute h-screen w-full overflow-hidden">
        <MeshGradientRenderer className="h-full md:w-full" />
      </div>
      <main className="relative grid min-h-screen place-items-center">
        <div>
          <h1 className="text-7xl font-bold">LearnX</h1>
          <p>BPA Web App Competition</p>
          <Button asChild variant="outline" className="mt-2 w-full bg-white">
            <Link className="" href="/signin">
              Continue to Sign In →
            </Link>
          </Button>
        </div>
      </main>
    </>
  );
}
