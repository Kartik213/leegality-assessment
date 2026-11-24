import type { ProductSummary } from "../types/product.ts";
import { ProductCard } from "./ProductCard.tsx";

interface ProductsProps {
  products: ProductSummary[];
}

export function Products({ products }: ProductsProps) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="grid">
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
