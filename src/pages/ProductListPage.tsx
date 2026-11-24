import { Products } from "../components/Products";
import { useEffect, useState } from "react";

export function ProductListPage() {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://dummyjson.com/products");
      const products = await response.json();
      console.log(products);
      setProducts(products.products);
    };

    fetchProducts();
  }, []);

  return (
    <div className="rounded-xl bg-surface px-6 py-20 text-center shadow-xs space-y-10">
      <h1 className="mt-3 text-2xl font-bold">Product List Page</h1>
      <Products products={products} />
    </div>
  );
}
