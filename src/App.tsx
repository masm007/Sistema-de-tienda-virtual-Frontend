import { MainLayout } from "./layout/MainLayout";
import { AuthLayout } from "./layout/AuthLayout";
import { Login } from "./features/auth/Login";
import { SignUp } from "./features/auth/SignUp";
import { Home } from "./layout/Home";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./routes/PrivateRoute";

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
