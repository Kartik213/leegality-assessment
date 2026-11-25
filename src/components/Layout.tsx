import { useState, useEffect, useEffectEvent, type FormEvent } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { toSearch, useFilters } from "../hooks/useFilters";
import { SearchIcon, Icon } from "../components/Icon.tsx";

const ICON_BUTTON_CLASSES =
  "relative grid size-10 shrink-0 place-items-center rounded-md transition hover:bg-white/10 focus-visible:outline-white";
const SEARCH_DEBOUNCE_MS = 300;
const DESKTOP_QUERY = "(min-width: 1024px)";

export interface LayoutContext {
  areFiltersOpen: boolean;
}

export function Layout() {
  const { filters, activeFilterCount } = useFilters();
  const query = filters.q;
  const [value, setValue] = useState(query);
  const [previousQuery, setPreviousQuery] = useState(query);
  const [lastSent, setLastSent] = useState(query);
  const navigate = useNavigate();
  const location = useLocation();
  const text = value.trim();

  const [areFiltersOpen, setAreFiltersOpen] = useState(
    () => window.matchMedia(DESKTOP_QUERY).matches,
  );

  const isListing = useLocation().pathname === "/";

  if (query !== previousQuery) {
    setPreviousQuery(query);
    if (query !== lastSent) {
      setValue(query);
      setLastSent(query);
    }
  }

  const search = () => {
    if (text === query) return;
    const isListing = location.pathname === "/";
    const params = new URLSearchParams(isListing ? location.search : "");
    if (text) params.set("q", text);
    else params.delete("q");
    params.delete("page");
    setLastSent(text);
    navigate(
      { pathname: "/", search: toSearch(params) },
      { replace: isListing },
    );
  };

  const onPause = useEffectEvent(search);
  useEffect(() => {
    const timer = setTimeout(onPause, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    search();
  };

  return (
    <div className="flex min-h-svh flex-col ">
      <a
        href="#main"
        className="sr-only rounded-lg px-4 py-2 font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50"
      >
        Skip to main content
      </a>
      <header className="sticky top-0 z-30 bg-nav text-nav-foreground shadow-xs">
        <div className="mx-auto flex h-16 items-center gap-3 px-4 sm:gap-6">
          {isListing && (
            <button
              type="button"
              aria-label="Filters"
              aria-expanded={areFiltersOpen}
              aria-controls="filters-panel"
              onClick={() => setAreFiltersOpen((isOpen) => !isOpen)}
              className={ICON_BUTTON_CLASSES}
            >
              <Icon className="size-6">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </Icon>
              {activeFilterCount > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground ring-2 ring-nav">
                  {activeFilterCount}
                  <span className="sr-only"> active filters</span>
                </span>
              )}
            </button>
          )}

          <form
            role="search"
            onSubmit={handleSubmit}
            className="relative mx-auto w-full max-w-xl"
          >
            <label htmlFor="header-search" className="sr-only">
              Search products
            </label>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="header-search"
              type="search"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-lg bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-white"
            />
          </form>
          <div className="hidden shrink-0 items-center gap-5 sm:flex">
            <Icon className="size-5">
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 7H6" />
            </Icon>
            <Icon className="size-5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </Icon>
          </div>
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className="flex w-full flex-1 flex-col focus:outline-none"
      >
        <Outlet context={{ areFiltersOpen } satisfies LayoutContext} />
      </main>
    </div>
  );
}
