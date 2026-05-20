import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  LinkOutlined,
  RollbackOutlined,
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
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import {
  AuthorizationAuditUser,
  type AuthorizationAuditUsersById,
} from "../../authorization/components/AuthorizationAuditUser";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import { useAdminMediaAssetDetail } from "../hooks/media-assets/useAdminMediaAssetDetail";
import { useAdminMediaAssetUsages } from "../hooks/media-assets/useAdminMediaAssetUsages";
import { useRestoreAdminMediaAsset } from "../hooks/media-assets/useRestoreAdminMediaAsset";
import { useSoftDeleteAdminMediaAsset } from "../hooks/media-assets/useSoftDeleteAdminMediaAsset";
import { useUpdateAdminMediaAsset } from "../hooks/media-assets/useUpdateAdminMediaAsset";
import type { AdminMediaAssetUsageItem } from "../types/adminMediaAsset.types";
import {
  formatBytes,
  formatDateTime,
  formatDimensions,
  getArticleMediaPath,
  getMediaSourceUrl,
  preWrapTextStyle,
  renderBooleanTag,
  renderDeletedTag,
  renderMediaDetailPreview,
  renderMediaPreview,
  renderMediaTypeTag,
  renderOptionalText,
  toNullableString,
  wrappingTextStyle,
} from "../utils/mediaUi";

type EditMediaAssetFormValues = {
  altText?: string;
  metadataJson?: string;
};

type DeleteMediaAssetFormValues = {
  restoreUntil?: string;
};

function parseMediaAuditUserId(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);

  return Number.isSafeInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : null;
}

function getMediaAuditUserIds(values: Array<string | null | undefined>) {
  return values
    .map(parseMediaAuditUserId)
    .filter((userId): userId is number => userId !== null);
}

function renderMediaAuditUser(
  value: string | null | undefined,
  usersById: AuthorizationAuditUsersById,
  isFetchingUsers: boolean,
) {
  const userId = parseMediaAuditUserId(value);

  if (!userId) {
    return renderOptionalText(value);
  }

  return (
    <AuthorizationAuditUser
      userId={userId}
      usersById={usersById}
      isFetchingUsers={isFetchingUsers}
      fallbackLabel={`User #${userId}`}
    />
  );
}

function getUsageColumns(): TableProps<AdminMediaAssetUsageItem>["columns"] {
  return [
    {
      title: "Article",
      key: "article",
      fixed: "left",
      width: 160,
      render: (_, usage) => (
        <Typography.Text strong>#{usage.articleId}</Typography.Text>
      ),
    },
    {
      title: "Primary",
      dataIndex: "isPrimary",
      key: "isPrimary",
      width: 120,
      render: (isPrimary: boolean) =>
        renderBooleanTag(isPrimary, "Primary", "Secondary"),
    },
    {
      title: "Deleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: renderDeletedTag,
    },
    {
      title: "Sort order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 120,
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Alt override",
      dataIndex: "altTextOverride",
      key: "altTextOverride",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Set version",
      dataIndex: "attachmentSetVersion",
      key: "attachmentSetVersion",
      width: 130,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 100,
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
  ];
}

export function MediaAssetDetailPage() {
  const { mediaId } = useParams();
  const parsedMediaId = Number(mediaId);
  const selectedMediaId =
    Number.isSafeInteger(parsedMediaId) && parsedMediaId > 0
      ? parsedMediaId
      : null;
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [editForm] = Form.useForm<EditMediaAssetFormValues>();
  const [deleteForm] = Form.useForm<DeleteMediaAssetFormValues>();
  const [includeDeletedUsages, setIncludeDeletedUsages] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const assetDetailQuery = useAdminMediaAssetDetail(selectedMediaId ?? 0);
  const asset = assetDetailQuery.data;
  const auditUsersQuery = useAdminUserDetails(
    getMediaAuditUserIds([
      asset?.createdBy,
      asset?.updatedBy,
      asset?.deletedBy,
      asset?.restoredBy,
    ]),
  );
  const usagesQuery = useAdminMediaAssetUsages(
    selectedMediaId ?? 0,
    includeDeletedUsages,
  );
  const updateMediaAssetMutation = useUpdateAdminMediaAsset();
  const softDeleteMediaAssetMutation = useSoftDeleteAdminMediaAsset();
  const restoreMediaAssetMutation = useRestoreAdminMediaAsset();
  const usageColumns = getUsageColumns();

  function openEditModal() {
    if (!asset) {
      return;
    }

    editForm.setFieldsValue({
      altText: asset.altText ?? "",
      metadataJson: asset.metadataJson ?? "",
    });
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setIsEditModalOpen(false);
    editForm.resetFields();
  }

  function openDeleteModal() {
    deleteForm.setFieldsValue({
      restoreUntil: asset?.restoreUntil ?? "",
    });
    setIsDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setIsDeleteModalOpen(false);
    deleteForm.resetFields();
  }

  async function handleUpdateAsset() {
    if (!selectedMediaId) {
      return;
    }

    const values = await editForm.validateFields();

    try {
      await updateMediaAssetMutation.mutateAsync({
        mediaId: selectedMediaId,
        request: {
          altText: toNullableString(values.altText),
          metadataJson: toNullableString(values.metadataJson),
        },
      });

      notification.success({
        message: "Media asset updated",
        placement: "topRight",
      });
      closeEditModal();
    } catch {
      notification.error({
        message: "Could not update media asset.",
        placement: "topRight",
      });
    }
  }

  async function handleDeleteAsset() {
    if (!selectedMediaId) {
      return;
    }

    const values = await deleteForm.validateFields();

    try {
      await softDeleteMediaAssetMutation.mutateAsync({
        mediaId: selectedMediaId,
        request: {
          restoreUntil: toNullableString(values.restoreUntil),
        },
      });

      notification.success({
        message: "Media asset deleted",
        placement: "topRight",
      });
      closeDeleteModal();
    } catch {
      notification.error({
        message: "Could not delete media asset.",
        placement: "topRight",
      });
    }
  }

  async function handleRestoreAsset() {
    if (!selectedMediaId) {
      return;
    }

    try {
      await restoreMediaAssetMutation.mutateAsync(selectedMediaId);

      notification.success({
        message: "Media asset restored",
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Could not restore media asset.",
        placement: "topRight",
      });
    }
  }

  if (!selectedMediaId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid media asset id.</Typography.Text>
      </Card>
    );
  }

  if (assetDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!asset) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Media asset information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.MEDIA_ASSETS)}
      >
        Back to media assets
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          {renderMediaPreview(asset, 112)}

          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {asset.fileName}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {asset.publicId}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {renderMediaTypeTag(asset.mediaType)}
              {renderDeletedTag(asset.isDeleted)}
              <Tag>{asset.storageProvider}</Tag>
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Media ID">{asset.mediaId}</Descriptions.Item>
          <Descriptions.Item label="Public ID">
            <Typography.Text style={wrappingTextStyle}>
              {asset.publicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="URL">
            {renderOptionalText(asset.url)}
          </Descriptions.Item>
          <Descriptions.Item label="Storage path">
            {renderOptionalText(asset.storagePath)}
          </Descriptions.Item>
          <Descriptions.Item label="MIME type">
            {renderOptionalText(asset.mimeType)}
          </Descriptions.Item>
          <Descriptions.Item label="File size">
            {formatBytes(asset.fileSizeBytes)}
          </Descriptions.Item>
          <Descriptions.Item label="Dimensions">
            {formatDimensions(asset.width, asset.height)}
          </Descriptions.Item>
          <Descriptions.Item label="Duration">
            {asset.durationSeconds ? `${asset.durationSeconds}s` : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Alt text">
            {renderOptionalText(asset.altText)}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{asset.version}</Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(asset.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Created by">
            {renderMediaAuditUser(
              asset.createdBy,
              auditUsersQuery.usersById,
              auditUsersQuery.isFetching,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(asset.updatedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            {renderMediaAuditUser(
              asset.updatedBy,
              auditUsersQuery.usersById,
              auditUsersQuery.isFetching,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted at">
            {formatDateTime(asset.deletedAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Deleted by">
            {renderMediaAuditUser(
              asset.deletedBy,
              auditUsersQuery.usersById,
              auditUsersQuery.isFetching,
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Restore until">
            {formatDateTime(asset.restoreUntil)}
          </Descriptions.Item>
          <Descriptions.Item label="Restored at">
            {formatDateTime(asset.restoredAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Restored by">
            {renderMediaAuditUser(
              asset.restoredBy,
              auditUsersQuery.usersById,
              auditUsersQuery.isFetching,
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Preview" style={{ marginTop: 16 }}>
        {renderMediaDetailPreview(asset)}
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={12} wrap>
          <Button icon={<EditOutlined />} onClick={openEditModal}>
            Edit metadata
          </Button>

          <Button
            icon={<LinkOutlined />}
            href={getMediaSourceUrl(asset.url)}
            target="_blank"
            rel="noreferrer"
          >
            Open source
          </Button>

          {asset.isDeleted ? (
            <Popconfirm
              title="Restore media asset?"
              okText="Restore"
              cancelText="Cancel"
              onConfirm={handleRestoreAsset}
            >
              <Button
                icon={<RollbackOutlined />}
                loading={restoreMediaAssetMutation.isPending}
              >
                Restore
              </Button>
            </Popconfirm>
          ) : (
            <Button
              danger
              icon={<DeleteOutlined />}
              loading={softDeleteMediaAssetMutation.isPending}
              onClick={openDeleteModal}
            >
              Delete
            </Button>
          )}
        </Space>
      </Card>

      <Card
        title="Article usages"
        style={{ marginTop: 16 }}
        extra={
          <Checkbox
            checked={includeDeletedUsages}
            onChange={(event) => setIncludeDeletedUsages(event.target.checked)}
          >
            Include deleted
          </Checkbox>
        }
      >
        <Table<AdminMediaAssetUsageItem>
          bordered
          rowKey={(usage) => String(usage.articleMediaId)}
          columns={usageColumns}
          dataSource={usagesQuery.data?.items ?? []}
          loading={usagesQuery.isFetching}
          scroll={{ x: 1650 }}
          locale={{
            emptyText: usagesQuery.isError
              ? "Could not load media usages."
              : "No article usages found.",
          }}
          pagination={false}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(usage) => ({
            onClick: () => navigate(getArticleMediaPath(usage.articleId)),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Card title="Metadata JSON" style={{ marginTop: 16 }}>
        <Typography.Text style={preWrapTextStyle}>
          {asset.metadataJson || "N/A"}
        </Typography.Text>
      </Card>

      <Modal
        title="Edit media metadata"
        open={isEditModalOpen}
        okText="Save"
        width={680}
        confirmLoading={updateMediaAssetMutation.isPending}
        onOk={handleUpdateAsset}
        onCancel={closeEditModal}
        destroyOnHidden
      >
        <Form form={editForm} layout="vertical" requiredMark={false}>
          <Form.Item label="Alt text" name="altText">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>

          <Form.Item label="Metadata JSON" name="metadataJson">
            <Input.TextArea autoSize={{ minRows: 4, maxRows: 10 }} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Delete media asset"
        open={isDeleteModalOpen}
        okText="Delete"
        okButtonProps={{ danger: true }}
        confirmLoading={softDeleteMediaAssetMutation.isPending}
        onOk={handleDeleteAsset}
        onCancel={closeDeleteModal}
        destroyOnHidden
      >
        <Form form={deleteForm} layout="vertical" requiredMark={false}>
          <Form.Item label="Restore until" name="restoreUntil">
            <Input placeholder="2026-05-19T12:00:00Z" autoComplete="off" />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
