import type { FlatPagedResult } from '../../../shared/pagination';

export type AdminPermissionListRequest = {
  page?: number;
  pageSize?: number;
  query?: string | null;
  module?: string | null;
  action?: string | null;
  isActive?: boolean | null;
};

export type AdminPermissionListItemResponse = {
  permissionId: number;
  publicId: string;
  key: string;
  keyNormalized: string;
  description: string | null;
  module: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  createdByUserId: number | null;
  updatedByUserId: number | null;
};

export type AdminPermissionListResponse = FlatPagedResult<AdminPermissionListItemResponse>;

export type AdminCreatePermissionRequest = {
  key: string;
  module: string;
  action: string;
  description?: string | null;
  isSystem: boolean;
};

export type AdminCreatePermissionResponse = {
  permissionId: number;
  publicId: string;
  key: string;
  keyNormalized: string;
  description: string | null;
  module: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  createdByUserId: number | null;
};

export type AdminUpdatePermissionRequest = {
  permissionId: number;
  key: string;
  module: string;
  action: string;
  description?: string | null;
};

export type AdminUpdatePermissionResponse = {
  permissionId: number;
  publicId: string;
  key: string;
  keyNormalized: string;
  description: string | null;
  module: string;
  action: string;
  isSystem: boolean;
  isActive: boolean;
  updatedAt: string | null;
  updatedByUserId: number | null;
};

export type AdminPermissionActionRequest = {
  permissionId: number;
};

export type AdminActivatePermissionResponse = {
  permissionId: number;
  isActivated: boolean;
  wasAlreadyActivated: boolean;
};

export type AdminDeactivatePermissionResponse = {
  permissionId: number;
  isDeactivated: boolean;
  wasAlreadyDeactivated: boolean;
};
