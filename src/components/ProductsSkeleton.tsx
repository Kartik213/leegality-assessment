export function ProductsSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4" role="status" aria-label="Loading products">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="rounded-xl bg-card p-4 ring-1 ring-border motion-safe:animate-pulse"
        >
          <div className="aspect-square rounded-lg bg-muted" />
          <div className="mt-3 space-y-2.5 border-t border-border pt-3">
            <div className="h-4 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-6 w-1/2 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}
