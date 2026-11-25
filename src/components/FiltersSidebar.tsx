import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout.tsx";
import { type FetchState } from "../hooks/useFetch";
import type { Category, ProductListResponse, ProductSummary } from "../types/product.ts";
import { useFilters } from "../hooks/useFilters";
import { Filters } from "../components/Filters";
import { getUniqueBrands } from "../lib/filterProducts.ts";

interface FilterSidebarProps {
  products: FetchState<ProductListResponse[]>;
  categoryProducts: ProductSummary[];
  categories: FetchState<Category[]>;
}

export function FilterSidebar({ products, categoryProducts, categories }: FilterSidebarProps) {
const { filters, updateFilters, clearFilters, activeFilterCount } =
    useFilters();
  const { areFiltersOpen } = useOutletContext<LayoutContext>();
  const brands = getUniqueBrands(categoryProducts);

  return (
    <aside
      id="filters-panel"
      aria-label="Product filters"
      inert={!areFiltersOpen}
      className={`grid min-w-0 transition-[grid-template-rows,visibility] duration-300 ease-out lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)] lg:grid-rows-[1fr] ${
        areFiltersOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr]"
      }`}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="h-full border-b border-border bg-sidebar p-4 sm:p-5 lg:w-68 lg:overflow-y-auto lg:overscroll-contain lg:border-b-0 lg:border-r scrollbar-slim">
          <Filters
            filters={filters}
            categories={categories}
            brands={brands}
            isLoadingBrands={products.isLoading}
            activeFilterCount={activeFilterCount}
            onChange={updateFilters}
            onClear={clearFilters}
          />
        </div>
      </div>
    </aside>
  );
}
