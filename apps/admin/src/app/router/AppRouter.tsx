import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../../features/dashboard/pages/DashboardPage";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { ProtectedRoute } from "../../shared/components/ProtectedRoute";
import { PublicOnlyRoute } from "../../shared/components/PublicOnlyRoute";
import { ROUTES } from "../../shared/constants/routes";
import { MyProfilePage } from "../../features/auth/pages/MyProfilePage";
import { PermissionDetailPage } from "../../features/authorization/pages/PermissionDetailPage";
import { PermissionsPage } from "../../features/authorization/pages/PermissionsPage";
import { RoleDetailPage } from "../../features/authorization/pages/RoleDetailPage";
import { RolesPage } from "../../features/authorization/pages/RolesPage";
import { UserDetailPage } from "../../features/identity/pages/UserDetailPage";
import { UsersPage } from "../../features/identity/pages/UsersPage";

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
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
        <Route path={ROUTES.PROFILE} element={<MyProfilePage />} />
        <Route path={ROUTES.IDENTITY_USERS} element={<UsersPage />} />
        <Route
          path={ROUTES.IDENTITY_USER_DETAIL}
          element={<UserDetailPage />}
        />
        <Route path={ROUTES.AUTHORIZATION_ROLES} element={<RolesPage />} />
        <Route
          path={ROUTES.AUTHORIZATION_ROLE_DETAIL}
          element={<RoleDetailPage />}
        />
        <Route
          path={ROUTES.AUTHORIZATION_PERMISSIONS}
          element={<PermissionsPage />}
        />
        <Route
          path={ROUTES.AUTHORIZATION_PERMISSION_DETAIL}
          element={<PermissionDetailPage />}
        />
      </Route>
    </Routes>
  );
}
