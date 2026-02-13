export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </div>
    </div>
  );
}
