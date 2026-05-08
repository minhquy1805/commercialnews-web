export type AdminGrantPermissionToRoleRequest = {
  roleId: number;
  permissionId: number;
};

export type AdminGrantPermissionToRoleResponse = {
  roleId: number;
  permissionId: number;
  isGranted: boolean;
  wasAlreadyGranted: boolean;
};

export type AdminRevokePermissionFromRoleRequest = {
  roleId: number;
  permissionId: number;
};

export type AdminRevokePermissionFromRoleResponse = {
  roleId: number;
  permissionId: number;
  isRevoked: boolean;
  wasAlreadyRevoked: boolean;
};

export type AdminRolePermissionItemResponse = {
  permissionId: number;
  publicId: string;
  key: string;
  keyNormalized: string;
  description: string | null;
  module: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
  grantedAt: string;
  grantedByUserId: number | null;
};

export type AdminRolePermissionsResponse = {
  roleId: number;
  permissions: AdminRolePermissionItemResponse[];
};

export type AdminPermissionRoleItemResponse = {
  roleId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  grantedAt: string;
  grantedByUserId: number | null;
};

export type AdminPermissionRolesResponse = {
  permissionId: number;
  roles: AdminPermissionRoleItemResponse[];
};
