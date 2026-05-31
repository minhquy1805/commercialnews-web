import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  DisconnectOutlined,
  LockOutlined,
  PlusOutlined,
  StopOutlined,
  UnlockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  App,
  Avatar,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Statistic,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import dayjs, { type Dayjs } from "dayjs";
import { type CSSProperties, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { createTablePagination } from "../../../shared/pagination";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { USER_ACCOUNT_STATUSES } from "../../../shared/types/userAccountStatus";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../../authorization/components/AuthorizationAuditUser";
import { useAdminRoles } from "../../authorization/hooks/useAdminRoles";
import {
  useAdminUserEffectivePermissions,
  useAdminUserRoles,
} from "../../authorization/hooks/useAdminUserRoles";
import { useAssignRoleToUser } from "../../authorization/hooks/useAssignRoleToUser";
import { useRevokeRoleFromUser } from "../../authorization/hooks/useRevokeRoleFromUser";
import type {
  AdminEffectivePermissionItemResponse,
  AdminUserRoleItemResponse,
} from "../../authorization/types/adminUserRole.types";
import { getNumericUserIds } from "../../authorization/utils/authorizationAudit";
import { useActivateAdminUser } from "../hooks/useActivateAdminUser";
import { useAdminUserDetail } from "../hooks/useAdminUserDetail";
import { useAdminUserDetails } from "../hooks/useAdminUserDetails";
import { useAdminUserLoginHistory } from "../hooks/useAdminUserLoginHistory";
import { useAdminUserSecuritySummary } from "../hooks/useAdminUserSecuritySummary";
import { useAdminUserSessions } from "../hooks/useAdminUserSessions";
import { useDisableAdminUser } from "../hooks/useDisableAdminUser";
import { useLockAdminUser } from "../hooks/useLockAdminUser";
import { useMarkAdminUserEmailVerified } from "../hooks/useMarkAdminUserEmailVerified";
import { useRevokeAdminUserSessions } from "../hooks/useRevokeAdminUserSessions";
import { useUnlockAdminUser } from "../hooks/useUnlockAdminUser";
import type {
  AdminUserDetailResponse,
  AdminUserLoginHistoryItemResponse,
  AdminUserSessionItemResponse,
} from "../types/adminUser.types";

type DisableUserFormValues = {
  reason?: string;
  revokeSessions: boolean;
};

type LockUserFormValues = {
  lockedUntilUtc: Dayjs;
  reason?: string;
  revokeSessions: boolean;
};

type AssignRoleFormValues = {
  roleId: number;
};

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

function getUserState(user: AdminUserDetailResponse) {
  return {
    isDisabled: user.status === USER_ACCOUNT_STATUSES.DISABLED,
    isLocked:
      user.status === USER_ACCOUNT_STATUSES.LOCKED || Boolean(user.lockedUntil),
  };
}

const sessionColumns: TableProps<AdminUserSessionItemResponse>["columns"] = [
  {
    title: "Status",
    key: "status",
    width: 130,
    render: (_, session) =>
      session.isActive ? (
        <Tag color="success">Active</Tag>
      ) : session.isRevoked ? (
        <Tag color="error">Revoked</Tag>
      ) : session.isExpired ? (
        <Tag color="default">Expired</Tag>
      ) : (
        <Tag>Inactive</Tag>
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
    title: "Expires at",
    dataIndex: "expiresAt",
    key: "expiresAt",
    width: 190,
    render: formatDateTime,
  },
  {
    title: "Revoked at",
    dataIndex: "revokedAt",
    key: "revokedAt",
    width: 190,
    render: formatDateTime,
  },
  {
    title: "IP",
    dataIndex: "createdIp",
    key: "createdIp",
    width: 150,
    render: (value: string | null) => value ?? "N/A",
  },
  {
    title: "User agent",
    dataIndex: "userAgent",
    key: "userAgent",
    render: (value: string | null) => (
      <Typography.Text style={wrappingTextStyle}>{value ?? "N/A"}</Typography.Text>
    ),
  },
];

const loginHistoryColumns: TableProps<AdminUserLoginHistoryItemResponse>["columns"] =
  [
    {
      title: "Status",
      dataIndex: "succeeded",
      key: "succeeded",
      width: 120,
      render: (succeeded: boolean) =>
        succeeded ? (
          <Tag color="success">Success</Tag>
        ) : (
          <Tag color="error">Failed</Tag>
        ),
    },
    {
      title: "Attempted at",
      dataIndex: "attemptedAt",
      key: "attemptedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "IP",
      dataIndex: "ipAddress",
      key: "ipAddress",
      width: 150,
      render: (value: string | null) => value ?? "N/A",
    },
    {
      title: "Failure reason",
      dataIndex: "failureReason",
      key: "failureReason",
      width: 180,
      render: (value: string | null) => value ?? "N/A",
    },
    {
      title: "User agent",
      dataIndex: "userAgent",
      key: "userAgent",
      render: (value: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {value ?? "N/A"}
        </Typography.Text>
      ),
    },
  ];

function getUserRoleColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
  onOpenRole: (roleId: number) => void,
  onRevokeRole: (roleId: number) => void,
  isRevokingRole: boolean,
): TableProps<AdminUserRoleItemResponse>["columns"] {
  return [
    {
      title: "Role",
      key: "role",
      width: 320,
      render: (_, role) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Button
            type="link"
            onClick={() => onOpenRole(role.roleId)}
            style={{
              height: "auto",
              padding: 0,
              textAlign: "left",
              whiteSpace: "normal",
            }}
          >
            <Typography.Text strong style={wrappingTextStyle}>
              {role.displayName}
            </Typography.Text>
          </Button>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {role.name}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
      render: (description: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {description || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
    {
      title: "System",
      dataIndex: "isSystem",
      key: "isSystem",
      width: 120,
      render: (isSystem: boolean) =>
        isSystem ? (
          <Tag color="processing">System</Tag>
        ) : (
          <Tag color="default">Custom</Tag>
        ),
    },
    {
      title: "Assigned at",
      dataIndex: "assignedAt",
      key: "assignedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Assigned by",
      dataIndex: "assignedByUserId",
      key: "assignedByUserId",
      width: 220,
      render: (userId: number | null) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel="System"
          fallbackDescription="Data initializer"
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_, role) => (
        <Popconfirm
          title="Revoke role?"
          description={`Revoke ${role.displayName} from this user?`}
          okText="Revoke"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
          onConfirm={() => onRevokeRole(role.roleId)}
        >
          <Button danger loading={isRevokingRole}>
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];
}

function getEffectivePermissionColumns(
  onOpenPermission: (permissionId: number) => void,
): TableProps<AdminEffectivePermissionItemResponse>["columns"] {
  return [
    {
      title: "Permission",
      key: "permission",
      width: 320,
      render: (_, permission) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Button
            type="link"
            onClick={() => onOpenPermission(permission.permissionId)}
            style={{
              height: "auto",
              padding: 0,
              textAlign: "left",
              whiteSpace: "normal",
            }}
          >
            <Typography.Text strong style={wrappingTextStyle}>
              {permission.key}
            </Typography.Text>
          </Button>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {permission.keyNormalized}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Module",
      dataIndex: "module",
      key: "module",
      width: 150,
      render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 140,
      render: (action: string) => <Tag color="geekblue">{action}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 320,
      render: (description: string | null) => (
        <Typography.Text style={wrappingTextStyle}>
          {description || "N/A"}
        </Typography.Text>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag color="success">Active</Tag>
        ) : (
          <Tag color="default">Inactive</Tag>
        ),
    },
    {
      title: "System",
      dataIndex: "isSystem",
      key: "isSystem",
      width: 120,
      render: (isSystem: boolean) =>
        isSystem ? (
          <Tag color="processing">System</Tag>
        ) : (
          <Tag color="default">Custom</Tag>
        ),
    },
  ];
}

export function UserDetailPage() {
  const { userId } = useParams();
  const parsedUserId = Number(userId);
  const selectedUserId = Number.isSafeInteger(parsedUserId)
    ? parsedUserId
    : null;
  const [disableForm] = Form.useForm<DisableUserFormValues>();
  const [lockForm] = Form.useForm<LockUserFormValues>();
  const [assignRoleForm] = Form.useForm<AssignRoleFormValues>();
  const [isDisableModalOpen, setIsDisableModalOpen] = useState(false);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const [isAssignRoleModalOpen, setIsAssignRoleModalOpen] = useState(false);
  const [loginHistoryPage, setLoginHistoryPage] = useState(1);
  const [loginHistoryPageSize, setLoginHistoryPageSize] = useState(10);
  const navigate = useNavigate();
  const { notification } = App.useApp();

  const userDetailQuery = useAdminUserDetail(selectedUserId);
  const securitySummaryQuery = useAdminUserSecuritySummary(selectedUserId);
  const sessionsQuery = useAdminUserSessions(selectedUserId);
  const userRolesQuery = useAdminUserRoles(selectedUserId);
  const userEffectivePermissionsQuery =
    useAdminUserEffectivePermissions(selectedUserId);
  const assignableRolesQuery = useAdminRoles({
    page: 1,
    pageSize: 100,
    isActive: true,
  });
  const loginHistoryQuery = useAdminUserLoginHistory({
    userId: selectedUserId ?? 0,
    page: loginHistoryPage,
    pageSize: loginHistoryPageSize,
  });
  const activateUserMutation = useActivateAdminUser();
  const disableUserMutation = useDisableAdminUser();
  const lockUserMutation = useLockAdminUser();
  const unlockUserMutation = useUnlockAdminUser();
  const markEmailVerifiedMutation = useMarkAdminUserEmailVerified();
  const revokeSessionsMutation = useRevokeAdminUserSessions();
  const assignRoleMutation = useAssignRoleToUser();
  const revokeRoleMutation = useRevokeRoleFromUser();
  const user = userDetailQuery.data;
  const roleAssignmentAuditUsersQuery = useAdminUserDetails(
    getNumericUserIds(
      userRolesQuery.data?.roles.map((role) => role.assignedByUserId) ?? [],
    ),
  );
  const userState = user ? getUserState(user) : null;
  const isActionPending =
    activateUserMutation.isPending ||
    disableUserMutation.isPending ||
    lockUserMutation.isPending ||
    unlockUserMutation.isPending ||
    markEmailVerifiedMutation.isPending ||
    revokeSessionsMutation.isPending;
  const assignedRoleIds = new Set(
    userRolesQuery.data?.roles.map((role) => role.roleId) ?? [],
  );
  const assignableRoleOptions =
    assignableRolesQuery.data?.items
      .filter((role) => !assignedRoleIds.has(role.roleId))
      .map((role) => ({
        label: `${role.displayName} (${role.name})`,
        value: role.roleId,
      })) ?? [];
  const userRoleColumns = getUserRoleColumns(
    roleAssignmentAuditUsersQuery.usersById,
    roleAssignmentAuditUsersQuery.isFetching,
    (roleId) => navigate(`${ROUTES.AUTHORIZATION_ROLES}/${roleId}`),
    handleRevokeRole,
    revokeRoleMutation.isPending,
  );
  const effectivePermissionColumns = getEffectivePermissionColumns(
    (permissionId) =>
      navigate(`${ROUTES.AUTHORIZATION_PERMISSIONS}/${permissionId}`),
  );

  async function runUserAction(
    action: () => Promise<unknown>,
    successMessage: string,
    errorMessage: string,
  ): Promise<boolean> {
    try {
      await action();

      notification.success({
        title: successMessage,
        placement: "topRight",
      });

      return true;
    } catch (error) {
      notification.error({
        title: errorMessage,
        description: getApiErrorDescription(error),
        placement: "topRight",
      });

      return false;
    }
  }

  function openDisableModal() {
    disableForm.setFieldsValue({
      reason: "",
      revokeSessions: true,
    });
    setIsDisableModalOpen(true);
  }

  function closeDisableModal() {
    setIsDisableModalOpen(false);
    disableForm.resetFields();
  }

  async function handleDisableUser() {
    if (!selectedUserId) {
      return;
    }

    const values = await disableForm.validateFields();
    const completed = await runUserAction(
      () =>
        disableUserMutation.mutateAsync({
          userId: selectedUserId,
          reason: values.reason?.trim() || null,
          revokeSessions: values.revokeSessions,
        }),
      "User disabled",
      "Could not disable user.",
    );

    if (completed) {
      closeDisableModal();
    }
  }

  function openLockModal() {
    lockForm.setFieldsValue({
      lockedUntilUtc: dayjs().add(1, "hour"),
      reason: "",
      revokeSessions: true,
    });
    setIsLockModalOpen(true);
  }

  function closeLockModal() {
    setIsLockModalOpen(false);
    lockForm.resetFields();
  }

  function openAssignRoleModal() {
    assignRoleForm.resetFields();
    setIsAssignRoleModalOpen(true);
  }

  function closeAssignRoleModal() {
    setIsAssignRoleModalOpen(false);
    assignRoleForm.resetFields();
  }

  async function handleLockUser() {
    if (!selectedUserId) {
      return;
    }

    const values = await lockForm.validateFields();
    const completed = await runUserAction(
      () =>
        lockUserMutation.mutateAsync({
          userId: selectedUserId,
          lockedUntilUtc: values.lockedUntilUtc.toISOString(),
          reason: values.reason?.trim() || null,
          revokeSessions: values.revokeSessions,
        }),
      "User locked",
      "Could not lock user.",
    );

    if (completed) {
      closeLockModal();
    }
  }

  async function handleAssignRole() {
    if (!selectedUserId) {
      return;
    }

    const values = await assignRoleForm.validateFields();
    const completed = await runUserAction(
      () =>
        assignRoleMutation.mutateAsync({
          userId: selectedUserId,
          roleId: values.roleId,
        }),
      "Role assigned",
      "Could not assign role.",
    );

    if (completed) {
      closeAssignRoleModal();
    }
  }

  async function handleRevokeRole(roleId: number) {
    if (!selectedUserId) {
      return;
    }

    await runUserAction(
      () =>
        revokeRoleMutation.mutateAsync({
          userId: selectedUserId,
          roleId,
        }),
      "Role revoked",
      "Could not revoke role.",
    );
  }

  if (!selectedUserId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid user id.</Typography.Text>
      </Card>
    );
  }

  if (userDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active avatar paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <Typography.Text type="secondary">
          User information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.IDENTITY_USERS)}
      >
        Back to users
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <Avatar
            size={72}
            src={user.avatarUrl ?? undefined}
            icon={!user.avatarUrl ? <UserOutlined /> : undefined}
          />

          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {user.fullName}
            </Typography.Title>

            <Typography.Text style={wrappingTextStyle}>
              {user.email}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              <Tag color={getStatusColor(user.status)}>{user.status}</Tag>
              {user.isEmailVerified ? (
                <Tag color="success">Email verified</Tag>
              ) : (
                <Tag color="warning">Email unverified</Tag>
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="User ID">{user.userId}</Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {user.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email normalized">
            <Typography.Text style={wrappingTextStyle}>
              {user.emailNormalized}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Email verified at">
            {formatDateTime(user.emailVerifiedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Locked until">
            {formatDateTime(user.lockedUntil)}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(user.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(user.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Last login">
            {formatDateTime(user.lastLoginAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{user.version}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Security summary" style={{ marginTop: 16 }}>
        {securitySummaryQuery.isLoading ? (
          <Skeleton active paragraph={{ rows: 2 }} />
        ) : securitySummaryQuery.data ? (
          <Space size={16} wrap>
            <Statistic
              title="Total sessions"
              value={securitySummaryQuery.data.totalSessionCount}
            />
            <Statistic
              title="Active sessions"
              value={securitySummaryQuery.data.activeSessionCount}
            />
            <Statistic
              title="Revoked sessions"
              value={securitySummaryQuery.data.revokedSessionCount}
            />
            <Statistic
              title="Expired sessions"
              value={securitySummaryQuery.data.expiredSessionCount}
            />
            <Statistic
              title="Login success"
              value={securitySummaryQuery.data.loginSuccessCount}
            />
            <Statistic
              title="Login failure"
              value={securitySummaryQuery.data.loginFailureCount}
            />
            <Statistic
              title="Failed last 7 days"
              value={securitySummaryQuery.data.failedLoginCountLast7Days}
            />
            <Statistic
              title="Active reset tokens"
              value={securitySummaryQuery.data.activePasswordResetTokenCount}
            />
          </Space>
        ) : (
          <Typography.Text type="secondary">
            Security summary is not available.
          </Typography.Text>
        )}
      </Card>

      <Card
        title="Roles"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openAssignRoleModal}
          >
            Assign role
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Table<AdminUserRoleItemResponse>
          bordered
          size="small"
          rowKey={(role) => String(role.roleId)}
          columns={userRoleColumns}
          dataSource={userRolesQuery.data?.roles ?? []}
          loading={
            userRolesQuery.isFetching ||
            roleAssignmentAuditUsersQuery.isFetching ||
            revokeRoleMutation.isPending
          }
          scroll={{ x: 1390 }}
          pagination={false}
          locale={{
            emptyText: userRolesQuery.isError
              ? "Could not load user roles."
              : "No roles assigned.",
          }}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Card title="Effective permissions" style={{ marginTop: 16 }}>
        <Table<AdminEffectivePermissionItemResponse>
          bordered
          size="small"
          rowKey={(permission) => String(permission.permissionId)}
          columns={effectivePermissionColumns}
          dataSource={userEffectivePermissionsQuery.data?.permissions ?? []}
          loading={userEffectivePermissionsQuery.isFetching}
          scroll={{ x: 1170 }}
          pagination={false}
          locale={{
            emptyText: userEffectivePermissionsQuery.isError
              ? "Could not load effective permissions."
              : "No effective permissions found.",
          }}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Card title="Sessions" style={{ marginTop: 16 }}>
        <Table<AdminUserSessionItemResponse>
          bordered
          size="small"
          rowKey={(session) => String(session.refreshTokenId)}
          columns={sessionColumns}
          dataSource={sessionsQuery.data?.items ?? []}
          loading={sessionsQuery.isFetching}
          scroll={{ x: 1100 }}
          pagination={false}
          locale={{
            emptyText: sessionsQuery.isError
              ? "Could not load sessions."
              : "No sessions found.",
          }}
        />
      </Card>

      <Card title="Login history" style={{ marginTop: 16 }}>
        <Table<AdminUserLoginHistoryItemResponse>
          bordered
          size="small"
          rowKey={(item) => String(item.loginId)}
          columns={loginHistoryColumns}
          dataSource={loginHistoryQuery.data?.items ?? []}
          loading={loginHistoryQuery.isFetching}
          scroll={{ x: 1100 }}
          locale={{
            emptyText: loginHistoryQuery.isError
              ? "Could not load login history."
              : "No login history found.",
          }}
          pagination={createTablePagination(
            loginHistoryQuery.data,
            { page: loginHistoryPage, pageSize: loginHistoryPageSize },
            (nextPage, nextPageSize) => {
              setLoginHistoryPage(nextPage);
              setLoginHistoryPageSize(nextPageSize);
            },
          )}
        />
      </Card>

      <Card title="Admin actions" style={{ marginTop: 16 }}>
        <Space size={8} wrap>
          {userState?.isDisabled ? (
            <Popconfirm
              title="Activate user?"
              description={`Activate ${user.email}?`}
              okText="Activate"
              cancelText="Cancel"
              onConfirm={() =>
                runUserAction(
                  () =>
                    activateUserMutation.mutateAsync({
                      userId: user.userId,
                    }),
                  "User activated",
                  "Could not activate user.",
                )
              }
            >
              <Button
                icon={<CheckCircleOutlined />}
                loading={activateUserMutation.isPending}
                disabled={isActionPending}
              >
                Activate
              </Button>
            </Popconfirm>
          ) : (
            <Button
              danger
              icon={<StopOutlined />}
              disabled={isActionPending}
              onClick={openDisableModal}
            >
              Disable
            </Button>
          )}

          {userState?.isLocked ? (
            <Popconfirm
              title="Unlock user?"
              description={`Unlock ${user.email}?`}
              okText="Unlock"
              cancelText="Cancel"
              onConfirm={() =>
                runUserAction(
                  () =>
                    unlockUserMutation.mutateAsync({
                      userId: user.userId,
                    }),
                  "User unlocked",
                  "Could not unlock user.",
                )
              }
            >
              <Button
                icon={<UnlockOutlined />}
                loading={unlockUserMutation.isPending}
                disabled={isActionPending}
              >
                Unlock
              </Button>
            </Popconfirm>
          ) : (
            <Button
              icon={<LockOutlined />}
              disabled={isActionPending}
              onClick={openLockModal}
            >
              Lock
            </Button>
          )}

          {!user.isEmailVerified && (
            <Popconfirm
              title="Mark email verified?"
              description={`Mark ${user.email} as verified?`}
              okText="Verify"
              cancelText="Cancel"
              onConfirm={() =>
                runUserAction(
                  () =>
                    markEmailVerifiedMutation.mutateAsync({
                      userId: user.userId,
                    }),
                  "Email marked verified",
                  "Could not mark email verified.",
                )
              }
            >
              <Button
                icon={<CheckCircleOutlined />}
                loading={markEmailVerifiedMutation.isPending}
                disabled={isActionPending}
              >
                Mark email verified
              </Button>
            </Popconfirm>
          )}

          <Popconfirm
            title="Revoke all sessions?"
            description={`Revoke active sessions for ${user.email}?`}
            okText="Revoke"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
            onConfirm={() =>
              runUserAction(
                () =>
                  revokeSessionsMutation.mutateAsync({
                    userId: user.userId,
                  }),
                "User sessions revoked",
                "Could not revoke user sessions.",
              )
            }
          >
            <Button
              danger
              icon={<DisconnectOutlined />}
              loading={revokeSessionsMutation.isPending}
              disabled={isActionPending}
            >
              Revoke sessions
            </Button>
          </Popconfirm>
        </Space>
      </Card>

      <Modal
        title="Disable user"
        open={isDisableModalOpen}
        okText="Disable user"
        okButtonProps={{
          danger: true,
          loading: disableUserMutation.isPending,
        }}
        forceRender
        onOk={handleDisableUser}
        onCancel={closeDisableModal}
      >
        <Typography.Paragraph type="secondary">
          This will disable {user.email}.
        </Typography.Paragraph>

        <Form
          form={disableForm}
          layout="vertical"
          initialValues={{ revokeSessions: true }}
        >
          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                max: 500,
                message: "Reason must not exceed 500 characters.",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              maxLength={500}
              showCount
              placeholder="Optional reason"
            />
          </Form.Item>

          <Form.Item name="revokeSessions" valuePropName="checked">
            <Checkbox>Revoke active sessions</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Lock user"
        open={isLockModalOpen}
        okText="Lock user"
        okButtonProps={{
          danger: true,
          loading: lockUserMutation.isPending,
        }}
        forceRender
        onOk={handleLockUser}
        onCancel={closeLockModal}
      >
        <Typography.Paragraph type="secondary">
          This will lock {user.email}.
        </Typography.Paragraph>

        <Form
          form={lockForm}
          layout="vertical"
          initialValues={{
            lockedUntilUtc: dayjs().add(1, "hour"),
            revokeSessions: true,
          }}
        >
          <Form.Item
            label="Locked until"
            name="lockedUntilUtc"
            rules={[
              {
                required: true,
                message: "Locked until is required.",
              },
            ]}
          >
            <DatePicker
              showTime
              style={{ width: "100%" }}
              disabledDate={(current) =>
                Boolean(current?.isBefore(dayjs().startOf("day")))
              }
            />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[
              {
                max: 500,
                message: "Reason must not exceed 500 characters.",
              },
            ]}
          >
            <Input.TextArea
              rows={3}
              maxLength={500}
              showCount
              placeholder="Optional reason"
            />
          </Form.Item>

          <Form.Item name="revokeSessions" valuePropName="checked">
            <Checkbox>Revoke active sessions</Checkbox>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assign role"
        open={isAssignRoleModalOpen}
        okText="Assign"
        confirmLoading={assignRoleMutation.isPending}
        onOk={handleAssignRole}
        onCancel={closeAssignRoleModal}
        forceRender
        destroyOnHidden
      >
        <Form form={assignRoleForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Role is required." }]}
          >
            <Select
              showSearch
              loading={assignableRolesQuery.isFetching}
              notFoundContent={
                assignableRolesQuery.isFetching
                  ? "Loading roles..."
                  : assignableRolesQuery.isError
                    ? "Could not load roles."
                    : "No unassigned active roles."
              }
              options={assignableRoleOptions}
              optionFilterProp="label"
              placeholder="Select role"
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
