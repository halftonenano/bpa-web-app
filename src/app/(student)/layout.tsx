import MeshGradientRenderer from '@/components/MeshGradientRenderer';
import FullSiteSearch from '@/components/search/FullSiteSearch';
import { Home, Library, Pencil, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed inset-0"></div>
      <div
        className="relative grid"
        style={{ gridTemplate: 'auto 1fr / auto 1fr' }}
      >
        {/* <div className="sticky top-0 h-screen border-r bg-gradient-to-b from-emerald-50 via-sky-100 to-lime-100"> */}
        <div className="sticky top-0 row-start-1 row-end-3 h-screen border-r bg-gradient-to-b from-lime-100 to-sky-100">
        {/* <div className="sticky top-0 row-start-1 row-end-3 h-screen border-r z-[9999]"> */}
          <div className="p-5 pt-10">
            <div
              className="rotate-180 text-xl font-bold"
              style={{ writingMode: 'vertical-rl' }}
            >
              LearnX
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-[9998] shadow-sm">
          <div
            className="relative h-16 w-full overflow-hidden border-b transition-all duration-500 hover:h-40"
            style={{
              transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
            }}
          >
            <div className="absolute inset-0 grid h-full w-full place-items-center overflow-hidden">
              <MeshGradientRenderer
                className="w-full"
                height={400}
                width={1600}
              />
            </div>
            <div className="absolute inset-0 flex w-full justify-end gap-1.5 p-1.5">
              {/* <FullSiteSearch /> */}
              <LinkButton name="Dashboard" href="/dashboard" icon={<Home />} />
              <LinkButton name="Courses" href="/courses" icon={<Library />} />
              <LinkButton
                name="Studio"
                href="/studio"
                icon={<Pencil size={22} />}
              />
              <LinkButton
                name="Account"
                href="/account"
                icon={<UserCircle />}
              />
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
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
      className="flex w-full flex-col items-end justify-end rounded-[0.5rem] bg-black/10 px-5 pb-3 pt-6 text-right font-bold transition duration-300 hover:bg-white hover:shadow-md"
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
