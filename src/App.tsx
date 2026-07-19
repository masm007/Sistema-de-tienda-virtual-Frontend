import { MainLayout } from "./layout/MainLayout";
import { AuthLayout } from "./layout/AuthLayout";
import { Login } from "./features/auth/Login";
import { SignUp } from "./features/auth/SignUp";
import { Home } from "./layout/Home";
import { ProductDetail } from "./features/products/ProductDetail";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { CartProvider } from "./providers/CartProvider.tsx";

function App() {
  return (
    <>
      {/* Routes */}
      <Routes>
        {/* Privado */}
        <Route element={<PrivateRoute></PrivateRoute>}>
          <Route
            path="/"
            element={
              <CartProvider>
                <MainLayout />
              </CartProvider>
            }
          >
            <Route index element={<Home />} />
            <Route path="products/:id" element={<ProductDetail />} />
          </Route>
        </Route>
        {/* Público */}
        {/* Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="signUp" element={<SignUp />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
