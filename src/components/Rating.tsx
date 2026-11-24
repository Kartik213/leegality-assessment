interface RatingProps {
  rating: number;
  className?: string;
}

const STARS = "★★★★★";

export function Rating({ rating, className = "" }: RatingProps) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <span
      role="img"
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={`Rated ${rating.toFixed(1)} out of 5`}
    >
      <span className="relative leading-none text-ring" aria-hidden="true">
        {STARS}
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap text-star"
          style={{ width: `${percent}%` }}
        >
          {STARS}
        </span>
      </span>
      <span className="text-xs text-muted-foreground" aria-hidden="true">
        ({rating.toFixed(1)})
      </span>
    </span>
  );
}
