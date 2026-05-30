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
import { getApiErrorDescription } from "../../../shared/api/apiError";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../components/AuthorizationAuditUser";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import { useActivateAdminRole } from "../hooks/useActivateAdminRole";
import { useAdminPermissions } from "../hooks/useAdminPermissions";
import { useAdminRoleDetail } from "../hooks/useAdminRoleDetail";
import { useAdminRolePermissions } from "../hooks/useAdminRolePermissions";
import { useDeactivateAdminRole } from "../hooks/useDeactivateAdminRole";
import { useGrantPermissionToRole } from "../hooks/useGrantPermissionToRole";
import { useRevokePermissionFromRole } from "../hooks/useRevokePermissionFromRole";
import { useUpdateAdminRole } from "../hooks/useUpdateAdminRole";
import type { AdminRolePermissionItemResponse } from "../types/adminRolePermission.types";
import type { AdminRoleListItemResponse } from "../types/adminRole.types";
import {
  getAuthorizationAuditUserIds,
  getNumericUserIds,
} from "../utils/authorizationAudit";

type RoleDetailRouteState = {
  role?: AdminRoleListItemResponse;
};

type EditRoleFormValues = {
  name: string;
  displayName: string;
  description?: string;
};

type GrantPermissionFormValues = {
  permissionId: number;
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

function getInitialRoleFromRouteState(
  state: unknown,
  roleId: number | null,
) {
  const role = (state as RoleDetailRouteState | null)?.role;

  if (!roleId || role?.roleId !== roleId) {
    return null;
  }

  return role;
}

function getRolePermissionColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
  onOpenPermission: (permissionId: number) => void,
  onRevokePermission: (permissionId: number) => void,
  isRevokingPermission: boolean,
): TableProps<AdminRolePermissionItemResponse>["columns"] {
  return [
    {
      title: "Permission",
      key: "permission",
      fixed: "left",
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
      render: (_, permission) => (
        <Popconfirm
          title="Revoke permission?"
          okText="Revoke"
          okButtonProps={{ danger: true }}
          cancelText="Cancel"
          onConfirm={() => onRevokePermission(permission.permissionId)}
        >
          <Button danger loading={isRevokingPermission}>
            Revoke
          </Button>
        </Popconfirm>
      ),
    },
  ];
}

export function RoleDetailPage() {
  const { roleId } = useParams();
  const parsedRoleId = Number(roleId);
  const selectedRoleId = Number.isSafeInteger(parsedRoleId)
    ? parsedRoleId
    : null;
  const location = useLocation();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditRoleFormValues>();
  const [grantPermissionForm] = Form.useForm<GrantPermissionFormValues>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isGrantPermissionModalOpen, setIsGrantPermissionModalOpen] =
    useState(false);

  const roleDetailQuery = useAdminRoleDetail(
    selectedRoleId,
    getInitialRoleFromRouteState(location.state, selectedRoleId),
  );
  const role = roleDetailQuery.data;
  const rolePermissionsQuery = useAdminRolePermissions(selectedRoleId);
  const grantablePermissionsQuery = useAdminPermissions({
    page: 1,
    pageSize: 100,
    isActive: true,
  });
  const auditUsersQuery = useAdminUserDetails(
    [
      ...(role ? getAuthorizationAuditUserIds([role]) : []),
      ...getNumericUserIds(
        rolePermissionsQuery.data?.permissions.map(
          (permission) => permission.grantedByUserId,
        ) ?? [],
      ),
    ],
  );
  const updateRoleMutation = useUpdateAdminRole();
  const activateRoleMutation = useActivateAdminRole();
  const deactivateRoleMutation = useDeactivateAdminRole();
  const grantPermissionMutation = useGrantPermissionToRole();
  const revokePermissionMutation = useRevokePermissionFromRole();
  const isActionPending =
    updateRoleMutation.isPending ||
    activateRoleMutation.isPending ||
    deactivateRoleMutation.isPending;
  const grantedPermissionIds = new Set(
    rolePermissionsQuery.data?.permissions.map(
      (permission) => permission.permissionId,
    ) ?? [],
  );
  const grantablePermissionOptions =
    grantablePermissionsQuery.data?.items
      .filter((permission) => !grantedPermissionIds.has(permission.permissionId))
      .map((permission) => ({
        label: `${permission.key} (${permission.module}:${permission.action})`,
        value: permission.permissionId,
      })) ?? [];
  const rolePermissionColumns = getRolePermissionColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
    (permissionId) => navigate(`${ROUTES.AUTHORIZATION_PERMISSIONS}/${permissionId}`),
    handleRevokePermission,
    revokePermissionMutation.isPending,
  );

  async function runRoleAction(
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

  function openEditModal() {
    if (!role) {
      return;
    }

    editForm.setFieldsValue({
      name: role.name,
      displayName: role.displayName,
      description: role.description ?? "",
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  function openGrantPermissionModal() {
    grantPermissionForm.resetFields();
    setIsGrantPermissionModalOpen(true);
  }

  function closeGrantPermissionModal() {
    setIsGrantPermissionModalOpen(false);
    grantPermissionForm.resetFields();
  }

  async function handleUpdateRole() {
    if (!selectedRoleId) {
      return;
    }

    const values = await editForm.validateFields();
    const completed = await runRoleAction(
      () =>
        updateRoleMutation.mutateAsync({
          roleId: selectedRoleId,
          name: values.name,
          displayName: values.displayName,
          description: values.description?.trim() || null,
        }),
      "Role updated",
      "Could not update role.",
    );

    if (completed) {
      closeEditModal();
    }
  }

  async function handleGrantPermission() {
    if (!selectedRoleId) {
      return;
    }

    const values = await grantPermissionForm.validateFields();
    const completed = await runRoleAction(
      () =>
        grantPermissionMutation.mutateAsync({
          roleId: selectedRoleId,
          permissionId: values.permissionId,
        }),
      "Permission granted",
      "Could not grant permission.",
    );

    if (completed) {
      closeGrantPermissionModal();
    }
  }

  async function handleRevokePermission(permissionId: number) {
    if (!selectedRoleId) {
      return;
    }

    await runRoleAction(
      () =>
        revokePermissionMutation.mutateAsync({
          roleId: selectedRoleId,
          permissionId,
        }),
      "Permission revoked",
      "Could not revoke permission.",
    );
  }

  if (!selectedRoleId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid role id.</Typography.Text>
      </Card>
    );
  }

  if (roleDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!role) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Role information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.AUTHORIZATION_ROLES)}
      >
        Back to roles
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {role.displayName}
            </Typography.Title>

            <Typography.Text style={wrappingTextStyle}>
              {role.name}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {role.isActive ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Inactive</Tag>
              )}
              {role.isSystem ? (
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
          <Descriptions.Item label="Role ID">{role.roleId}</Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {role.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <Typography.Text style={wrappingTextStyle}>
              {role.name}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name normalized">
            <Typography.Text style={wrappingTextStyle}>
              {role.nameNormalized}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Display name">
            <Typography.Text style={wrappingTextStyle}>
              {role.displayName}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Typography.Text style={wrappingTextStyle}>
              {role.description || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {role.isActive ? (
              <Tag color="success">Active</Tag>
            ) : (
              <Tag color="default">Inactive</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="System">
            {role.isSystem ? (
              <Tag color="processing">System</Tag>
            ) : (
              <Tag color="default">Custom</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(role.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(role.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Created by">
            <AuthorizationAuditUser
              userId={role.createdByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel="System"
              fallbackDescription="Data initializer"
            />
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            <AuthorizationAuditUser
              userId={role.updatedByUserId}
              usersById={auditUsersQuery.usersById}
              isFetchingUsers={auditUsersQuery.isFetching}
              fallbackLabel={role.updatedAt ? "System" : "N/A"}
              fallbackDescription={
                role.updatedAt ? "Data initializer" : undefined
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
            loading={updateRoleMutation.isPending}
          >
            Edit role
          </Button>

          {role.isActive ? (
            <Popconfirm
              title="Deactivate role?"
              okText="Deactivate"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() =>
                runRoleAction(
                  () =>
                    deactivateRoleMutation.mutateAsync({
                      roleId: role.roleId,
                    }),
                  "Role deactivated",
                  "Could not deactivate role.",
                )
              }
            >
              <Button
                danger
                icon={<StopOutlined />}
                loading={deactivateRoleMutation.isPending}
                disabled={isActionPending}
              >
                Deactivate
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Activate role?"
              okText="Activate"
              cancelText="Cancel"
              onConfirm={() =>
                runRoleAction(
                  () =>
                    activateRoleMutation.mutateAsync({
                      roleId: role.roleId,
                    }),
                  "Role activated",
                  "Could not activate role.",
                )
              }
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                loading={activateRoleMutation.isPending}
                disabled={isActionPending}
              >
                Activate
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Card
        title="Permissions"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={openGrantPermissionModal}
          >
            Grant permission
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        <Table<AdminRolePermissionItemResponse>
          bordered
          rowKey={(permission) => String(permission.permissionId)}
          columns={rolePermissionColumns}
          dataSource={rolePermissionsQuery.data?.permissions ?? []}
          loading={
            rolePermissionsQuery.isFetching ||
            auditUsersQuery.isFetching ||
            revokePermissionMutation.isPending
          }
          scroll={{ x: 1260 }}
          locale={{
            emptyText: rolePermissionsQuery.isError
              ? "Could not load role permissions."
              : "No permissions granted.",
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
        title="Edit role"
        open={isEditModalOpen}
        okText="Save"
        confirmLoading={updateRoleMutation.isPending}
        onOk={handleUpdateRole}
        onCancel={closeEditModal}
        forceRender
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Name is required." }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item
            label="Display name"
            name="displayName"
            rules={[{ required: true, message: "Display name is required." }]}
          >
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Grant permission"
        open={isGrantPermissionModalOpen}
        okText="Grant"
        confirmLoading={grantPermissionMutation.isPending}
        onOk={handleGrantPermission}
        onCancel={closeGrantPermissionModal}
        forceRender
        destroyOnHidden
      >
        <Form
          form={grantPermissionForm}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            label="Permission"
            name="permissionId"
            rules={[{ required: true, message: "Permission is required." }]}
          >
            <Select
              showSearch
              loading={grantablePermissionsQuery.isFetching}
              notFoundContent={
                grantablePermissionsQuery.isFetching
                  ? "Loading permissions..."
                  : grantablePermissionsQuery.isError
                    ? "Could not load permissions."
                    : "No ungranted active permissions."
              }
              options={grantablePermissionOptions}
              optionFilterProp="label"
              placeholder="Select permission"
            />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
