export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  rating: number;
  thumbnail: string;
  category: string;
  brand?: string;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

export interface Product extends ProductSummary {
  description: string;
  images: string[];
  availabilityStatus: string;
  reviews?: Review[];
}

export interface ProductListResponse {
  products: ProductSummary[];
}

export interface Category {
  slug: string;
  name: string;
}
