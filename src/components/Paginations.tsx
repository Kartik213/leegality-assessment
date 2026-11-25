interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

type PageItem = number | "gap-start" | "gap-end";

function getPageItems(page: number, totalPages: number): PageItem[] {
  const items: PageItem[] = [];
  for (let current = 1; current <= totalPages; current++) {
    const isEdge = current === 1 || current === totalPages;
    const isNearby = Math.abs(current - page) <= 1;
    if (isEdge || isNearby) {
      items.push(current);
    } else if (items[items.length - 1] !== "gap-start" && current < page) {
      items.push("gap-start");
    } else if (items[items.length - 1] !== "gap-end" && current > page) {
      items.push("gap-end");
    }
  }
  return items;
}

const BUTTON_CLASSES =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-md px-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40";
const IDLE_CLASSES =
  "bg-card text-foreground ring-1 ring-border hover:bg-accent hover:text-accent-foreground disabled:hover:bg-card disabled:hover:text-foreground";
const ACTIVE_CLASSES = "bg-primary text-primary-foreground";

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        className={`${BUTTON_CLASSES} ${IDLE_CLASSES}`}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span aria-hidden="true">←&nbsp;</span>
        Previous
      </button>
      {getPageItems(page, totalPages).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            aria-current={item === page ? "page" : undefined}
            aria-label={`Page ${item}`}
            className={`${BUTTON_CLASSES} ${item === page ? ACTIVE_CLASSES : IDLE_CLASSES}`}
            onClick={() => onPageChange(item)}
          >
            {item}
          </button>
        ) : (
          <span key={item} className="px-1 text-muted-foreground" aria-hidden="true">
            …
          </span>
        ),
      )}
      <button
        type="button"
        className={`${BUTTON_CLASSES} ${IDLE_CLASSES}`}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
        <span aria-hidden="true">&nbsp;→</span>
      </button>
    </nav>
  );
}
