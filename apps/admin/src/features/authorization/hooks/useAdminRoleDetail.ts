import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminRolesApi } from "../api/adminRolesApi";
import type {
  AdminRoleListItemResponse,
  AdminRoleListResponse,
} from "../types/adminRole.types";
import { ADMIN_ROLES_QUERY_KEY } from "./useAdminRoles";

function findRoleInCachedLists(
  roleLists: Array<[readonly unknown[], AdminRoleListResponse | undefined]>,
  roleId: number,
) {
  for (const [, roleList] of roleLists) {
    const role = roleList?.items.find((item) => item.roleId === roleId);

    if (role) {
      return role;
    }
  }

  return null;
}

export function useAdminRoleDetail(
  roleId?: number | null,
  initialRole?: AdminRoleListItemResponse | null,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: [...ADMIN_ROLES_QUERY_KEY, "detail", roleId],
    queryFn: async () => {
      const cachedRole = findRoleInCachedLists(
        queryClient.getQueriesData<AdminRoleListResponse>({
          queryKey: ADMIN_ROLES_QUERY_KEY,
        }),
        roleId!,
      );

      if (cachedRole) {
        return cachedRole;
      }

      const roleList = await adminRolesApi.getRoles({
        page: 1,
        pageSize: 100,
      });
      const role = roleList.items.find((item) => item.roleId === roleId);

      if (!role) {
        throw new Error("Role not found.");
      }

      return role;
    },
    enabled: Boolean(roleId),
    initialData:
      initialRole && initialRole.roleId === roleId ? initialRole : undefined,
    retry: false,
  });
}
