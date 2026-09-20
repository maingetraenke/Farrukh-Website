export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <div className="prose-sm mt-6 flex flex-col gap-4 text-sm text-foreground/80">
        {children}
      </div>
    </div>
  );
}
