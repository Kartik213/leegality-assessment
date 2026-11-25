import { Rating } from "./Rating";
import { formatDate } from "../lib/format.ts";
import type { Review } from "../types/product.ts";

export function Reviews({ rating, reviews }: { rating: number; reviews: Review[] }) {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="mt-16 scroll-mt-24 border-t border-border pt-10"
    >
      <h2 id="reviews-heading" className="text-2xl font-semibold tracking-tight">
        Customer reviews
      </h2>
      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
        <div className="self-start rounded-2xl border border-border bg-card p-6">
          <p className="text-5xl font-semibold tracking-tight">{rating.toFixed(1)}</p>
          <Rating rating={rating} showValue={false} className="mt-2 text-lg" />
          <p className="mt-2 text-sm text-muted-foreground">
            Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <ul className="grid gap-4">
            {reviews.map((review) => (
              <li
                key={`${review.reviewerName}-${review.date}`}
                className="rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground"
                  >
                    {review.reviewerName
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{review.reviewerName}</p>
                    <p className="text-xs text-muted-foreground">
                      <time dateTime={review.date}>{formatDate(review.date)}</time>
                    </p>
                  </div>
                  <Rating rating={review.rating} className="text-sm" />
                </div>
                <p className="mt-3 leading-relaxed">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}