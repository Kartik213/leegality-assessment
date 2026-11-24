import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="m-4 rounded-xl bg-card px-6 py-20 text-center shadow-xs ring-1 ring-border sm:m-6">
      <p className="text-5xl font-bold text-muted-foreground" aria-hidden="true">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-muted-foreground">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-10 items-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Browse products
      </Link>
    </div>
  );
}
