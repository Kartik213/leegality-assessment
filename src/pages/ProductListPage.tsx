import { useOutletContext } from "react-router-dom";
import type { LayoutContext } from "../components/Layout.tsx";
import { Products } from "../components/Products";
import { useFetchMany, useFetch } from "../hooks/useFetch";
import { productsUrl, categoriesUrl } from "../lib/products";
import type { Category, ProductListResponse } from "../types/product.ts";
import { useFilters } from "../hooks/useFilters";
import { FilterSidebar } from "../components/FiltersSidebar.tsx";

export function ProductListPage() {
  const { filters } = useFilters();
  const { areFiltersOpen } = useOutletContext<LayoutContext>();
  const productUrls =
    filters.categories.length > 0
      ? filters.categories.map((category) => productsUrl(category))
      : [productsUrl()];
  const products = useFetchMany<ProductListResponse>(productUrls);
  const categories = useFetch<Category[]>(categoriesUrl());

  return (
    <div
      className={`grid flex-1 transition-[grid-template-columns] duration-300 ease-out ${
        areFiltersOpen
          ? "lg:grid-cols-[17rem_minmax(0,1fr)]"
          : "lg:grid-cols-[0rem_minmax(0,1fr)]"
      }`}
    >
      <FilterSidebar products={products} categories={categories} />
      <Products products={products} categories={categories} />
    </div>
  );
}
