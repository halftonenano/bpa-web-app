import NavBar from '@/components/layout/NavBar';
import Link from 'next/link';

// Wrap the child routes with the sidebar and navbar

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid" style={{ gridTemplate: 'auto 1fr / auto 1fr' }}>
      <div className="sticky top-0 row-start-1 row-end-3 h-screen border-r bg-gradient-to-b from-lime-100 to-sky-100">
        <div className="p-5 pt-10">
          <div
            className="rotate-180 text-xl"
            style={{ writingMode: 'vertical-rl' }}
          >
            <Link href="/admin">
              <b className="font-black">LearnX</b> ADMIN
            </Link>
          </div>
        </div>
      </div>

      <NavBar />

      {children}
    </div>
  );
}
