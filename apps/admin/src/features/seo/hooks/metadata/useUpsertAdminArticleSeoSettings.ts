import { useMutation } from '@tanstack/react-query';
import { adminSeoMetadataApi } from '../../api/adminSeoMetadataApi';
import type { UpsertAdminArticleSeoSettingsRequest } from '../../types/adminSeoMetadata.types';
import { useInvalidateAdminSlugRoutesQueries } from '../slug-route/useAdminSlugRoutes';
import { useInvalidateAdminSeoMetadataQueries } from './useAdminSeoMetadata';

type UpsertAdminArticleSeoSettingsMutationRequest = {
  articlePublicId: string;
  request: UpsertAdminArticleSeoSettingsRequest;
};

export function useUpsertAdminArticleSeoSettings() {
  const invalidateAdminSeoMetadataQueries =
    useInvalidateAdminSeoMetadataQueries();
  const invalidateAdminSlugRoutesQueries = useInvalidateAdminSlugRoutesQueries();

  return useMutation({
    mutationFn: ({
      articlePublicId,
      request,
    }: UpsertAdminArticleSeoSettingsMutationRequest) =>
      adminSeoMetadataApi.upsertArticleSettings(articlePublicId, request),
    onSuccess: async () => {
      await Promise.all([
        invalidateAdminSeoMetadataQueries(),
        invalidateAdminSlugRoutesQueries(),
      ]);
    },
  });
}
