export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  userId: number;
  publicId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAtUtc: string;
  refreshTokenExpiresAtUtc: string;
};