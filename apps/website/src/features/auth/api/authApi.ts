import { httpClient } from "@/shared/api/httpClient";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  CurrentUserResponse,
  GetMyLoginHistoryRequest,
  GetMyLoginHistoryResponse,
  LoginRequest,
  LoginResponse,
  LogoutAllSessionsResponse,
  LogoutResponse,
  RegisterRequest,
  RegisterResponse,
  ResendVerificationEmailRequest,
  ResendVerificationEmailResponse,
  UpdateMyAvatarResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "../types/auth.types";

const AUTH_BASE_PATH = "/api/v1/auth";

export const authApi = {
  login(request: LoginRequest): Promise<LoginResponse> {
    return httpClient
      .post<LoginResponse>(`${AUTH_BASE_PATH}/login`, request)
      .then((response) => response.data);
  },

  register(request: RegisterRequest): Promise<RegisterResponse> {
    return httpClient
      .post<RegisterResponse>(`${AUTH_BASE_PATH}/register`, request)
      .then((response) => response.data);
  },

  verifyEmail(request: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    return httpClient
      .post<VerifyEmailResponse>(`${AUTH_BASE_PATH}/verify-email`, request)
      .then((response) => response.data);
  },

  resendVerificationEmail(
    request: ResendVerificationEmailRequest,
  ): Promise<ResendVerificationEmailResponse> {
    return httpClient
      .post<ResendVerificationEmailResponse>(
        `${AUTH_BASE_PATH}/resend-verification`,
        request,
      )
      .then((response) => response.data);
  },

  me(): Promise<CurrentUserResponse> {
    return httpClient
      .get<CurrentUserResponse>(`${AUTH_BASE_PATH}/me`)
      .then((response) => response.data);
  },

  updateMyProfile(
    request: UpdateMyProfileRequest,
  ): Promise<UpdateMyProfileResponse> {
    return httpClient
      .put<UpdateMyProfileResponse>(`${AUTH_BASE_PATH}/me`, request)
      .then((response) => response.data);
  },

  updateMyAvatar(file: File): Promise<UpdateMyAvatarResponse> {
    const formData = new FormData();
    formData.append("file", file);

    return httpClient
      .put<UpdateMyAvatarResponse>(`${AUTH_BASE_PATH}/me/avatar`, formData)
      .then((response) => response.data);
  },

  changePassword(
    request: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    return httpClient
      .post<ChangePasswordResponse>(
        `${AUTH_BASE_PATH}/change-password`,
        request,
      )
      .then((response) => response.data);
  },

  getMyLoginHistory(
    request: GetMyLoginHistoryRequest = {},
  ): Promise<GetMyLoginHistoryResponse> {
    return httpClient
      .get<GetMyLoginHistoryResponse>(`${AUTH_BASE_PATH}/me/login-history`, {
        params: request,
      })
      .then((response) => response.data);
  },

  logout(): Promise<LogoutResponse> {
    return httpClient
      .post<LogoutResponse>(`${AUTH_BASE_PATH}/logout`)
      .then((response) => response.data);
  },

  logoutAllSessions(): Promise<LogoutAllSessionsResponse> {
    return httpClient
      .post<LogoutAllSessionsResponse>(
        `${AUTH_BASE_PATH}/logout-all-sessions`,
      )
      .then((response) => response.data);
  },

  forgotPassword(
    request: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return httpClient
      .post<ForgotPasswordResponse>(
        `${AUTH_BASE_PATH}/forgot-password`,
        request,
      )
      .then((response) => response.data);
  },

  resetPassword(
    request: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    return httpClient
      .post<ResetPasswordResponse>(
        `${AUTH_BASE_PATH}/reset-password`,
        request,
      )
      .then((response) => response.data);
  },
};