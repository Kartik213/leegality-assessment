import { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ApiError, productUrl } from "../lib/products.ts";
import { ErrorState } from "../components/ErrorState.tsx";
import { useFetch } from "../hooks/useFetch.ts";
import type { Product } from "../types/product.ts";
import { ProductDetailSkeleton } from "../components/ProductDetailsSkeleton.tsx";
import { ProductDetails } from "../components/ProductDetails.tsx";

export function ProductDetailPage() {
  const { id = "" } = useParams();
  const product = useFetch<Product>(productUrl(id));
  const isNotFound =
    product.error instanceof ApiError && product.error.status === 404;

  const navigate = useNavigate();
  const state: unknown = useLocation().state;
  const cameFromListing =
    typeof state === "object" && state !== null && "fromListing" in state;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-6">
      <Link
        to="/"
        onClick={(event) => {
          if (
            !cameFromListing ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey
          )
            return;
          event.preventDefault();
          navigate(-1);
        }}
        className="inline-flex min-h-10 items-center gap-2 rounded-md bg-card px-4 mb-4 text-sm font-medium shadow-xs ring-1 ring-border transition hover:bg-accent hover:text-accent-foreground"
      >
        <span aria-hidden="true">←</span> Back
        <span className="sr-only"> to products</span>
      </Link>
      {product.isLoading ? (
        <ProductDetailSkeleton />
      ) : product.data ? (
        <ProductDetails key={product.data.id} product={product.data} />
      ) : isNotFound ? (
        <ErrorState
          title="Product not found"
          message="This product doesn't exist or is no longer available."
        />
      ) : (
        <ErrorState
          title="Couldn't load this product"
          message="Check your connection and try again."
          onRetry={product.retry}
        />
      )}
    </div>
  );
}
