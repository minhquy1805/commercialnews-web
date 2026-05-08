export type AdminAssignRoleToUserRequest = {
  userId: number;
  roleId: number;
};

export type AdminAssignRoleToUserResponse = {
  userId: number;
  roleId: number;
  isAssigned: boolean;
  wasAlreadyAssigned: boolean;
};

export type AdminRevokeRoleFromUserRequest = {
  userId: number;
  roleId: number;
};

export type AdminRevokeRoleFromUserResponse = {
  userId: number;
  roleId: number;
  isRevoked: boolean;
  wasAlreadyRevoked: boolean;
};

export type AdminUserRoleItemResponse = {
  roleId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  assignedAt: string;
  assignedByUserId: number | null;
};

export type AdminUserRolesResponse = {
  userId: number;
  roles: AdminUserRoleItemResponse[];
};

export type AdminEffectivePermissionItemResponse = {
  permissionId: number;
  publicId: string;
  key: string;
  keyNormalized: string;
  description: string | null;
  module: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
};

export type AdminUserEffectivePermissionsResponse = {
  userId: number;
  permissions: AdminEffectivePermissionItemResponse[];
};
