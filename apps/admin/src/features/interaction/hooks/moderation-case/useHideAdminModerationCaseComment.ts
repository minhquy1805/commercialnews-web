import { useMutation } from '@tanstack/react-query';
import { adminModerationCasesApi } from '../../api/adminModerationCasesApi';
import type { HideAdminModerationCaseCommentRequest } from '../../types/adminModerationCase.types';
import { useInvalidateAdminCommentsQueries } from '../comment/useAdminComments';
import { useInvalidateAdminModerationCasesQueries } from './useAdminModerationCases';

export type HideAdminModerationCaseCommentMutationRequest =
  HideAdminModerationCaseCommentRequest & {
    casePublicId: string;
  };

export function useHideAdminModerationCaseComment() {
  const invalidateAdminCommentsQueries = useInvalidateAdminCommentsQueries();
  const invalidateAdminModerationCasesQueries =
    useInvalidateAdminModerationCasesQueries();

  return useMutation({
    mutationFn: (request: HideAdminModerationCaseCommentMutationRequest) => {
      const { casePublicId, ...body } = request;

      return adminModerationCasesApi.hideModerationCaseComment(
        casePublicId,
        body,
      );
    },
    onSuccess: async () => {
      await Promise.all([
        invalidateAdminCommentsQueries(),
        invalidateAdminModerationCasesQueries(),
      ]);
    },
  });
}