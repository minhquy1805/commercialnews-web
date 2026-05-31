import { httpClient } from '../../../shared/api/httpClient';
import type { AdminArticleInteractionStats } from '../types/adminArticleInteraction.types';

const BASE_URL = '/api/v1/admin/interaction/articles';

export const adminArticleInteractionStatsApi = {
  getArticleInteractionStats: async (
    articlePublicId: string,
  ): Promise<AdminArticleInteractionStats> => {
    const response = await httpClient.get<AdminArticleInteractionStats>(
      `${BASE_URL}/${articlePublicId}/stats`,
    );

    return response.data;
  },
};