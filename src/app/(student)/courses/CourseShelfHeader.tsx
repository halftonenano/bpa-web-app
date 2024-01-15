export default function ShelfHeader({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <h2 className="text-2xl font-bold">{children}</h2>
    </div>
  );
}
