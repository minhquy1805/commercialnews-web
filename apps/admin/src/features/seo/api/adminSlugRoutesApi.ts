import { httpClient } from "../../../shared/api/httpClient";
import type {
  AdminSlugRouteByResource,
  AdminSlugRouteByResourceFilter,
  AdminSlugRouteDetail,
  AdminSlugRouteFilter,
  AdminSlugRoutePagedResult,
  CheckSlugAvailabilityRequest,
  CheckSlugAvailabilityResponse,
  GenerateSlugRequest,
  GenerateSlugResponse,
} from "../types/adminSlugRoute.types";

const BASE_URL = "/api/v1/admin/seo";

export const adminSlugRoutesApi = {
  getPaged: async (
    filter: AdminSlugRouteFilter
  ): Promise<AdminSlugRoutePagedResult> => {
    const response = await httpClient.get<AdminSlugRoutePagedResult>(
      `${BASE_URL}/slug-routes`,
      {
        params: filter,
      }
    );

    return response.data;
  },

  getById: async (slugId: number): Promise<AdminSlugRouteDetail> => {
    const response = await httpClient.get<AdminSlugRouteDetail>(
      `${BASE_URL}/slug-routes/${slugId}`
    );

    return response.data;
  },

  getByResource: async (
    filter: AdminSlugRouteByResourceFilter
  ): Promise<AdminSlugRouteByResource> => {
    const response = await httpClient.get<AdminSlugRouteByResource>(
      `${BASE_URL}/slug-routes/by-resource`,
      {
        params: filter,
      }
    );

    return response.data;
  },

  checkAvailability: async (
    request: CheckSlugAvailabilityRequest
  ): Promise<CheckSlugAvailabilityResponse> => {
    const response = await httpClient.get<CheckSlugAvailabilityResponse>(
      `${BASE_URL}/slug-availability`,
      {
        params: request,
      }
    );

    return response.data;
  },

  generateSlug: async (
    request: GenerateSlugRequest
  ): Promise<GenerateSlugResponse> => {
    const response = await httpClient.post<GenerateSlugResponse>(
      `${BASE_URL}/generate-slug`,
      request
    );

    return response.data;
  },
};