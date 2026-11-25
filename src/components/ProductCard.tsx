import { Link } from "react-router-dom";
import type { ProductSummary } from "../types/product.ts";
import { formatPrice } from "../lib/format.ts";
import { Rating } from "./Rating.tsx";

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      state={{ fromListing: true }}
      className="group flex flex-col rounded-xl bg-card p-4 shadow-xs ring-1 ring-border transition motion-safe:duration-200 hover:shadow-md hover:ring-ring"
    >
      <div className="aspect-square overflow-hidden rounded-lg p-2">
        <img
          src={product.thumbnail}
          alt=""
          loading="lazy"
          className="size-full object-contain transition motion-safe:duration-300 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col border-t border-border pt-3">
        <h2 className="line-clamp-2 min-h-10 font-semibold leading-5">
          {product.title}
        </h2>
        <div className="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 pt-2">
          <p className="text-base font-bold tracking-tight">
            {formatPrice(product.price)}
          </p>
          <Rating rating={product.rating} className="text-sm" />
        </div>
      </div>
    </Link>
  );
}
