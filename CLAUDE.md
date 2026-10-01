# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Masm Store — frontend for a virtual store built with React + TypeScript + Vite, consuming a separate ASP.NET Core REST API (EF Core, MySQL, JWT + refresh tokens via HttpOnly cookie, Cloudinary for images). The backend is not in this repo.

## Commands

```bash
npm run dev       # start dev server (http://localhost:5173)
npm run build     # tsc -b (project references) then vite build
npm run lint      # eslint .
npm run preview   # preview production build
```

There is no test setup in this repo (no test runner in package.json) — do not assume Jest/Vitest exist.

Requires a `.env` file at the root with `VITE_API_URL` pointing at the backend API, e.g. `VITE_API_URL=https://localhost:7201/api`.

## Architecture

### Routing & layouts (`src/App.tsx`)

Three parallel route trees, each with its own layout/provider wrapping, matched by `react-router-dom` v6 `<Routes>`:

- **Admin** (`/admin/*`): wrapped in `AdminRoute` (requires `isAuthenticated && isAdmin`, else redirects) → `AdminLayout` → dashboard/orders/products under `features/admin/`.
- **Private** (`/cart`, `/orders`, `/orders/:orderNumber`): wrapped in `PrivateRoute` (requires `isAuthenticated`) → `MainLayout`, itself wrapped in `CartProvider`.
- **Public** (`/`, `/products/:sku`, catch-all `*` → `NotFound`): also `CartProvider` + `MainLayout`, no auth required.
- **Auth** (`/auth`, `/auth/signUp`): `AuthLayout`, no provider wrapping.

Note: `AdminLayout` renders the shared `NavegationBar` (which includes the cart icon) but is **not** wrapped in `CartProvider` and does not render `CartModal` — clicking the cart icon while in `/admin/*` has no visible effect. Keep this in mind when touching admin layout/nav — the open question is whether admins should shop from the panel (needs `CartProvider`+`CartModal` there) or the nav should hide cart/shopping affordances in the admin context.

### Auth (`providers/AuthProvider.tsx`, `hooks/useAuth.ts`)

Context-based, not a library. Holds `user`, `token`, `isAuthenticated`, `isAdmin` (derived from `user.role === UserRole.Admin`). On mount, calls `refresh()` which hits `/users/refresh` using the HttpOnly refresh cookie (`credentials: "include"`) to silently restore a session; access token is otherwise kept in memory + `localStorage` (`STORAGE_KEYS.TOKEN`), not in a cookie. `useAuth()` throws if used outside the provider — always assume it's available in routed components since `AuthProvider` wraps the whole app (check `main.tsx`/`App.tsx` if unsure).

Roles are numeric: `UserRole.User = 0`, `UserRole.Admin = 1` (`types/User.ts`). Some older code (`NavegationBar`) checks `user?.role === 1` directly instead of `UserRole.Admin` — prefer the enum in new code.

### Cart (`providers/CartProvider.tsx`, `hooks/useCart.ts`)

Client-side only cart, persisted to `localStorage` (`STORAGE_KEYS.CART`), no backend sync until checkout. `addToCart`/`changeQuantity` throw plain `Error`s for invalid quantity or insufficient stock (`product.quantity`) — callers must catch and route through `useNotification`. Only available where `CartProvider` is an ancestor (public + private trees, not admin).

### Notifications (`providers/NotificationProvider.tsx`, `hooks/useNotification.ts`)

Global Snackbar/Alert-based notifications (`success`, `error`, `warning`, ...). The convention throughout services/features is: service functions (`services/*.ts`) throw `Error` with a Spanish, user-facing message; calling components catch and forward `err.message` to `useNotification`. Keep new API calls consistent with this pattern rather than handling errors ad-hoc in components.

### Services (`src/services/*.ts`)

Thin `fetch` wrappers, one file per backend resource (`AuthService`, `ProductService`, `OrderService`, `CategoryService`, `CouponService`). No shared HTTP client/interceptor — each function builds its own `fetch` call, reads `import.meta.env.VITE_API_URL`, checks `response.ok`, and throws a mapped Spanish error message per status code. `src/services/Api.ts` exists but is currently empty/unused. When adding endpoints, follow the existing per-file, per-status-code error mapping style rather than introducing a shared client.

Admin vs. user endpoints are distinguished by path (`/orders/admin/...` vs `/orders/...`, `/products/admin` vs `/products`) and by which token/role is calling — there is no separate "admin API base URL".

### Feature structure (`src/features/`)

Organized by domain, not by type: `auth/`, `home/`, `products/`, `cart/`, `orders/user/` (customer-facing order views), `orders/components/` (shared, e.g. `OrderSummary` used by both user and admin tables), `admin/{dashboard,orders,products}/` (each with its own `components/` subfolder for modals/detail views), `errors/` (`NotFound`, `Forbidden` — note `Forbidden` is not currently wired to a route; `AdminRoute` redirects to `/403` which doesn't exist in `App.tsx`, so it actually falls through to the catch-all `NotFound`).

Types (`src/types/`) largely mirror backend DTOs 1:1 (e.g. `Order` vs `OrderSummary` vs `CreateOrderDto`, `Product` vs `ProductRequest` vs `CreateProductDto`), including C#-style enums re-implemented as `const` objects + derived union types (see `OrderStatus`/`OrderStatusName` in `types/Order.ts`, `UserRole` in `types/User.ts`, `Status`/`StatusName` in `types/Product.ts`). When adding a new backend field, update the matching DTO-shaped type rather than reusing an unrelated one.

### Known WIP / gaps (branch `feature/adminView`)

The admin panel is actively under construction. When working in `features/admin/**`, expect partially-wired UI: e.g. `AdminProducts.tsx` renders an `AdminModalCreateProduct` but its "Nuevo Producto" button and `handleConfirmCreateProduct` are currently no-ops. Check whether a given admin flow is actually connected before assuming it works end-to-end.
