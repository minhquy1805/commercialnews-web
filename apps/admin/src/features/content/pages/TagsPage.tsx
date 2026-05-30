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
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminTags } from "../hooks/tag/useAdminTags";
import { useCreateAdminTag } from "../hooks/tag/useCreateAdminTag";
import type { AdminTagListItem } from "../types/adminTag.types";

type ActiveFilter = "all" | "active" | "inactive";
type DeletedFilter = "visible" | "deleted" | "all";

type CreateTagFormValues = {
  name: string;
  description?: string;
  isActive: boolean;
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

function getTagColumns(): TableProps<AdminTagListItem>["columns"] {
  return [
    {
      title: "Tag",
      key: "tag",
      fixed: "left",
      width: 320,
      render: (_, tag) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {tag.name}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {tag.nameNormalized}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 380,
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
      title: "Deleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: (isDeleted: boolean) =>
        isDeleted ? (
          <Tag color="error">Deleted</Tag>
        ) : (
          <Tag color="success">Visible</Tag>
        ),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 110,
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

function getIsDeletedFilterValue(filter: DeletedFilter) {
  if (filter === "all") {
    return undefined;
  }

  return filter === "deleted";
}

export function TagsPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [createForm] = Form.useForm<CreateTagFormValues>();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("visible");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tagsQuery = useAdminTags({
    page,
    pageSize,
    keyword: submittedKeyword || null,
    isActive: activeFilter === "all" ? null : activeFilter === "active",
    isDeleted: getIsDeletedFilterValue(deletedFilter),
  });
  const tagColumns = getTagColumns();
  const createTagMutation = useCreateAdminTag();

  function openCreateModal() {
    createForm.setFieldsValue({
      name: "",
      description: "",
      isActive: true,
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  }

  async function handleCreateTag() {
    const values = await createForm.validateFields();

    try {
      await createTagMutation.mutateAsync({
        name: values.name.trim(),
        description: values.description?.trim() || null,
        isActive: Boolean(values.isActive),
      });

      notification.success({
        title: "Tag created",
        placement: "topRight",
      });
      setPage(1);
      closeCreateModal();
    } catch (error) {
      notification.error({
        title: "Could not create tag.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Tags
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
              placeholder="Search tags"
              value={keyword}
              onChange={(event) => {
                const nextKeyword = event.target.value;
                setKeyword(nextKeyword);

                if (!nextKeyword) {
                  setSubmittedKeyword("");
                  setPage(1);
                }
              }}
              onSearch={(value) => {
                setSubmittedKeyword(value.trim());
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
                { label: "All statuses", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              style={{ width: 160 }}
            />

            <Select<DeletedFilter>
              value={deletedFilter}
              onChange={(value) => {
                setDeletedFilter(value);
                setPage(1);
              }}
              options={[
                { label: "Visible", value: "visible" },
                { label: "Deleted", value: "deleted" },
                { label: "All records", value: "all" },
              ]}
              style={{ width: 160 }}
            />
          </Space>

          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Create tag
          </Button>
        </div>

        <Table<AdminTagListItem>
          bordered
          rowKey={(tag) => String(tag.tagId)}
          columns={tagColumns}
          dataSource={tagsQuery.data?.items ?? []}
          loading={tagsQuery.isFetching}
          scroll={{ x: 1690 }}
          locale={{
            emptyText: tagsQuery.isError
              ? "Could not load tags."
              : "No tags found.",
          }}
          pagination={{
            current: tagsQuery.data?.pageInfo.page ?? page,
            pageSize: tagsQuery.data?.pageInfo.pageSize ?? pageSize,
            total: tagsQuery.data?.pageInfo.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} tags`,
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
          onRow={(tag) => ({
            onClick: () =>
              navigate(`${ROUTES.CONTENT_TAGS}/${tag.tagId}`, {
                state: { tag },
              }),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Create tag"
        open={isCreateModalOpen}
        okText="Create"
        confirmLoading={createTagMutation.isPending}
        onOk={handleCreateTag}
        onCancel={closeCreateModal}
        forceRender
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" requiredMark={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required." },
              { whitespace: true, message: "Name is required." },
              {
                max: ContentFieldLimits.tagNameMaxLength,
                message: `Name must be at most ${ContentFieldLimits.tagNameMaxLength} characters.`,
              },
            ]}
          >
            <Input autoComplete="off" maxLength={ContentFieldLimits.tagNameMaxLength} />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                max: ContentFieldLimits.tagDescriptionMaxLength,
                message: `Description must be at most ${ContentFieldLimits.tagDescriptionMaxLength} characters.`,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={ContentFieldLimits.tagDescriptionMaxLength}
              showCount
            />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
