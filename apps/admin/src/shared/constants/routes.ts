export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  IDENTITY_USERS: "/identity/users",
  IDENTITY_USER_DETAIL: "/identity/users/:userId",
  AUTHORIZATION_ROLES: "/authorization/roles",
  AUTHORIZATION_ROLE_DETAIL: "/authorization/roles/:roleId",
  AUTHORIZATION_PERMISSIONS: "/authorization/permissions",
  AUTHORIZATION_PERMISSION_DETAIL: "/authorization/permissions/:permissionId",
} as const;
