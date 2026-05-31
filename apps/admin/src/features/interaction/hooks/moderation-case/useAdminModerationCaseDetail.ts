import { useQuery } from '@tanstack/react-query';
import { adminModerationCasesApi } from '../../api/adminModerationCasesApi';
import { ADMIN_MODERATION_CASES_QUERY_KEY } from './useAdminModerationCases';

export function useAdminModerationCaseDetail(casePublicId?: string) {
  return useQuery({
    queryKey: [...ADMIN_MODERATION_CASES_QUERY_KEY, 'detail', casePublicId],
    queryFn: () =>
      adminModerationCasesApi.getModerationCaseByPublicId(casePublicId!),
    enabled: Boolean(casePublicId),
    retry: false,
  });
}