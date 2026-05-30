import { PlusOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { type CSSProperties, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminCategories } from "../hooks/category/useAdminCategories";
import { useCreateAdminCategory } from "../hooks/category/useCreateAdminCategory";
import type { AdminCategoryListItem } from "../types/adminCategory.types";

type ActiveFilter = "all" | "active" | "inactive";
type DeletedFilter = "visible" | "deleted" | "all";

type CreateCategoryFormValues = {
  parentCategoryId?: number | null;
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number | null;
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

function getCategoryColumns(): TableProps<AdminCategoryListItem>["columns"] {
  return [
    {
      title: "Category",
      key: "category",
      fixed: "left",
      width: 320,
      render: (_, category) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {category.name}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {category.nameNormalized}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Parent",
      dataIndex: "parentCategoryId",
      key: "parentCategoryId",
      width: 140,
      render: (parentCategoryId: number | null) =>
        parentCategoryId ? (
          <Tag color="blue">#{parentCategoryId}</Tag>
        ) : (
          <Tag color="default">Root</Tag>
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 360,
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
      title: "Order",
      dataIndex: "displayOrder",
      key: "displayOrder",
      width: 110,
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

export function CategoriesPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [createForm] = Form.useForm<CreateCategoryFormValues>();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [parentCategoryId, setParentCategoryId] = useState<number>();
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("visible");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const categoriesQuery = useAdminCategories({
    page,
    pageSize,
    keyword: submittedKeyword || null,
    parentCategoryId,
    isActive: activeFilter === "all" ? null : activeFilter === "active",
    isDeleted: getIsDeletedFilterValue(deletedFilter),
  });
  const parentCategoriesQuery = useAdminCategories({
    page: 1,
    pageSize: 100,
    isDeleted: false,
  });
  const categoryColumns = getCategoryColumns();
  const createCategoryMutation = useCreateAdminCategory();
  const parentCategoryOptions = useMemo(
    () =>
      (parentCategoriesQuery.data?.items ?? []).map((category) => ({
        label: `${category.name} (#${category.categoryId})`,
        value: category.categoryId,
      })),
    [parentCategoriesQuery.data?.items],
  );

  function openCreateModal() {
    createForm.setFieldsValue({
      parentCategoryId: undefined,
      name: "",
      description: "",
      isActive: true,
      displayOrder: 0,
    });
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
    createForm.resetFields();
  }

  async function handleCreateCategory() {
    const values = await createForm.validateFields();

    try {
      await createCategoryMutation.mutateAsync({
        parentCategoryId: values.parentCategoryId ?? null,
        name: values.name.trim(),
        description: values.description?.trim() || null,
        isActive: Boolean(values.isActive),
        displayOrder: values.displayOrder ?? 0,
      });

      notification.success({
        title: "Category created",
        placement: "topRight",
      });
      setPage(1);
      closeCreateModal();
    } catch (error) {
      notification.error({
        title: "Could not create category.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Categories
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
              placeholder="Search categories"
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

            <Select<number>
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Parent category"
              value={parentCategoryId}
              loading={parentCategoriesQuery.isFetching}
              onChange={(value) => {
                setParentCategoryId(value);
                setPage(1);
              }}
              options={parentCategoryOptions}
              style={{ width: 220 }}
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
            Create category
          </Button>
        </div>

        <Table<AdminCategoryListItem>
          bordered
          rowKey={(category) => String(category.categoryId)}
          columns={categoryColumns}
          dataSource={categoriesQuery.data?.items ?? []}
          loading={categoriesQuery.isFetching}
          scroll={{ x: 1920 }}
          locale={{
            emptyText: categoriesQuery.isError
              ? "Could not load categories."
              : "No categories found.",
          }}
          pagination={{
            current: categoriesQuery.data?.pageInfo.page ?? page,
            pageSize: categoriesQuery.data?.pageInfo.pageSize ?? pageSize,
            total: categoriesQuery.data?.pageInfo.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} categories`,
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
          onRow={(category) => ({
            onClick: () =>
              navigate(`${ROUTES.CONTENT_CATEGORIES}/${category.categoryId}`, {
                state: { category },
              }),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Create category"
        open={isCreateModalOpen}
        okText="Create"
        confirmLoading={createCategoryMutation.isPending}
        onOk={handleCreateCategory}
        onCancel={closeCreateModal}
        forceRender
        destroyOnHidden
      >
        <Form form={createForm} layout="vertical" requiredMark={false}>
          <Form.Item label="Parent category" name="parentCategoryId">
            <Select<number>
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Root category"
              loading={parentCategoriesQuery.isFetching}
              options={parentCategoryOptions}
            />
          </Form.Item>

          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Name is required." },
              { whitespace: true, message: "Name is required." },
              {
                max: ContentFieldLimits.categoryNameMaxLength,
                message: `Name must be at most ${ContentFieldLimits.categoryNameMaxLength} characters.`,
              },
            ]}
          >
            <Input autoComplete="off" maxLength={ContentFieldLimits.categoryNameMaxLength} />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} />
          </Form.Item>

          <Form.Item
            label="Display order"
            name="displayOrder"
            rules={[{ required: true, message: "Display order is required." }]}
          >
            <InputNumber min={0} precision={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="isActive" valuePropName="checked">
            <Checkbox>Active</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
