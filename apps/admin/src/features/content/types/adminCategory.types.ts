export type AdminCategory = {
  categoryId: number;
  publicId: string;
  parentCategoryId: number | null;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  isDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
};

export type AdminCategoryListItem = {
  categoryId: number;
  publicId: string;
  parentCategoryId: number | null;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string | null;
  version: number;
};

export type AdminCategoryFilter = {
  page?: number;
  pageSize?: number;
  keyword?: string | null;
  parentCategoryId?: number | null;
  isActive?: boolean | null;
  isDeleted?: boolean;
  sort?: string | null;
};

export type CreateAdminCategoryRequest = {
  parentCategoryId?: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
};

export type CreateAdminCategoryResponse = {
  categoryId: number;
  publicId: string;
  parentCategoryId: number | null;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  version: number;
  createdAt: string;
};

export type UpdateAdminCategoryRequest = {
  categoryId: number;
  parentCategoryId?: number | null;
  name: string;
  description?: string | null;
  isActive: boolean;
  displayOrder: number;
  expectedVersion: number;
};

export type UpdateAdminCategoryResponse = {
  categoryId: number;
  parentCategoryId: number | null;
  name: string;
  nameNormalized: string;
  description: string | null;
  isActive: boolean;
  displayOrder: number;
  version: number;
  updatedAt: string;
};

export type SoftDeleteAdminCategoryRequest = {
  categoryId: number;
  expectedVersion: number;
};

export type SoftDeleteAdminCategoryResponse = {
  categoryId: number;
  isDeleted: boolean;
  isActive: boolean;
  version: number;
  updatedAt: string;
  deletedAt: string;
};

export type RestoreAdminCategoryRequest = {
  categoryId: number;
  expectedVersion: number;
};

export type RestoreAdminCategoryResponse = {
  categoryId: number;
  isDeleted: boolean;
  version: number;
  updatedAt: string;
};