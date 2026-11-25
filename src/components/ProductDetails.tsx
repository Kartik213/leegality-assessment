import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Rating } from "../components/Rating.tsx";
import { formatPrice } from "../lib/format.ts";
import type { Product } from "../types/product.ts";
import { Reviews } from "./Reviews.tsx";
import { Gallery } from "./Gallery.tsx"; 

export function ProductDetails({ product }: { product: Product }) {
  const categoryName = product.category.replaceAll("-", " ");
  const categoryUrl = `/?categories=${encodeURIComponent(product.category)}`;
  const reviews = product.reviews ?? [];

  return (
    <>
      <article className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <Gallery product={product} />

        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {product.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Rating rating={product.rating} />
            <a
              href="#reviews"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById("reviews")?.scrollIntoView();
              }}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </a>
          </div>

          <p className="mt-6 text-4xl font-semibold tracking-tight">
            {formatPrice(product.price)}
          </p>

          <section aria-labelledby="description-heading" className="mt-8">
            <h2
              id="description-heading"
              className="text-lg font-semibold tracking-tight"
            >
              Description
            </h2>
            <p className="mt-2 leading-relaxed text-muted-foreground text-pretty">
              {product.description}
            </p>
          </section>

          <dl className="mt-8 divide-y divide-border rounded-xl border border-border bg-card text-sm">
            <DetailRow term="Brand">{product.brand ?? "Unbranded"}</DetailRow>
            <DetailRow term="Category">
              <Link
                to={categoryUrl}
                className="capitalize underline underline-offset-4"
              >
                {categoryName}
              </Link>
            </DetailRow>
          </dl>
        </div>
      </article>
      <Reviews rating={product.rating} reviews={reviews} />
    </>
  );
}

function DetailRow({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-3">
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="text-right font-medium">{children}</dd>
    </div>
  );
}