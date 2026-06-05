import { httpClient } from "../../../shared/api/httpClient";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  GetMyLoginHistoryRequest,
  GetMyLoginHistoryResponse,
  LoginRequest,
  LoginResponse,
  LogoutAllSessionsResponse,
  LogoutResponse,
  MyProfileResponse,
  UpdateMyAvatarRequest,
  UpdateMyAvatarResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
} from "../types/auth.types";

const AUTH_BASE_URL = "/api/v1/auth";

export const authApi = {
  async login(request: LoginRequest): Promise<LoginResponse> {
    const response = await httpClient.post<LoginResponse>(
      `${AUTH_BASE_URL}/login`,
      request,
    );

    return response.data;
  },

  async getMyProfile(): Promise<MyProfileResponse> {
    const response = await httpClient.get<MyProfileResponse>(
      `${AUTH_BASE_URL}/me`,
    );

    return response.data;
  },

  async updateMyProfile(
    request: UpdateMyProfileRequest,
  ): Promise<UpdateMyProfileResponse> {
    const response = await httpClient.put<UpdateMyProfileResponse>(
      `${AUTH_BASE_URL}/me`,
      request,
    );

    return response.data;
  },

  async updateMyAvatar(
    request: UpdateMyAvatarRequest,
  ): Promise<UpdateMyAvatarResponse> {
    const formData = new FormData();

    formData.append("file", request.file);

    const response = await httpClient.put<UpdateMyAvatarResponse>(
      `${AUTH_BASE_URL}/me/avatar`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data;
  },

  async changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const response = await httpClient.post<ChangePasswordResponse>(
      `${AUTH_BASE_URL}/change-password`,
      request,
    );

    return response.data;
  },

  async getMyLoginHistory(
    request: GetMyLoginHistoryRequest = {},
  ): Promise<GetMyLoginHistoryResponse> {
    const response = await httpClient.get<GetMyLoginHistoryResponse>(
      `${AUTH_BASE_URL}/me/login-history`,
      {
        params: request,
      },
    );

    return response.data;
  },

  async logout(): Promise<LogoutResponse> {
    const response = await httpClient.post<LogoutResponse>(
      `${AUTH_BASE_URL}/logout`,
    );

    return response.data;
  },

  async logoutAllSessions(): Promise<LogoutAllSessionsResponse> {
    const response = await httpClient.post<LogoutAllSessionsResponse>(
      `${AUTH_BASE_URL}/logout-all-sessions`,
    );

    return response.data;
  },
};
