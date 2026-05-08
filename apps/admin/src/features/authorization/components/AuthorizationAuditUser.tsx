import { Typography } from "antd";
import type { CSSProperties } from "react";
import type { AdminUserDetailResponse } from "../../identity/types/adminUser.types";

export type AuthorizationAuditUsersById = Map<number, AdminUserDetailResponse>;

type AuthorizationAuditUserProps = {
  userId: number | null;
  usersById: AuthorizationAuditUsersById;
  isFetchingUsers: boolean;
  fallbackLabel?: string;
  fallbackDescription?: string;
  maxWidth?: number;
};

const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
};

export function AuthorizationAuditUser({
  userId,
  usersById,
  isFetchingUsers,
  fallbackLabel = "N/A",
  fallbackDescription,
  maxWidth = 180,
}: AuthorizationAuditUserProps) {
  if (userId === null) {
    if (!fallbackDescription) {
      return fallbackLabel;
    }

    return (
      <div style={{ minWidth: 0, maxWidth }}>
        <Typography.Text strong style={wrappingTextStyle}>
          {fallbackLabel}
        </Typography.Text>
        <Typography.Text type="secondary" style={wrappingTextStyle}>
          {fallbackDescription}
        </Typography.Text>
      </div>
    );
  }

  const user = usersById.get(userId);

  if (!user) {
    return (
      <Typography.Text type="secondary" style={wrappingTextStyle}>
        {isFetchingUsers ? "Loading..." : `User #${userId}`}
      </Typography.Text>
    );
  }

  return (
    <div style={{ minWidth: 0, maxWidth }}>
      <Typography.Text strong style={wrappingTextStyle}>
        {user.fullName || user.email}
      </Typography.Text>
      <Typography.Text type="secondary" style={wrappingTextStyle}>
        {user.email}
      </Typography.Text>
    </div>
  );
}
