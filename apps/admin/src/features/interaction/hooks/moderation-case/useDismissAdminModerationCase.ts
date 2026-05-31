import { useMutation } from '@tanstack/react-query';
import { adminModerationCasesApi } from '../../api/adminModerationCasesApi';
import type { DismissAdminModerationCaseRequest } from '../../types/adminModerationCase.types';
import { useInvalidateAdminCommentsQueries } from '../comment/useAdminComments';
import { useInvalidateAdminModerationCasesQueries } from './useAdminModerationCases';

export type DismissAdminModerationCaseMutationRequest =
  DismissAdminModerationCaseRequest & {
    casePublicId: string;
  };

export function useDismissAdminModerationCase() {
  const invalidateAdminCommentsQueries = useInvalidateAdminCommentsQueries();
  const invalidateAdminModerationCasesQueries =
    useInvalidateAdminModerationCasesQueries();

  return useMutation({
    mutationFn: (request: DismissAdminModerationCaseMutationRequest) => {
      const { casePublicId, ...body } = request;

      return adminModerationCasesApi.dismissModerationCase(casePublicId, body);
    },
    onSuccess: async () => {
      await Promise.all([
        invalidateAdminCommentsQueries(),
        invalidateAdminModerationCasesQueries(),
      ]);
    },
  });
}