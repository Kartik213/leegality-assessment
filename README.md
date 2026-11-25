# Leegality Frontend Engineer Assessment

A small product catalog built with the [DummyJSON products API](https://dummyjson.com/docs/products).

- **Listing page** (`/`): search in the header, filters on the left (category, price range, brand), product grid on the right and pagination at the bottom.
- **Detail page** (`/product/:id`): images, name, price, rating, description, brand, category and reviews. The Back button takes you to the listing with the same filters.

**Demo:** [leegality-assessment](https://leegality-assessment-henna.vercel.app/)

## Setup

You need Node.js 24 or newer.

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # type-check and build
npm run preview   # run the production build locally
npm run lint      # run oxlint
```

## Tech stack

React 19, TypeScript, React Router 7, Tailwind CSS 4 and Vite. I did not use any UI library or data-fetching library.

## Project structure

```
src/
  pages/                  ProductListPage, ProductDetailPage, NotFoundPage
  components/             Layout (header and search), FiltersSidebar, Filters, PriceForm,
                          ActiveFilters, Products, ProductCard, Paginations,
                          ProductDetails, Gallery, Reviews, Rating,
                          ErrorState, skeletons, Icon
  hooks/useFetch.ts       fetching: loading, error, retry, cancel and cache
  hooks/useFilters.ts     reads the filters from the URL and writes them back
  lib/products.ts         API URLs and the fetch function
  lib/filterProducts.ts   search, price and brand filtering, unique brands
  lib/format.ts           price and date formatting
  types/product.ts        types for the API responses
```

## API usage

| Purpose              | Endpoint                                             |
| -------------------- | ---------------------------------------------------- |
| All products         | `GET /products?limit=0&select=…`                     |
| Categories           | `GET /products/categories`                           |
| Products in category | `GET /products/category/{category}?limit=0&select=…` |
| Product detail       | `GET /products/{id}`                                 |

## Architectural decisions

### Filters are stored in the URL

Search text, categories, price range, brands and page number are all query params, for example:

```
/?categories=smartphones,laptops&brands=Apple,Samsung&min=500&page=2
```

I did this because the assignment says the filters should stay applied when the user comes back from the detail page. The listing page reads everything from the URL, so pressing Back shows the same list again. It also means a reload keeps the filters and a filtered page can be shared as a link. Only `useFilters` reads and writes these params.

### Categories from the API, other filters in the browser

- Category is multi-select. For every selected category I call `/products/category/{category}`, all at the same time. If no category is selected I call `/products`.
- DummyJSON cannot filter by price or brand, so price, brand and search are filtered in the browser.
- Because of that, pagination is also done in the browser. I fetch the full list (`limit=0`) and then cut it into pages of 8. If I used `limit` and `skip` from the API and then filtered, some pages would have fewer items and the page count would be wrong.
- The data is small (194 products) and I use `select` to fetch only the fields the cards need.

### My own `useFetch` hook

It is a small hook that does what this app needs:

- loading and error state, with a retry function
- cancels the old request when the URL changes, so a slow old response cannot replace a newer one
- keeps responses in a `Map`, so coming back from a product page shows the list right away without a loading flash
- on the listing page it keeps showing the old products (slightly faded) while a new category is loading, instead of showing the skeleton again

### How the filters behave

- Changing any filter goes back to page 1.
- Changing the category clears the selected brands. The brand list comes from the products of the selected categories, so an old brand may not exist in the new list.
- Price has Min and Max inputs with an Apply button, like the reference design. If Min is bigger than Max, it shows an error and does not apply.
- The header search checks the product title, brand and category. It searches 300ms after you stop typing, or right away on Enter.
- The small search box inside the filter panel only searches the category and brand names in the panel.
- Filters work together. Inside brands or categories it is "any of the selected".

### Loading and errors

- Skeletons while the product list or a product is loading.
- An error message with a "Try again" button if a request fails.
- "Product not found" if the product id does not exist.
- A "No products found" message with a "Clear filters" button when nothing matches.
- If only the category request fails, the error shows inside the filter panel and the products still work.

## Design and accessibility

- Colors follow the reference screenshots: navy header, light page, white cards, blue buttons and gold stars. They are defined once in `src/index.css` and the components only use those names.
- The filter sidebar can be opened and closed from the menu button in the header. On large screens it stays fixed while the products scroll.
- Selected filters are shown as chips above the products. Each can be removed, and there is a "Clear all".
- Basic accessibility: a skip link, labels on all inputs, visible focus outline, `aria-current` on the active page, `aria-expanded` on the menu button, and the result count is announced to screen readers.
- Animations are turned off if the user has "reduce motion" enabled.

## Assumptions

- Pagination is done in the browser. To build the list of unique brands I already have to load all the products, so using `limit` and `skip` from the API for pagination does not make sense. The assignment also allows client-side filtering and the data is small.
- The brand list shows the brands of the selected categories. With no category selected it shows all brands.
- Some products (like groceries) have no brand. They show normally, they are hidden when a brand is selected, and the detail page shows "Unbranded".
- Price filter uses the normal `price`, not the discounted one. Min and Max are both included.
- Prices are shown in USD.
- The cart and account icons in the header are only for looks.
- 8 products per page.

## Improvements if I had more time

- Add sorting (price, rating). Right now, when more than one category is selected, the products are listed in the order the categories were selected.
- Keep the selected brands when the category changes, if they still exist in the new list.
- Show the number of products next to each category and brand.
- Show a placeholder while product images are loading.
- Write unit tests for `filterProducts` and `useFilters`, and one end-to-end test for filter → detail → back.
- Use TanStack Query in place of my `useFetch` hook for caching, retries and avoiding duplicate requests.
- For a big catalog, move filtering and pagination to the server. That needs an API that can filter by price and brand.
- Test with a screen reader, and set the page title for each page.
