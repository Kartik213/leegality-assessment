import { useState, useId, type FormEvent } from "react";
import { parsePrice } from "../lib/filterProducts.ts";

export const INPUT_CLASSES =
  "h-10 w-full rounded-md border border-input bg-card px-2.5 text-sm text-foreground placeholder:text-muted-foreground aria-invalid:border-destructive";

export function PriceForm({
  minPrice,
  maxPrice,
  onApply,
}: {
  minPrice: string;
  maxPrice: string;
  onApply: (minPrice: string, maxPrice: string) => void;
}) {
  const [min, setMin] = useState(minPrice);
  const [max, setMax] = useState(maxPrice);
  const minId = useId();
  const maxId = useId();
  const errorId = useId();

  const parsedMin = parsePrice(min);
  const parsedMax = parsePrice(max);
  const isInverted =
    parsedMin !== null && parsedMax !== null && parsedMin > parsedMax;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (isInverted) return;
    onApply(
      parsedMin === null ? "" : String(parsedMin),
      parsedMax === null ? "" : String(parsedMax),
    );
  };

  const describedBy = isInverted ? errorId : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <label htmlFor={minId} className="sr-only">
            Minimum price
          </label>
          <input
            id={minId}
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="Min"
            className={INPUT_CLASSES}
            value={min}
            aria-invalid={isInverted || undefined}
            aria-describedby={describedBy}
            onChange={(event) => setMin(event.target.value)}
          />
        </div>
        <div className="min-w-0 flex-1">
          <label htmlFor={maxId} className="sr-only">
            Maximum price
          </label>
          <input
            id={maxId}
            type="number"
            min={0}
            inputMode="decimal"
            placeholder="Max"
            className={INPUT_CLASSES}
            value={max}
            aria-invalid={isInverted || undefined}
            aria-describedby={describedBy}
            onChange={(event) => setMax(event.target.value)}
          />
        </div>
      </div>
      {isInverted && (
        <p id={errorId} className="mt-2 text-xs font-medium text-destructive" role="alert">
          Min price is higher than max price.
        </p>
      )}
      <button
        type="submit"
        className="mt-3 h-10 w-full rounded-md bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Apply
      </button>
    </form>
  );
}