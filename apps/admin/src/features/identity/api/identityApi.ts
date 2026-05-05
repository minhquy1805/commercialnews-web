import { httpClient } from "../../../shared/api/httpClient";
import type { LoginRequest, LoginResponse } from "../types/identity.types";

const IDENTITY_BASE_URL = "/api/v1/identity";

export const identityApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${IDENTITY_BASE_URL}/login`,
      request
    );

    return response.data;
  },
};