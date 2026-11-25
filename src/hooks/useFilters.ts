import { useNavigate, useSearchParams } from "react-router-dom";

export interface ProductFilters {
  categories: string[];
  q: string;
  minPrice: string;
  maxPrice: string;
  brands: string[];
  page: number;
}

function setOrDelete(params: URLSearchParams, key: string, value: string) {
  if (value) params.set(key, value);
  else params.delete(key);
}

function getList(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(",").filter(Boolean) ?? [];
}

export function toSearch(params: URLSearchParams): string {
  return params.toString().replaceAll("%2C", ",");
}

export function useFilters() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = Math.trunc(Number(searchParams.get("page")));
  const filters: ProductFilters = {
    categories: getList(searchParams, "categories"),
    q: searchParams.get("q") ?? "",
    minPrice: searchParams.get("min") ?? "",
    maxPrice: searchParams.get("max") ?? "",
    brands: getList(searchParams, "brands"),
    page: page >= 1 ? page : 1,
  };

  const updateFilters = (newFilters: Partial<ProductFilters>) => {
    const next = new URLSearchParams(searchParams);

    if (newFilters.categories !== undefined) {
      setOrDelete(next, "categories", newFilters.categories.join(","));
      next.delete("brands");
    }
    if (newFilters.q !== undefined) setOrDelete(next, "q", newFilters.q);
    if (newFilters.minPrice !== undefined)
      setOrDelete(next, "min", newFilters.minPrice);
    if (newFilters.maxPrice !== undefined)
      setOrDelete(next, "max", newFilters.maxPrice);
    if (newFilters.brands !== undefined)
      setOrDelete(next, "brands", newFilters.brands.join(","));

    const nextPage = newFilters.page ?? 1;
    setOrDelete(next, "page", nextPage > 1 ? String(nextPage) : "");

    navigate({ search: toSearch(next) });
  };

  const clearFilters = () => navigate({ search: "" });

  const activeFilterCount =
    filters.categories.length +
    (filters.q ? 1 : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    filters.brands.length;

  return { filters, updateFilters, clearFilters, activeFilterCount };
}
