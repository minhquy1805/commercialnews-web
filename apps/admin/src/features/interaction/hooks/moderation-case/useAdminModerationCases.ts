import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminModerationCasesApi } from '../../api/adminModerationCasesApi';
import type { AdminModerationCasesFilter } from '../../types/adminModerationCase.types';

export const ADMIN_MODERATION_CASES_QUERY_KEY = [
  'admin',
  'interaction',
  'comment-moderation-cases',
] as const;

export function useInvalidateAdminModerationCasesQueries() {
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.invalidateQueries({
      queryKey: ADMIN_MODERATION_CASES_QUERY_KEY,
    });
  };
}

export function useAdminModerationCases(request: AdminModerationCasesFilter) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_CASES_QUERY_KEY, request],
    queryFn: () => adminModerationCasesApi.getModerationCases(request),
    retry: false,
  });
}