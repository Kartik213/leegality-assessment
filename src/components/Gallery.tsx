import { useState } from "react";
import type { Product } from "../types/product";

export function Gallery({ product }: { product: Product }) {
  const images =
    product.images.length > 0 ? product.images : [product.thumbnail];
  const [selected, setSelected] = useState(images[0]);

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-10">
        <img
          src={selected}
          alt={product.title}
          className="size-full object-contain"
        />
      </div>
      {images.length > 1 && (
        <ul aria-label="Product images" className="mt-3 grid grid-cols-5 gap-3">
          {images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-pressed={image === selected}
                onClick={() => setSelected(image)}
                className={`aspect-square w-full rounded-xl border bg-card p-2 transition ${
                  image === selected
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:border-ring"
                }`}
              >
                <img src={image} alt="" className="size-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
