import type { Category, ProductListResponse } from "../types/product.ts";
import { ProductCard } from "./ProductCard.tsx";
import { ProductsSkeleton } from "../components/ProductsSkeleton.tsx";
import { Pagination } from "../components/Paginations";
import { ActiveFilters } from "../components/ActiveFilters.tsx";
import { ErrorState } from "../components/ErrorState.tsx";
import { SearchIcon } from "../components/Icon.tsx";
import { useFilters } from "../hooks/useFilters.ts";
import type { FetchState } from "../hooks/useFetch.ts";
import { filterProducts } from "../lib/filterProducts.ts";

interface ProductsProps {
  products: FetchState<ProductListResponse[]>;
  categories: FetchState<Category[]>;
}

const PAGE_SIZE = 8;

export function Products({ products, categories }: ProductsProps) {
  const { filters, updateFilters, clearFilters, activeFilterCount } =
    useFilters();

  const categoryProducts =
    products.data?.flatMap((response) => response.products) ?? [];
  const matchingProducts = filterProducts(categoryProducts, filters);

  const totalPages = Math.max(
    1,
    Math.ceil(matchingProducts.length / PAGE_SIZE),
  );
  const page = Math.min(filters.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const visibleProducts = matchingProducts.slice(start, start + PAGE_SIZE);

  const handlePageChange = (nextPage: number) => {
    window.scrollTo({ top: 0 });
    updateFilters({ page: nextPage });
  };

  const getCategoryName = (slug: string) =>
    categories.data?.find((category) => category.slug === slug)?.name ?? slug;

  return (
    <section className="min-w-0 p-4 sm:p-6" aria-labelledby="results-heading">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h1
          id="results-heading"
          tabIndex={-1}
          className="text-xl font-bold tracking-tight focus:outline-none sm:text-2xl"
        >
          All Products
        </h1>
        <p className="min-h-5 text-sm text-muted-foreground" aria-live="polite">
          {products.data &&
            matchingProducts.length > 0 &&
            `Showing ${start + 1}–${start + visibleProducts.length} of ${matchingProducts.length} products`}
        </p>
      </div>
      <ActiveFilters
        filters={filters}
        getCategoryName={getCategoryName}
        onChange={updateFilters}
        onClear={clearFilters}
      />
      {products.isLoading ? (
        <ProductsSkeleton count={PAGE_SIZE} />
      ) : products.error ? (
        <ErrorState
          title="Couldn't load products"
          message="Check your connection and try again."
          onRetry={products.retry}
        />
      ) : matchingProducts.length === 0 ? (
        <div className="rounded-xl bg-card px-6 py-16 text-center shadow-xs ring-1 ring-border">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-secondary text-secondary-foreground"
          >
            <SearchIcon className="size-7" />
          </div>
          <h2 className="text-lg font-semibold">No products found</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Nothing matches these filters. Try widening the price range or
            removing a filter.
          </p>
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 min-h-10 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            {visibleProducts.map((product) => (
              <li key={product.id} className="grid">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </section>
  );
}
