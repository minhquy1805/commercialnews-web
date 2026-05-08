import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminPermissionsApi } from "../api/adminPermissionsApi";
import type {
  AdminPermissionListItemResponse,
  AdminPermissionListResponse,
} from "../types/adminPermission.types";
import { ADMIN_PERMISSIONS_QUERY_KEY } from "./useAdminPermissions";

function findPermissionInCachedLists(
  permissionLists: Array<
    [readonly unknown[], AdminPermissionListResponse | undefined]
  >,
  permissionId: number,
) {
  for (const [, permissionList] of permissionLists) {
    const permission = permissionList?.items.find(
      (item) => item.permissionId === permissionId,
    );

    if (permission) {
      return permission;
    }
  }

  return null;
}

export function useAdminPermissionDetail(
  permissionId?: number | null,
  initialPermission?: AdminPermissionListItemResponse | null,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...ADMIN_PERMISSIONS_QUERY_KEY, "detail", permissionId],
    queryFn: async () => {
      const cachedPermission = findPermissionInCachedLists(
        queryClient.getQueriesData<AdminPermissionListResponse>({
          queryKey: ADMIN_PERMISSIONS_QUERY_KEY,
        }),
        permissionId!,
      );

      if (cachedPermission) {
        return cachedPermission;
      }

      const permissionList = await adminPermissionsApi.getPermissions({
        page: 1,
        pageSize: 100,
      });
      const permission = permissionList.items.find(
        (item) => item.permissionId === permissionId,
      );

      if (!permission) {
        throw new Error("Permission not found.");
      }

      return permission;
    },
    enabled: Boolean(permissionId),
    initialData:
      initialPermission && initialPermission.permissionId === permissionId
        ? initialPermission
        : undefined,
    retry: false,
  });
}
