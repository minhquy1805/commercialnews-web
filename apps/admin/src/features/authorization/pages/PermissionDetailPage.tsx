import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  EditOutlined,
  PlusOutlined,
  StopOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { type CSSProperties, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../components/AuthorizationAuditUser";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import { useActivateAdminPermission } from "../hooks/useActivateAdminPermission";
import { useAdminPermissionDetail } from "../hooks/useAdminPermissionDetail";
import { useAdminPermissionRoles } from "../hooks/useAdminRolePermissions";
import { useAdminRoles } from "../hooks/useAdminRoles";
import { useDeactivateAdminPermission } from "../hooks/useDeactivateAdminPermission";
import { useGrantPermissionToRole } from "../hooks/useGrantPermissionToRole";
import { useRevokePermissionFromRole } from "../hooks/useRevokePermissionFromRole";
import { useUpdateAdminPermission } from "../hooks/useUpdateAdminPermission";
import type { AdminPermissionListItemResponse } from "../types/adminPermission.types";
import type { AdminPermissionRoleItemResponse } from "../types/adminRolePermission.types";
import {
  getAuthorizationAuditUserIds,
  getNumericUserIds,
} from "../utils/authorizationAudit";

type PermissionDetailRouteState = {
  permission?: AdminPermissionListItemResponse;
};

type EditPermissionFormValues = {
  key: string;
  module: string;
  action: string;
  description?: string;
};

type GrantRoleFormValues = {
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

function getInitialPermissionFromRouteState(
  state: unknown,
  permissionId: number | null,
) {
  const permission = (state as PermissionDetailRouteState | null)?.permission;

  if (!permissionId || permission?.permissionId !== permissionId) {
    return null;
  }

  return permission;
}

function getPermissionRoleColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
  onOpenRole: (roleId: number) => void,
  onRevokeRole: (roleId: number) => void,
  isRevokingRole: boolean,
): TableProps<AdminPermissionRoleItemResponse>["columns"] {
  return [
    {
      title: "Role",
      key: "role",
      fixed: "left",
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
      title: "Granted at",
      dataIndex: "grantedAt",
      key: "grantedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Granted by",
      dataIndex: "grantedByUserId",
      key: "grantedByUserId",
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
      fixed: "right",
      width: 120,
      render: (_, role) => (
        <Popconfirm
          title="Revoke from role?"
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

export function PermissionDetailPage() {
  const { permissionId } = useParams();
  const parsedPermissionId = Number(permissionId);
  const selectedPermissionId = Number.isSafeInteger(parsedPermissionId)
    ? parsedPermissionId
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditPermissionFormValues>();
  const [grantRoleForm] = Form.useForm<GrantRoleFormValues>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGrantRoleModalOpen, setIsGrantRoleModalOpen] = useState(false);

  const permissionDetailQuery = useAdminPermissionDetail(
    selectedPermissionId,
    getInitialPermissionFromRouteState(location.state, selectedPermissionId),
  );
  const permission = permissionDetailQuery.data;
  const permissionRolesQuery = useAdminPermissionRoles(selectedPermissionId);
  const grantableRolesQuery = useAdminRoles({
    page: 1,
    pageSize: 100,
    isActive: true,
  });
  const auditUsersQuery = useAdminUserDetails(
    [
      ...(permission ? getAuthorizationAuditUserIds([permission]) : []),
      ...getNumericUserIds(
        permissionRolesQuery.data?.roles.map((role) => role.grantedByUserId) ??
          [],
      ),
    ],
  );
  const updatePermissionMutation = useUpdateAdminPermission();
  const activatePermissionMutation = useActivateAdminPermission();
  const deactivatePermissionMutation = useDeactivateAdminPermission();
  const grantPermissionMutation = useGrantPermissionToRole();
  const revokePermissionMutation = useRevokePermissionFromRole();
  const isActionPending =
    updatePermissionMutation.isPending ||
    activatePermissionMutation.isPending ||
    deactivatePermissionMutation.isPending;
  const grantedRoleIds = new Set(
    permissionRolesQuery.data?.roles.map((role) => role.roleId) ?? [],
  );
  const grantableRoleOptions =
    grantableRolesQuery.data?.items
      .filter((role) => !grantedRoleIds.has(role.roleId))
      .map((role) => ({
        label: `${role.displayName} (${role.name})`,
        value: role.roleId,
      })) ?? [];
  const permissionRoleColumns = getPermissionRoleColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
    (roleId) => navigate(`${ROUTES.AUTHORIZATION_ROLES}/${roleId}`),
    handleRevokeRole,
    revokePermissionMutation.isPending,
  );

  async function runPermissionAction(
    action: () => Promise<unknown>,
    successMessage: string,
    errorMessage: string,
  ): Promise<boolean> {
    try {
      await action();

      notification.success({
        message: successMessage,
        placement: "topRight",
      });

      return true;
    } catch {
      notification.error({
        message: errorMessage,
        placement: "topRight",
      });

      return false;
    }
  }

  function openEditModal() {
    if (!permission) {
      return;
    }

    editForm.setFieldsValue({
      key: permission.key,
      module: permission.module,
      action: permission.action,
      description: permission.description ?? "",
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  function openGrantRoleModal() {
    grantRoleForm.resetFields();
    setIsGrantRoleModalOpen(true);
  }

  function closeGrantRoleModal() {
    setIsGrantRoleModalOpen(false);
    grantRoleForm.resetFields();
  }

  async function handleUpdatePermission() {
    if (!selectedPermissionId) {
      return;
    }

    const values = await editForm.validateFields();
    const completed = await runPermissionAction(
      () =>
        updatePermissionMutation.mutateAsync({
          permissionId: selectedPermissionId,
          key: values.key,
          module: values.module,
          action: values.action,
          description: values.description?.trim() || null,
        }),
      "Permission updated",
      "Could not update permission.",
    );

    if (completed) {
      closeEditModal();
    }
  }

  async function handleGrantRole() {
    if (!selectedPermissionId) {
      return;
    }

    const values = await grantRoleForm.validateFields();
    const completed = await runPermissionAction(
      () =>
        grantPermissionMutation.mutateAsync({
          roleId: values.roleId,
          permissionId: selectedPermissionId,
        }),
      "Permission granted to role",
      "Could not grant permission to role.",
    );

    if (completed) {
      closeGrantRoleModal();
    }
  }

  async function handleRevokeRole(roleId: number) {
    if (!selectedPermissionId) {
      return;
    }

    await runPermissionAction(
      () =>
        revokePermissionMutation.mutateAsync({
          roleId,
          permissionId: selectedPermissionId,
        }),
      "Permission revoked from role",
      "Could not revoke permission from role.",
    );
  }

  if (!selectedPermissionId) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Invalid permission id.
        </Typography.Text>
      </Card>
    );
  }

  if (permissionDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!permission) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Permission information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.AUTHORIZATION_PERMISSIONS)}
      >
        Back to permissions
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {permission.key}
            </Typography.Title>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              <Tag color="blue">{permission.module}</Tag>
              <Tag color="geekblue">{permission.action}</Tag>
              {permission.isActive ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Inactive</Tag>
              )}
              {permission.isSystem ? (
                <Tag color="processing">System</Tag>
              ) : (
                <Tag color="default">Custom</Tag>
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Permission ID">
            {permission.permissionId}
          </Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {permission.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Key">
            <Typography.Text style={wrappingTextStyle}>
              {permission.key}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Key normalized">
            <Typography.Text style={wrappingTextStyle}>
              {permission.keyNormalized}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Module">
            <Tag color="blue">{permission.module}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Action">
            <Tag color="geekblue">{permission.action}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Typography.Text style={wrappingTextStyle}>
              {permission.description || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {permission.isActive ? (
              <Tag color="success">Active</Tag>
            ) : (
              <Tag color="default">Inactive</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="System">
            {permission.isSystem ? (
              <Tag color="processing">System</Tag>
            ) : (
              <Tag color="default">Custom</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(permission.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(permission.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Created by">
            <AuthorizationAuditUser
              userId={permission.createdByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel="System"
              fallbackDescription="Data initializer"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            <AuthorizationAuditUser
              userId={permission.updatedByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel={permission.updatedAt ? "System" : "N/A"}
              fallbackDescription={
                permission.updatedAt ? "Data initializer" : undefined
              }
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={12} wrap>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            loading={updatePermissionMutation.isPending}
          >
            Edit permission
          </Button>

          {permission.isActive ? (
            <Popconfirm
              title="Deactivate permission?"
              okText="Deactivate"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() =>
                runPermissionAction(
                  () =>
                    deactivatePermissionMutation.mutateAsync({
                      permissionId: permission.permissionId,
                    }),
                  "Permission deactivated",
                  "Could not deactivate permission.",
                )
              }
            >
              <Button
                danger
                icon={<StopOutlined />}
                loading={deactivatePermissionMutation.isPending}
                disabled={isActionPending}
              >
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Activate permission?"
              okText="Activate"
              cancelText="Cancel"
              onConfirm={() =>
                runPermissionAction(
                  () =>
                    activatePermissionMutation.mutateAsync({
                      permissionId: permission.permissionId,
                    }),
                  "Permission activated",
                  "Could not activate permission.",
                )
              }
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={activatePermissionMutation.isPending}
                disabled={isActionPending}
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Card
        title="Roles"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openGrantRoleModal}
          >
            Grant to role
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Table<AdminPermissionRoleItemResponse>
          bordered
          rowKey={(role) => String(role.roleId)}
          columns={permissionRoleColumns}
          dataSource={permissionRolesQuery.data?.roles ?? []}
          loading={
            permissionRolesQuery.isFetching ||
            auditUsersQuery.isFetching ||
            revokePermissionMutation.isPending
          }
          scroll={{ x: 1270 }}
          locale={{
            emptyText: permissionRolesQuery.isError
              ? "Could not load permission roles."
              : "No roles granted.",
          }}
          pagination={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
        />
      </Card>

      <Modal
        title="Edit permission"
        open={isEditModalOpen}
        okText="Save"
        confirmLoading={updatePermissionMutation.isPending}
        onOk={handleUpdatePermission}
        onCancel={closeEditModal}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Key"
            name="key"
            rules={[{ required: true, message: "Key is required." }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Module"
            name="module"
            rules={[{ required: true, message: "Module is required." }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Action"
            name="action"
            rules={[{ required: true, message: "Action is required." }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Grant to role"
        open={isGrantRoleModalOpen}
        okText="Grant"
        confirmLoading={grantPermissionMutation.isPending}
        onOk={handleGrantRole}
        onCancel={closeGrantRoleModal}
        destroyOnHidden
      >
        <Form form={grantRoleForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Role"
            name="roleId"
            rules={[{ required: true, message: "Role is required." }]}
          >
            <Select
              showSearch
              loading={grantableRolesQuery.isFetching}
              notFoundContent={
                grantableRolesQuery.isFetching
                  ? "Loading roles..."
                  : grantableRolesQuery.isError
                    ? "Could not load roles."
                    : "No ungranted active roles."
              }
              options={grantableRoleOptions}
              optionFilterProp="label"
              placeholder="Select role"
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
