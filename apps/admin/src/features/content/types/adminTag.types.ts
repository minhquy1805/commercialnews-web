export type AdminTag = {
  tagId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type AdminTagListItem = {
  tagId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  version: number;
};

export type AdminTagFilter = {
  page?: number;
  pageSize?: number;
  keyword?: string | null;
  isActive?: boolean | null;
  isDeleted?: boolean;
  sort?: string | null;
};

export type CreateAdminTagRequest = {
  name: string;
  description?: string | null;
  isActive: boolean;
};

export type CreateAdminTagResponse = {
  tagId: number;
  publicId: string;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  version: number;
  createdAt: string;
};

export type UpdateAdminTagRequest = {
  tagId: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  expectedVersion: number;
};

export type UpdateAdminTagResponse = {
  tagId: number;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  version: number;
  updatedAt: string;
};

export type SoftDeleteAdminTagRequest = {
  tagId: number;
  expectedVersion: number;
};

export type SoftDeleteAdminTagResponse = {
  tagId: number;
  isDeleted: boolean;
  isActive: boolean;
  version: number;
  updatedAt: string;
  deletedAt: string;
};

export type RestoreAdminTagRequest = {
  tagId: number;
  expectedVersion: number;
};

export type RestoreAdminTagResponse = {
  tagId: number;
  isDeleted: boolean;
  version: number;
  updatedAt: string;
};