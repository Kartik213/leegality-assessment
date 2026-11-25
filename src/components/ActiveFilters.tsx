import type { ProductFilters } from "../hooks/useFilters.ts";

interface ActiveFiltersProps {
  filters: ProductFilters;
  getCategoryName: (slug: string) => string;
  onChange: (patch: Partial<ProductFilters>) => void;
  onClear: () => void;
}

interface Chip {
  key: string;
  label: string;
  remove: () => void;
}

function describePrice(min: string, max: string): string {
  if (min && max) return `$${min} – $${max}`;
  return min ? `From $${min}` : `Up to $${max}`;
}

export function ActiveFilters({
  filters,
  getCategoryName,
  onChange,
  onClear,
}: ActiveFiltersProps) {
  const chips: Chip[] = [];

  if (filters.q) {
    chips.push({
      key: "q",
      label: `Search: ${filters.q}`,
      remove: () => onChange({ q: "" }),
    });
  }
  for (const category of filters.categories) {
    chips.push({
      key: `category-${category}`,
      label: getCategoryName(category),
      remove: () =>
        onChange({
          categories: filters.categories.filter((item) => item !== category),
        }),
    });
  }
  if (filters.minPrice || filters.maxPrice) {
    chips.push({
      key: "price",
      label: describePrice(filters.minPrice, filters.maxPrice),
      remove: () => onChange({ minPrice: "", maxPrice: "" }),
    });
  }
  for (const brand of filters.brands) {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      remove: () =>
        onChange({ brands: filters.brands.filter((item) => item !== brand) }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <ul aria-label="Active filters" className="mb-5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.remove}
            aria-label={`Remove filter: ${chip.label}`}
            className="inline-flex min-h-9 items-center gap-2 rounded-full bg-secondary px-3.5 text-sm font-medium text-secondary-foreground ring-1 ring-primary/25 transition hover:ring-primary"
          >
            {chip.label}
            <span aria-hidden="true" className="text-base leading-none">
              ×
            </span>
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={onClear}
          className="min-h-9 rounded-full px-3 text-sm font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
        >
          Clear all
        </button>
      </li>
    </ul>
  );
}
