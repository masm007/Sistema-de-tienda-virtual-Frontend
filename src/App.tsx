import { MainLayout } from "./layout/MainLayout.tsx";
import { AuthLayout } from "./layout/AuthLayout.tsx";
import { Login } from "./features/auth/Login.tsx";
import { SignUp } from "./features/auth/SignUp.tsx";
import { Home } from "./layout/Home.tsx";
import { Routes, Route, Link } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute.tsx";

function App() {
  return (
    <>
      {/* Routes */}
      <Routes>
        {/* Privado */}
        <Route element={<PrivateRoute></PrivateRoute>}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
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
