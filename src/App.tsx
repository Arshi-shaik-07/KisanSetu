import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppStateProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { BuyerMarketplace } from "./pages/BuyerMarketplace";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { TwoFactor } from "./pages/TwoFactor";
import { Verification } from "./pages/Verification";

export default function App() {
  return (
    <AuthProvider>
      <AppStateProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="login/2fa" element={<TwoFactor />} />
              <Route path="register" element={<Register />} />
              <Route
                path="verification"
                element={
                  <ProtectedRoute>
                    <Verification />
                  </ProtectedRoute>
                }
              />
              <Route
                path="farmer"
                element={
                  <ProtectedRoute roles={["farmer"]}>
                    <FarmerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="marketplace"
                element={
                  <ProtectedRoute>
                    <BuyerMarketplace />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppStateProvider>
    </AuthProvider>
  );
}
