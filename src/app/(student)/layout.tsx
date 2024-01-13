import { Button } from '@/components/ui/button';
import { Home, Pencil, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid" style={{ gridTemplate: '1fr / auto 1fr' }}>
      {/* <div className="sticky top-0 h-screen border-r bg-gradient-to-b from-emerald-50 via-sky-100 to-lime-100"> */}
      <div className="sticky top-0 h-screen border-r bg-gradient-to-b from-lime-100 to-sky-100">
        <div className="flex h-full w-[200px] flex-col gap-2 p-3">
          <div
            className="text-xl font-bold"
            // style={{ writingMode: 'vertical-rl' }}
          >
            LearnX
          </div>
          <LinkButton name="Dashboard" href="/dashboard" icon={<Home size={27} />} />
          <LinkButton name="Studio" href="/studio" icon={<Pencil size={27} />} />
          <LinkButton name="Account" href="/account" icon={<UserCircle size={27} />} />
        </div>
      </div>
      {children}
    </div>
  );
}

function LinkButton({
  name,
  href,
  icon,
}: {
  name: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      className="flex h-full w-full flex-col items-end justify-end rounded-[0.6rem] bg-black/10 px-5 pb-3 pt-6 text-right font-bold transition hover:bg-white hover:shadow-md text-xl"
      href={href}
    >
      {icon}
      {name}
    </Link>
  );
}

// export default async function Layout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <>
//       <div className="fixed inset-0 bg-gradient-to-b from-lime-100 to-sky-100"></div>
//       <div className="relative grid" style={{ gridTemplate: '1fr / auto 1fr' }}>
//         <div className="sticky top-0 h-screen">
//           <div className="p-5 pt-10">
//             <div
//               className="rotate-180 text-xl font-bold"
//               style={{ writingMode: 'vertical-rl' }}
//             >
//               LearnX
//             </div>
//           </div>
//         </div>
//         <div className="p-2">
//           <div className="min-h-full rounded-[1rem] border bg-white shadow-lg">
//             {children}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
