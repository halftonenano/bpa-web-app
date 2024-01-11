import AccountWidget from '@/components/AccountWidget';

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid" style={{ gridTemplate: '1fr / auto 1fr' }}>
      <div className="sticky top-0 h-screen border-r bg-gradient-to-b from-lime-100 to-sky-100">
        <div className="p-5 pt-10">
          <div
            className="rotate-180 text-xl font-bold"
            style={{ writingMode: 'vertical-rl' }}
          >
            LearnX
          </div>
          {/* <AccountWidget /> */}
        </div>
      </div>
      {children}
    </div>
  );
}
