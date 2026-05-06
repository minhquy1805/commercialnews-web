import { httpClient } from "../../../shared/api/httpClient";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  LoginRequest,
  LoginResponse,
  LogoutAllSessionsResponse,
  LogoutRequest,
  LogoutResponse,
  MyProfileResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
} from "../types/identity.types";

const IDENTITY_BASE_URL = "/api/v1/identity";

export const identityApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${IDENTITY_BASE_URL}/login`,
      request,
    );

    return response.data;
  },

  async getMyProfile(): Promise<MyProfileResponse> {
    const response = await httpClient.get<MyProfileResponse>(
      `${IDENTITY_BASE_URL}/me`,
    );

    return response.data;
  },

  async updateMyProfile(
    request: UpdateMyProfileRequest,
  ): Promise<UpdateMyProfileResponse> {
    const response = await httpClient.put<UpdateMyProfileResponse>(
      `${IDENTITY_BASE_URL}/me`,
      request,
    );

    return response.data;
  },

  async changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const response = await httpClient.post<ChangePasswordResponse>(
      `${IDENTITY_BASE_URL}/change-password`,
      request,
    );

    return response.data;
  },

  async refreshToken(
    request: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    const response = await httpClient.post<RefreshTokenResponse>(
      `${IDENTITY_BASE_URL}/refresh-token`,
      request,
    );

    return response.data;
  },

  async logout(request: LogoutRequest): Promise<LogoutResponse> {
    const response = await httpClient.post<LogoutResponse>(
      `${IDENTITY_BASE_URL}/logout`,
      request,
    );

    return response.data;
  },

  async logoutAllSessions(): Promise<LogoutAllSessionsResponse> {
    const response = await httpClient.post<LogoutAllSessionsResponse>(
      `${IDENTITY_BASE_URL}/logout-all-sessions`,
    );

    return response.data;
  },
};

