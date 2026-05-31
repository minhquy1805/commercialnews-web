import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Modal,
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
import { createTablePagination } from "../../../shared/pagination";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../components/AuthorizationAuditUser";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import { useCreateAdminPermission } from "../hooks/useCreateAdminPermission";
import { useAdminPermissions } from "../hooks/useAdminPermissions";
import type { AdminPermissionListItemResponse } from "../types/adminPermission.types";
import { getAuthorizationAuditUserIds } from "../utils/authorizationAudit";

type ActiveFilter = "all" | "active" | "inactive";

type CreatePermissionFormValues = {
  key: string;
  module: string;
  action: string;
  description?: string;
  isSystem: boolean;
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

function getPermissionColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminPermissionListItemResponse>["columns"] {
  return [
    {
      title: "Permission",
      key: "permission",
      fixed: "left",
      width: 320,
      render: (_, permission) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {permission.key}
          </Typography.Text>
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
      width: 160,
      render: (module: string) => <Tag color="blue">{module}</Tag>,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: 150,
      render: (action: string) => <Tag color="geekblue">{action}</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 340,
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
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Updated at",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Created by",
      dataIndex: "createdByUserId",
      key: "createdByUserId",
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
      title: "Updated by",
      dataIndex: "updatedByUserId",
      key: "updatedByUserId",
      width: 220,
      render: (userId: number | null, permission) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel={permission.updatedAt ? "System" : "N/A"}
          fallbackDescription={
            permission.updatedAt ? "Data initializer" : undefined
          }
        />
      ),
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

export function PermissionsPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [createForm] = Form.useForm<CreatePermissionFormValues>();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [module, setModule] = useState("");
  const [action, setAction] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const permissionsQuery = useAdminPermissions({
    query: submittedQuery || null,
    module: module.trim() || null,
    action: action.trim() || null,
    isActive: activeFilter === "all" ? null : activeFilter === "active",
    page,
    pageSize,
  });
  const auditUsersQuery = useAdminUserDetails(
    getAuthorizationAuditUserIds(permissionsQuery.data?.items ?? []),
  );
  const permissionColumns = getPermissionColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
  );
  const createPermissionMutation = useCreateAdminPermission();

  function openCreateModal() {
    createForm.setFieldsValue({
      key: "",
      module: "",
      action: "",
      description: "",
      isSystem: false,
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  }

  async function handleCreatePermission() {
    const values = await createForm.validateFields();

    try {
      await createPermissionMutation.mutateAsync({
        key: values.key,
        module: values.module,
        action: values.action,
        description: values.description?.trim() || null,
        isSystem: Boolean(values.isSystem),
      });

      notification.success({
        title: "Permission created",
        placement: "topRight",
      });
      setPage(1);
      closeCreateModal();
    } catch (error) {
      notification.error({
        title: "Could not create permission.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Permissions
      </Typography.Title>

      <Card style={{ marginTop: 24 }}>
        <div
          style={{
            alignItems: "flex-start",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Space size={12} wrap>
            <Input.Search
              allowClear
              placeholder="Search permissions"
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

            <Input
              allowClear
              placeholder="Module"
              value={module}
              onChange={(event) => {
                setModule(event.target.value);
                setPage(1);
              }}
              style={{ width: 180 }}
            />

            <Input
              allowClear
              placeholder="Action"
              value={action}
              onChange={(event) => {
                setAction(event.target.value);
                setPage(1);
              }}
              style={{ width: 180 }}
            />

            <Select<ActiveFilter>
              value={activeFilter}
              onChange={(value) => {
                setActiveFilter(value);
                setPage(1);
              }}
              options={[
                { label: "All permissions", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              style={{ width: 180 }}
            />
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create permission
          </Button>
        </div>

        <Table<AdminPermissionListItemResponse>
          bordered
          rowKey={(permission) => String(permission.permissionId)}
          columns={permissionColumns}
          dataSource={permissionsQuery.data?.items ?? []}
          loading={permissionsQuery.isFetching || auditUsersQuery.isFetching}
          scroll={{ x: 2290 }}
          locale={{
            emptyText: permissionsQuery.isError
              ? "Could not load permissions."
              : "No permissions found.",
          }}
          pagination={createTablePagination(
            permissionsQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} permissions`,
          )}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(permission) => ({
            onClick: () =>
              navigate(
                `${ROUTES.AUTHORIZATION_PERMISSIONS}/${permission.permissionId}`,
                {
                  state: { permission },
                },
              ),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Create permission"
        open={isCreateModalOpen}
        okText="Create"
        confirmLoading={createPermissionMutation.isPending}
        onOk={handleCreatePermission}
        onCancel={closeCreateModal}
        forceRender
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" requiredMark={false}>
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

          <Form.Item name="isSystem" valuePropName="checked">
            <Checkbox>System permission</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
