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
import { AdminOrders } from "./features/admin/orders/AdminOrders.tsx";
import { AdminOrder } from "./features/admin/orders/AdminOrder.tsx";
import { AdminRoute } from "./routes/AdminRoute.tsx";
import { AdminLayout } from "./layout/AdminLayout.tsx";
import { AdminDashboard } from "./features/admin/dashboard/AdminDashboard.tsx";
import { AdminProducts } from "./features/admin/products/AdminProducts.tsx";
import { NotFound } from "./features/errors/NotFound.tsx";
import { AdminProductDetail } from "./features/admin/products/components/AdminProductDetail.tsx";
import { AdminCategories } from "./features/admin/categories/AdminCategories.tsx";
import { AdminCoupons } from "./features/admin/coupons/AdminCoupons.tsx";
import { Categories } from "./features/categories/Categories.tsx";
import { AdminUsers } from "./features/admin/users/AdminUsers.tsx";
import { AdminTaxSettings } from "./features/admin/settings/AdminTaxSettings.tsx";
import { Forbidden } from "./features/errors/Forbidden.tsx";
import { Profile } from "./features/profile/Profile.tsx";

function App() {
  return (
    <>
      {/* Routes */}
      <Routes>
        {/* Admin */}
        <Route element={<AdminRoute></AdminRoute>}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:orderNumber" element={<AdminOrder />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/:id" element={<AdminProductDetail />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings/tax" element={<AdminTaxSettings />} />
          </Route>
        </Route>

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
            <Route path="orders/:orderNumber" element={<Order />} />
            <Route path="profile" element={<Profile />} />
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
          <Route path="categories" element={<Categories />} />
          <Route path="products/:sku" element={<ProductDetail />} />
          <Route path="403" element={<Forbidden />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
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
