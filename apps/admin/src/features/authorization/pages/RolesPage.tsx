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
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../components/AuthorizationAuditUser";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import { useCreateAdminRole } from "../hooks/useCreateAdminRole";
import { useAdminRoles } from "../hooks/useAdminRoles";
import type { AdminRoleListItemResponse } from "../types/adminRole.types";
import { getAuthorizationAuditUserIds } from "../utils/authorizationAudit";

type ActiveFilter = "all" | "active" | "inactive";

type CreateRoleFormValues = {
  name: string;
  displayName: string;
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

function getRoleColumns(
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
): TableProps<AdminRoleListItemResponse>["columns"] {
  return [
    {
      title: "Role",
      key: "role",
      fixed: "left",
      width: 300,
      render: (_, role) => (
        <div style={{ minWidth: 0, maxWidth: 250 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {role.displayName}
          </Typography.Text>
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
      render: (userId: number | null, role) => (
        <AuthorizationAuditUser
          userId={userId}
          usersById={usersById}
          isFetchingUsers={isFetchingUsers}
          fallbackLabel={role.updatedAt ? "System" : "N/A"}
          fallbackDescription={role.updatedAt ? "Data initializer" : undefined}
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

export function RolesPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [createForm] = Form.useForm<CreateRoleFormValues>();
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const rolesQuery = useAdminRoles({
    query: submittedQuery || null,
    isActive: activeFilter === "all" ? null : activeFilter === "active",
    page,
    pageSize,
  });
  const auditUsersQuery = useAdminUserDetails(
    getAuthorizationAuditUserIds(rolesQuery.data?.items ?? []),
  );
  const roleColumns = getRoleColumns(
    auditUsersQuery.usersById,
    auditUsersQuery.isFetching,
  );
  const createRoleMutation = useCreateAdminRole();

  function openCreateModal() {
    createForm.setFieldsValue({
      name: "",
      displayName: "",
      description: "",
      isSystem: false,
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  }

  async function handleCreateRole() {
    const values = await createForm.validateFields();

    try {
      await createRoleMutation.mutateAsync({
        name: values.name,
        displayName: values.displayName,
        description: values.description?.trim() || null,
        isSystem: Boolean(values.isSystem),
      });

      notification.success({
        message: "Role created",
        placement: "topRight",
      });
      setPage(1);
      closeCreateModal();
    } catch {
      notification.error({
        message: "Could not create role.",
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Roles
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
              placeholder="Search roles"
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

            <Select<ActiveFilter>
              value={activeFilter}
              onChange={(value) => {
                setActiveFilter(value);
                setPage(1);
              }}
              options={[
                { label: "All roles", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              style={{ width: 160 }}
            />
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create role
          </Button>
        </div>

        <Table<AdminRoleListItemResponse>
          bordered
          rowKey={(role) => String(role.roleId)}
          columns={roleColumns}
          dataSource={rolesQuery.data?.items ?? []}
          loading={rolesQuery.isFetching || auditUsersQuery.isFetching}
          scroll={{ x: 1960 }}
          locale={{
            emptyText: rolesQuery.isError
              ? "Could not load roles."
              : "No roles found.",
          }}
          pagination={{
            current: rolesQuery.data?.page ?? page,
            pageSize: rolesQuery.data?.pageSize ?? pageSize,
            total: rolesQuery.data?.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} roles`,
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
          onRow={(role) => ({
            onClick: () =>
              navigate(`${ROUTES.AUTHORIZATION_ROLES}/${role.roleId}`, {
                state: { role },
              }),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Create role"
        open={isCreateModalOpen}
        okText="Create"
        confirmLoading={createRoleMutation.isPending}
        onOk={handleCreateRole}
        onCancel={closeCreateModal}
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" requiredMark={false}>
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

          <Form.Item name="isSystem" valuePropName="checked">
            <Checkbox>System role</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
