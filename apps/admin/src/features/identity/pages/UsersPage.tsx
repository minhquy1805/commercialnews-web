import { UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Input,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { type CSSProperties, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminUserRolesList } from "../../authorization/hooks/useAdminUserRoles";
import type { AdminUserRoleItemResponse } from "../../authorization/types/adminUserRole.types";
import { useAdminUsers } from "../hooks/useAdminUsers";
import type { AdminUserListItemResponse } from "../types/adminUser.types";
import { USER_ACCOUNT_STATUSES } from "../../../shared/types/userAccountStatus";

type EmailVerifiedFilter = "all" | "verified" | "unverified";

const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function getStatusColor(status: string) {
  switch (status) {
    case USER_ACCOUNT_STATUSES.ACTIVE:
      return "success";
    case USER_ACCOUNT_STATUSES.UNVERIFIED:
      return "warning";
    case USER_ACCOUNT_STATUSES.LOCKED:
      return "error";
    case USER_ACCOUNT_STATUSES.DISABLED:
      return "default";
    default:
      return "default";
  }
}

function renderUserRoles(
  userId: number,
  rolesByUserId: Map<number, AdminUserRoleItemResponse[]>,
  isFetchingRoles: boolean,
  isRolesError: boolean,
) {
  const roles = rolesByUserId.get(userId);

  if (!roles) {
    return (
      <Typography.Text type="secondary" style={wrappingTextStyle}>
        {isFetchingRoles
          ? "Loading..."
          : isRolesError
            ? "Could not load roles."
            : "N/A"}
      </Typography.Text>
    );
  }

  if (roles.length === 0) {
    return (
      <Typography.Text type="secondary" style={wrappingTextStyle}>
        No roles
      </Typography.Text>
    );
  }

  return (
    <Space size={[4, 4]} wrap>
      {roles.slice(0, 3).map((role) => (
        <Tag
          key={role.roleId}
          color={role.isActive ? "processing" : "default"}
        >
          {role.displayName || role.name}
        </Tag>
      ))}
      {roles.length > 3 && <Tag>+{roles.length - 3}</Tag>}
    </Space>
  );
}

function getUserColumns(
  rolesByUserId: Map<number, AdminUserRoleItemResponse[]>,
  isFetchingRoles: boolean,
  isRolesError: boolean,
): TableProps<AdminUserListItemResponse>["columns"] {
  return [
    {
      title: "User",
      key: "user",
      fixed: "left",
      width: 300,
      render: (_, user) => (
        <Space align="start" size={12}>
          <Avatar
            src={user.avatarUrl ?? undefined}
            icon={!user.avatarUrl ? <UserOutlined /> : undefined}
            style={{ flexShrink: 0 }}
          />

          <div style={{ minWidth: 0, maxWidth: 220 }}>
            <Typography.Text strong style={wrappingTextStyle}>
              {user.fullName}
            </Typography.Text>
            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {user.email}
            </Typography.Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      width: 130,
      render: (isEmailVerified: boolean) =>
        isEmailVerified ? (
          <Tag color="success">Verified</Tag>
        ) : (
          <Tag color="warning">Unverified</Tag>
        ),
    },
    {
      title: "Roles",
      key: "roles",
      width: 260,
      render: (_, user) =>
        renderUserRoles(
          user.userId,
          rolesByUserId,
          isFetchingRoles,
          isRolesError,
        ),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Last login",
      dataIndex: "lastLoginAt",
      key: "lastLoginAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Locked until",
      dataIndex: "lockedUntil",
      key: "lockedUntil",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Public ID",
      dataIndex: "publicId",
      key: "publicId",
      width: 260,
      render: (publicId: string) => (
        <Typography.Text style={wrappingTextStyle}>{publicId}</Typography.Text>
      ),
    },
  ];
}

export function UsersPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [emailVerifiedFilter, setEmailVerifiedFilter] =
    useState<EmailVerifiedFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const usersQuery = useAdminUsers({
    query: submittedQuery || null,
    status,
    isEmailVerified:
      emailVerifiedFilter === "all"
        ? null
        : emailVerifiedFilter === "verified",
    page,
    pageSize,
  });
  const userRolesQuery = useAdminUserRolesList(
    usersQuery.data?.items.map((user) => user.userId) ?? [],
  );
  const userColumns = getUserColumns(
    userRolesQuery.rolesByUserId,
    userRolesQuery.isFetching,
    userRolesQuery.isError,
  );

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Users
      </Typography.Title>

      <Card style={{ marginTop: 24 }}>
        <Space size={12} wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Search users"
            value={query}
            onChange={(event) => {
              const nextQuery = event.target.value;
              setQuery(nextQuery);

              if (!nextQuery) {
                setSubmittedQuery("");
                setPage(1);
              }
            }}
            onSearch={(value) => {
              setSubmittedQuery(value.trim());
              setPage(1);
            }}
            style={{ width: 280 }}
          />

          <Select
            value={status}
            placeholder="Status"
            allowClear
            onChange={(value) => {
              setStatus(value ?? null);
              setPage(1);
            }}
            options={Object.values(USER_ACCOUNT_STATUSES).map((value) => ({
              label: value,
              value,
            }))}
            style={{ width: 180 }}
          />

          <Select<EmailVerifiedFilter>
            value={emailVerifiedFilter}
            onChange={(value) => {
              setEmailVerifiedFilter(value);
              setPage(1);
            }}
            options={[
              { label: "All emails", value: "all" },
              { label: "Verified", value: "verified" },
              { label: "Unverified", value: "unverified" },
            ]}
            style={{ width: 160 }}
          />
        </Space>

        <Table<AdminUserListItemResponse>
          bordered
          rowKey={(user) => String(user.userId)}
          columns={userColumns}
          dataSource={usersQuery.data?.items ?? []}
          loading={usersQuery.isFetching || userRolesQuery.isFetching}
          scroll={{ x: 1650 }}
          locale={{
            emptyText: usersQuery.isError
              ? "Could not load users."
              : "No users found.",
          }}
          pagination={{
            current: usersQuery.data?.page ?? page,
            pageSize: usersQuery.data?.pageSize ?? pageSize,
            total: usersQuery.data?.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} users`,
            onChange: (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
          }}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(user) => ({
            onClick: () => navigate(`${ROUTES.IDENTITY_USERS}/${user.userId}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </section>
  );
}
