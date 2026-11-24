import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="m-4 rounded-xl bg-surface px-6 py-20 text-center shadow-card ring-1 ring-line sm:m-6">
      <p className="text-5xl font-bold text-brand" aria-hidden="true">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
      <p className="mt-1 text-ink-soft">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex min-h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-on-brand transition hover:bg-brand-strong"
      >
        Browse products
      </Link>
    </div>
  );
}
