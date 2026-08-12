import { MainLayout } from "./layout/MainLayout";
import { AuthLayout } from "./layout/AuthLayout";
import { Login } from "./features/auth/Login";
import { SignUp } from "./features/auth/SignUp";
import { Home } from "./features/home/Home.tsx";
import { ProductDetail } from "./features/products/ProductDetail";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";
import { CartProvider } from "./providers/CartProvider.tsx";
import { Cart } from "./features/cart/Cart.tsx";
import { Order } from "./features/orders/user/Order.tsx";
import { Orders } from "./features/orders/user/Orders.tsx";
import { AdminOrders } from "./features/orders/admin/AdminOrders.tsx";
import { AdminOrder } from "./features/orders/admin/AdminOrder.tsx";

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
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/admin" element={<AdminOrders />} />
            <Route path="orders/admin/:orderNumber" element={<AdminOrder />} />
            <Route path="orders/:orderNumber" element={<Order />} />
          </Route>
        </Route>
        
        {/* Público */}
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
