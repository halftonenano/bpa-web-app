import Link from 'next/link';
import MeshGradientRenderer from '../MeshGradientRenderer';
import { Home, Library, Pencil, Search, UserCircle } from 'lucide-react';

export default function NavBar() {
  return (
    <div className="group sticky top-0 z-[10] bg-white transition-shadow hover:shadow-sm">
      <div
        className="relative h-16 w-full overflow-hidden border-b transition-all duration-500 hover:h-40"
        style={{
          transitionTimingFunction: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        }}
      >
        <div className="absolute inset-0 grid h-full w-full place-items-center overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <MeshGradientRenderer className="w-full" height={400} width={1600} />
        </div>
        <div className="absolute inset-0 flex w-full justify-end gap-1.5 p-1.5">
          {/* <FullSiteSearch /> */}
          <LinkButton name="Search" href="/search" icon={<Search />} />
          <LinkButton name="Courses" href="/courses" icon={<Library />} />
          <LinkButton
            name="Studio"
            href="/studio"
            icon={<Pencil size={22} />}
          />
          <LinkButton name="Account" href="/account" icon={<UserCircle />} />
        </div>
      </div>
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
      className="flex w-full flex-col items-end justify-end rounded-[0.5rem] bg-black/10 px-5 pb-3 pt-6 text-right font-bold transition duration-300 hover:bg-white hover:shadow-md"
      href={href}
    >
      {icon}
      {name}
    </Link>
  );
}
