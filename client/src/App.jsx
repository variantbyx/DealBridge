import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { HealthProvider } from "./context/HealthContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { Navbar } from "./components/layout/Navbar.jsx";
import { Footer } from "./components/layout/Footer.jsx";
import { ProtectedRoute } from "./components/auth/ProtectedRoute.jsx";
import { AdminRoute } from "./components/admin/AdminRoute.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { CatalogPage } from "./pages/CatalogPage.jsx";
import { ProductDetailsPage } from "./pages/ProductDetailsPage.jsx";
import { WishlistPage } from "./pages/WishlistPage.jsx";
import { AdminDashboardPage } from "./pages/AdminDashboardPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { ProfilePage } from "./pages/ProfilePage.jsx";
import { HealthPage } from "./pages/HealthPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <HealthProvider>
        <AuthProvider>
          <WishlistProvider>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
              <Navbar />
              <main style={{ flex: 1 }}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<CatalogPage />} />
                  <Route path="/product/:idOrSlug" element={<ProductDetailsPage />} />
                  <Route
                    path="/wishlist"
                    element={
                      <ProtectedRoute>
                        <WishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminRoute>
                        <AdminDashboardPage initialTab="analytics" />
                      </AdminRoute>
                    }
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/health" element={<HealthPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </WishlistProvider>
        </AuthProvider>
      </HealthProvider>
    </BrowserRouter>
  );
}

export default App;
