import AccountWidget from '@/components/AccountWidget';
import Link from 'next/link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid" style={{ gridTemplate: '1fr / auto 1fr' }}>
      <div className="sticky top-0 h-screen border-r shadow-inner">
        <div className="p-5 pt-10">
          <div className="text-xl" style={{ writingMode: 'vertical-rl' }}>
            <Link href="/studio">
              <b className="font-black">LearnX</b> STUDIO
            </Link>
          </div>
          {/* <AccountWidget /> */}
        </div>
      </div>
      {children}
    </div>
  );
}