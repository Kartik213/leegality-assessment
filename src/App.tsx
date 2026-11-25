import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage.tsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.tsx";
import { ProductListPage } from "./pages/ProductListPage.tsx";
import { Layout } from "./components/Layout.tsx";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<ProductListPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
