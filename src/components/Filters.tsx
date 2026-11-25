import { useId, useState, type FormEvent, type ReactNode } from "react";
import type { FetchState } from "../hooks/useFetch.ts";
import type { ProductFilters } from "../hooks/useFilters.ts";
import type { Category } from "../types/product.ts";
import { SearchIcon } from "../components/Icon.tsx";
import { PriceForm } from "./PriceForm.tsx";

interface FiltersProps {
  filters: ProductFilters;
  categories: FetchState<Category[]>;
  brands: string[];
  isLoadingBrands: boolean;
  activeFilterCount: number;
  onChange: (patch: Partial<ProductFilters>) => void;
  onClear: () => void;
}

const OPTION_CLASSES =
  "flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-1 text-sm transition hover:text-accent-foreground has-checked:font-semibold";
export const INPUT_CLASSES =
  "h-10 w-full rounded-md border border-input bg-card px-2.5 text-sm text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive";

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  const headingId = useId();
  return (
    <div role="group" aria-labelledby={headingId} className="border-t border-border pt-4">
      <h3 id={headingId} className="mb-2 text-sm font-semibold">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function Filters({
  filters,
  categories,
  brands,
  isLoadingBrands,
  activeFilterCount,
  onChange,
  onClear,
}: FiltersProps) {
  const [search, setSearch] = useState("");
  const searchId = useId();
  const needle = search.trim().toLowerCase();

  const matches = (text: string, isSelected: boolean) =>
    !needle || isSelected || text.toLowerCase().includes(needle);

  const visibleCategories = (categories.data ?? []).filter((category) =>
    matches(category.name, filters.categories.includes(category.slug)),
  );
  const visibleBrands = brands.filter((brand) =>
    matches(brand, filters.brands.includes(brand)),
  );

  const toggle = (list: string[], item: string) =>
    list.includes(item) ? list.filter((value) => value !== item) : [...list, item];

  return (
    <div className="space-y-4">
      <div className="flex min-h-9 items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-bold">
          <SearchIcon className="size-4" />
          Filters
        </h2>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="min-h-9 rounded px-2 text-sm font-semibold text-foreground underline-offset-2 hover:underline"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="relative">
        <label htmlFor={searchId} className="sr-only">
          Search categories and brands in this list
        </label>
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={searchId}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search filters..."
          className={`${INPUT_CLASSES} pl-8`}
        />
      </div>

      <FilterGroup title="Categories">
        {categories.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading categories…</p>
        ) : categories.error ? (
          <p className="text-sm text-destructive" role="alert">
            Couldn't load categories.{" "}
            <button
              type="button"
              onClick={categories.retry}
              className="font-semibold underline"
            >
              Retry
            </button>
          </p>
        ) : visibleCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matching categories.</p>
        ) : (
          <div className="-mx-1 max-h-56 overflow-y-auto px-1 scrollbar-slim">
            {visibleCategories.map((category) => (
              <label key={category.slug} className={OPTION_CLASSES}>
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={filters.categories.includes(category.slug)}
                  onChange={() =>
                    onChange({
                      categories: toggle(filters.categories, category.slug),
                    })
                  }
                />
                {category.name}
              </label>
            ))}
          </div>
        )}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <PriceForm
          key={`${filters.minPrice}|${filters.maxPrice}`}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onApply={(minPrice, maxPrice) => onChange({ minPrice, maxPrice })}
        />
      </FilterGroup>

      <FilterGroup title="Brands">
        {isLoadingBrands ? (
          <p className="text-sm text-muted-foreground">Loading brands…</p>
        ) : visibleBrands.length === 0 ? (
          <p className="text-sm text-muted-foreground">No matching brands.</p>
        ) : (
          <div className="-mx-1 max-h-56 overflow-y-auto px-1 scrollbar-slim">
            {visibleBrands.map((brand) => (
              <label key={brand} className={OPTION_CLASSES}>
                <input
                  type="checkbox"
                  className="size-4 accent-primary"
                  checked={filters.brands.includes(brand)}
                  onChange={() =>
                    onChange({ brands: toggle(filters.brands, brand) })
                  }
                />
                {brand}
              </label>
            ))}
          </div>
        )}
      </FilterGroup>
    </div>
  );
}
