import type { ProductSummary } from "../types/product.ts";

interface ClientFilters {
  q: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
}

export function parsePrice(value: string): number | null {
  if (value.trim() === "") return null;
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : null;
}

export function filterProducts(
  products: ProductSummary[],
  filters: ClientFilters,
): ProductSummary[] {
  const min = parsePrice(filters.minPrice);
  const max = parsePrice(filters.maxPrice);
  const brands = new Set(filters.brands);
  const query = filters.q.trim().toLowerCase();

  return products.filter((product) => {
    if (min !== null && product.price < min) return false;
    if (max !== null && product.price > max) return false;
    if (brands.size > 0 && !(product.brand && brands.has(product.brand))) {
      return false;
    }
    if (query) {
      const haystack =
        `${product.title} ${product.brand ?? ""} ${product.category}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function getUniqueBrands(products: ProductSummary[]): string[] {
  const brands = new Set<string>();
  for (const product of products) {
    if (product.brand) brands.add(product.brand);
  }
  return [...brands].sort((a, b) => a.localeCompare(b));
}
