const BASE_URL = "https://dummyjson.com";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function fetchData<T>(
  url: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(url, { cache: "force-cache", signal });
  if (!response.ok) {
    throw new ApiError(
      response.status,
      `Request failed with status ${response.status}`,
    );
  }
  return (await response.json()) as T;
}

export function productsUrl(category?: string): string {
  const path = category
    ? `/products/category/${encodeURIComponent(category)}`
    : "/products";
  return `${BASE_URL}${path}?limit=0&select=title,price,rating,thumbnail,category,brand`;
}

export function categoriesUrl(): string {
  return `${BASE_URL}/products/categories`;
}

export function productUrl(id: string): string {
  return `${BASE_URL}/products/${encodeURIComponent(id)}`;
}
