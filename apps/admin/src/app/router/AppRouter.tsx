import { Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../../features/identity/pages/LoginPage";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { ROUTES } from "../../shared/constants/routes";
import { PublicOnlyRoute } from "../../shared/components/PublicOnlyRoute";

export function AppRouter() {
  return (
    <Routes>
      <Route
        path={ROUTES.ROOT}
        element={<Navigate to={ROUTES.DASHBOARD} replace />}
      />

      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />

      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}