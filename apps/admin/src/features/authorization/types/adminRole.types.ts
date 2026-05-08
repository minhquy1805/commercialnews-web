export type AdminRoleListRequest = {
  page?: number;
  pageSize?: number;
  query?: string | null;
  isActive?: boolean | null;
};

export type AdminRoleListItemResponse = {
  roleId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdByUserId: number | null;
  updatedByUserId: number | null;
};

export type AdminRoleListResponse = {
  items: AdminRoleListItemResponse[];
  page: number;
  pageSize: number;
  totalItems: number;
};

export type AdminCreateRoleRequest = {
  name: string;
  displayName: string;
  description?: string | null;
  isSystem: boolean;
};

export type AdminCreateRoleResponse = {
  roleId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number | null;
};

export type AdminUpdateRoleRequest = {
  roleId: number;
  name: string;
  displayName: string;
  description?: string | null;
};

export type AdminUpdateRoleResponse = {
  roleId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  displayName: string;
  description: string | null;
  isSystem: boolean;
  isActive: boolean;
  updatedAt: string | null;
  updatedByUserId: number | null;
};

export type AdminRoleActionRequest = {
  roleId: number;
};

export type AdminActivateRoleResponse = {
  roleId: number;
  isActivated: boolean;
  wasAlreadyActivated: boolean;
};

export type AdminDeactivateRoleResponse = {
  roleId: number;
  isDeactivated: boolean;
  wasAlreadyDeactivated: boolean;
};
