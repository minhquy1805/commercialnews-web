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
  Modal,
  Popconfirm,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { type CSSProperties, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { ContentFieldLimits } from "../constants/contentFieldLimits";
import { useAdminTagDetail } from "../hooks/tag/useAdminTagDetail";
import { useRestoreAdminTag } from "../hooks/tag/useRestoreAdminTag";
import { useSoftDeleteAdminTag } from "../hooks/tag/useSoftDeleteAdminTag";
import { useUpdateAdminTag } from "../hooks/tag/useUpdateAdminTag";

type EditTagFormValues = {
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

export function TagDetailPage() {
  const { tagId } = useParams();
  const parsedTagId = Number(tagId);
  const selectedTagId =
    Number.isSafeInteger(parsedTagId) && parsedTagId > 0 ? parsedTagId : null;
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditTagFormValues>();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const tagDetailQuery = useAdminTagDetail(selectedTagId ?? 0);
  const tag = tagDetailQuery.data;
  const updateTagMutation = useUpdateAdminTag();
  const softDeleteTagMutation = useSoftDeleteAdminTag();
  const restoreTagMutation = useRestoreAdminTag();
  const isActionPending =
    updateTagMutation.isPending ||
    softDeleteTagMutation.isPending ||
    restoreTagMutation.isPending;

  async function runTagAction(
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
    if (!tag) {
      return;
    }

    editForm.setFieldsValue({
      name: tag.name,
      description: tag.description ?? "",
      isActive: tag.isActive,
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  async function handleUpdateTag() {
    if (!tag) {
      return;
    }

    const values = await editForm.validateFields();
    const completed = await runTagAction(
      () =>
        updateTagMutation.mutateAsync({
          tagId: tag.tagId,
          name: values.name.trim(),
          description: values.description?.trim() || null,
          isActive: Boolean(values.isActive),
          expectedVersion: tag.version,
        }),
      "Tag updated",
      "Could not update tag.",
    );

    if (completed) {
      closeEditModal();
    }
  }

  if (!selectedTagId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid tag id.</Typography.Text>
      </Card>
    );
  }

  if (tagDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!tag) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Tag information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.CONTENT_TAGS)}
      >
        Back to tags
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {tag.name}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {tag.nameNormalized}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {tag.isActive ? (
                <Tag color="success">Active</Tag>
              ) : (
                <Tag color="default">Inactive</Tag>
              )}
              {tag.isDeleted ? (
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
          <Descriptions.Item label="Tag ID">{tag.tagId}</Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {tag.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name">
            <Typography.Text style={wrappingTextStyle}>
              {tag.name}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Name normalized">
            <Typography.Text style={wrappingTextStyle}>
              {tag.nameNormalized}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            <Typography.Text style={wrappingTextStyle}>
              {tag.description || "N/A"}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {tag.isActive ? (
              <Tag color="success">Active</Tag>
            ) : (
              <Tag color="default">Inactive</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted">
            {tag.isDeleted ? (
              <Tag color="error">Deleted</Tag>
            ) : (
              <Tag color="success">Visible</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{tag.version}</Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(tag.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(tag.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted at">
            {formatDateTime(tag.deletedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={12} wrap>
          <Button
            icon={<EditOutlined />}
            onClick={openEditModal}
            loading={updateTagMutation.isPending}
            disabled={tag.isDeleted || isActionPending}
          >
            Edit tag
          </Button>

          {tag.isDeleted ? (
            <Popconfirm
              title="Restore tag?"
              okText="Restore"
              cancelText="Cancel"
              onConfirm={() =>
                runTagAction(
                  () =>
                    restoreTagMutation.mutateAsync({
                      tagId: tag.tagId,
                      expectedVersion: tag.version,
                    }),
                  "Tag restored",
                  "Could not restore tag.",
                )
              }
            >
              <Button
                type="primary"
                icon={<UndoOutlined />}
                loading={restoreTagMutation.isPending}
                disabled={isActionPending}
              >
                Restore
              </Button>
            </Popconfirm>
          ) : (
            <Popconfirm
              title="Delete tag?"
              okText="Delete"
              okButtonProps={{ danger: true }}
              cancelText="Cancel"
              onConfirm={() =>
                runTagAction(
                  () =>
                    softDeleteTagMutation.mutateAsync({
                      tagId: tag.tagId,
                      expectedVersion: tag.version,
                    }),
                  "Tag deleted",
                  "Could not delete tag.",
                )
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                loading={softDeleteTagMutation.isPending}
                disabled={isActionPending}
              >
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      </Card>

      <Modal
        title="Edit tag"
        open={isEditModalOpen}
        okText="Save"
        confirmLoading={updateTagMutation.isPending}
        onOk={handleUpdateTag}
        onCancel={closeEditModal}
        forceRender
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
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
