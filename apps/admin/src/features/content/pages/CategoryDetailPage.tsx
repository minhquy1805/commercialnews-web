import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { type CSSProperties, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminCategories } from "../hooks/category/useAdminCategories";
import { useAdminCategoryDetail } from "../hooks/category/useAdminCategoryDetail";
import { useRestoreAdminCategory } from "../hooks/category/useRestoreAdminCategory";
import { useSoftDeleteAdminCategory } from "../hooks/category/useSoftDeleteAdminCategory";
import { useUpdateAdminCategory } from "../hooks/category/useUpdateAdminCategory";

type EditCategoryFormValues = {
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

export function CategoryDetailPage() {
  const { categoryId } = useParams();
  const parsedCategoryId = Number(categoryId);
  const selectedCategoryId =
    Number.isSafeInteger(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : null;
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditCategoryFormValues>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const categoryDetailQuery = useAdminCategoryDetail(selectedCategoryId ?? 0);
  const category = categoryDetailQuery.data;
  const parentCategoriesQuery = useAdminCategories({
    page: 1,
    pageSize: 100,
    isDeleted: false,
  });
  const updateCategoryMutation = useUpdateAdminCategory();
  const softDeleteCategoryMutation = useSoftDeleteAdminCategory();
  const restoreCategoryMutation = useRestoreAdminCategory();
  const isActionPending =
    updateCategoryMutation.isPending ||
    softDeleteCategoryMutation.isPending ||
    restoreCategoryMutation.isPending;
  const parentCategoryOptions = useMemo(
    () =>
      (parentCategoriesQuery.data?.items ?? [])
        .filter((parentCategory) => parentCategory.categoryId !== selectedCategoryId)
        .map((parentCategory) => ({
          label: `${parentCategory.name} (#${parentCategory.categoryId})`,
          value: parentCategory.categoryId,
        })),
    [parentCategoriesQuery.data?.items, selectedCategoryId],
  );

  async function runCategoryAction(
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
    if (!category) {
      return;
    }

    editForm.setFieldsValue({
      parentCategoryId: category.parentCategoryId ?? undefined,
      name: category.name,
      description: category.description ?? "",
      isActive: category.isActive,
      displayOrder: category.displayOrder,
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  async function handleUpdateCategory() {
    if (!category) {
      return;
    }

    const values = await editForm.validateFields();
    const completed = await runCategoryAction(
      () =>
        updateCategoryMutation.mutateAsync({
          categoryId: category.categoryId,
          parentCategoryId: values.parentCategoryId ?? null,
          name: values.name.trim(),
          description: values.description?.trim() || null,
          isActive: Boolean(values.isActive),
          displayOrder: values.displayOrder ?? 0,
          expectedVersion: category.version,
        }),
      "Category updated",
      "Could not update category.",
    );

    if (completed) {
      closeEditModal();
    }
  }

  if (!selectedCategoryId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid category id.</Typography.Text>
      </Card>
    );
  }

  if (categoryDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!category) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Category information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.CONTENT_CATEGORIES)}
      >
        Back to categories
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {category.name}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {category.nameNormalized}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {category.parentCategoryId ? (
                <Tag color="blue">Parent #{category.parentCategoryId}</Tag>
              ) : (
                <Tag color="default">Root</Tag>
              )}
              {category.isActive ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Inactive</Tag>
              )}
              {category.isDeleted ? (
                <Tag color="error">Deleted</Tag>
              ) : (
                <Tag color="success">Visible</Tag>
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Category ID">
            {category.categoryId}
          </Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {category.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Parent category">
            {category.parentCategoryId ? (
              <Button
                type="link"
                onClick={() =>
                  navigate(`${ROUTES.CONTENT_CATEGORIES}/${category.parentCategoryId}`)
                }
                style={{ height: "auto", padding: 0 }}
              >
                #{category.parentCategoryId}
              </Button>
            ) : (
              <Tag color="default">Root</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Display order">
            {category.displayOrder}
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <Typography.Text style={wrappingTextStyle}>
              {category.name}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name normalized">
            <Typography.Text style={wrappingTextStyle}>
              {category.nameNormalized}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Typography.Text style={wrappingTextStyle}>
              {category.description || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {category.isActive ? (
              <Tag color="success">Active</Tag>
            ) : (
              <Tag color="default">Inactive</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted">
            {category.isDeleted ? (
              <Tag color="error">Deleted</Tag>
            ) : (
              <Tag color="success">Visible</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{category.version}</Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(category.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(category.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted at">
            {formatDateTime(category.deletedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={12} wrap>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            loading={updateCategoryMutation.isPending}
            disabled={category.isDeleted || isActionPending}
          >
            Edit category
          </Button>

          {category.isDeleted ? (
            <Popconfirm
              title="Restore category?"
              okText="Restore"
              cancelText="Cancel"
              onConfirm={() =>
                runCategoryAction(
                  () =>
                    restoreCategoryMutation.mutateAsync({
                      categoryId: category.categoryId,
                      expectedVersion: category.version,
                    }),
                  "Category restored",
                  "Could not restore category.",
                )
              }
            >
              <Button
                type="primary"
                icon={<UndoOutlined />}
                loading={restoreCategoryMutation.isPending}
                disabled={isActionPending}
              >
                Restore
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Delete category?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() =>
                runCategoryAction(
                  () =>
                    softDeleteCategoryMutation.mutateAsync({
                      categoryId: category.categoryId,
                      expectedVersion: category.version,
                    }),
                  "Category deleted",
                  "Could not delete category.",
                )
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={softDeleteCategoryMutation.isPending}
                disabled={isActionPending}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Modal
        title="Edit category"
        open={isEditModalOpen}
        okText="Save"
        confirmLoading={updateCategoryMutation.isPending}
        onOk={handleUpdateCategory}
        onCancel={closeEditModal}
        forceRender
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
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
