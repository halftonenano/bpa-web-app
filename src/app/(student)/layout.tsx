import NavBar from '@/components/layout/NavBar';

// Wrap the child routes with the sidebar and navbar

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative grid"
      style={{ gridTemplate: 'auto 1fr / auto 1fr' }}
    >
      <div className="sticky top-0 row-start-1 row-end-3 h-screen border-r bg-gradient-to-b from-lime-100 to-sky-100">
        <div className="p-5 pt-10">
          <div
            className="rotate-180 text-xl font-bold"
            style={{ writingMode: 'vertical-rl' }}
          >
            LearnX
          </div>
        </div>
      </div>

      <NavBar />

      {children}
    </div>
  );
}
