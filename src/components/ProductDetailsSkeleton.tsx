export function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading product"
      className="grid gap-8 rounded-xl bg-card p-6 shadow-xs ring-1 ring-border motion-safe:animate-pulse sm:p-8 lg:grid-cols-2"
    >
      <div className="aspect-square rounded-lg bg-muted" />
      <div className="space-y-4">
        <div className="h-8 w-3/4 rounded bg-muted" />
        <div className="h-6 w-1/2 rounded bg-muted" />
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="h-24 rounded bg-muted" />
      </div>
    </div>
  );
}