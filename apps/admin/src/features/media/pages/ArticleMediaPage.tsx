import {
  ArrowLeftOutlined,
  DisconnectOutlined,
  FileImageOutlined,
  LinkOutlined,
  PlusOutlined,
  StarOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
} from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Form,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  type TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { useAdminArticleDetail } from "../../content/hooks/article/useAdminArticleDetail";
import { ADMIN_MEDIA_TYPE_OPTIONS } from "../constants/mediaConstants";
import { useAdminArticleMedia } from "../hooks/article-media/useAdminArticleMedia";
import { useAdminArticleMediaState } from "../hooks/article-media/useAdminArticleMediaState";
import { useAdminArticlePrimaryMedia } from "../hooks/article-media/useAdminArticlePrimaryMedia";
import { useAttachMediaToArticle } from "../hooks/article-media/useAttachMediaToArticle";
import { useDetachMediaFromArticle } from "../hooks/article-media/useDetachMediaFromArticle";
import { useReorderArticleMedia } from "../hooks/article-media/useReorderArticleMedia";
import { useSetPrimaryArticleMedia } from "../hooks/article-media/useSetPrimaryArticleMedia";
import { useAdminMediaAssets } from "../hooks/media-assets/useAdminMediaAssets";
import type { AdminArticleMediaItem } from "../types/adminArticleMedia.types";
import type {
  AdminMediaAsset,
  AdminMediaAssetType,
} from "../types/adminMediaAsset.types";
import {
  formatBytes,
  formatDateTime,
  formatDimensions,
  getMediaAssetPath,
  renderBooleanTag,
  renderDeletedTag,
  renderMediaPreview,
  renderMediaTypeTag,
  renderOptionalText,
  wrappingTextStyle,
} from "../utils/mediaUi";

type AttachMediaFormValues = {
  isPrimary?: boolean;
};

type ReorderDirection = "up" | "down";

function getArticleMediaColumns({
  canMoveDown,
  canMoveUp,
  detachMedia,
  isActionPending,
  moveMedia,
  navigate,
  setPrimary,
}: {
  canMoveDown: (mediaId: number) => boolean;
  canMoveUp: (mediaId: number) => boolean;
  detachMedia: (mediaId: number) => void;
  isActionPending: boolean;
  moveMedia: (mediaId: number, direction: ReorderDirection) => void;
  navigate: ReturnType<typeof useNavigate>;
  setPrimary: (item: AdminArticleMediaItem) => void;
}): TableProps<AdminArticleMediaItem>["columns"] {
  return [
    {
      title: "Preview",
      key: "preview",
      fixed: "left",
      width: 110,
      render: (_, item) => renderMediaPreview(item, 64),
    },
    {
      title: "Media",
      key: "media",
      fixed: "left",
      width: 340,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 290 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {item.fileName}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.publicId}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "mediaType",
      key: "mediaType",
      width: 120,
      render: renderMediaTypeTag,
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
      title: "Attachment",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 130,
      render: renderDeletedTag,
    },
    {
      title: "Asset",
      dataIndex: "mediaIsDeleted",
      key: "mediaIsDeleted",
      width: 120,
      render: (mediaIsDeleted: boolean) =>
        mediaIsDeleted ? (
          <Tag color="error">Deleted</Tag>
        ) : (
          <Tag color="success">Available</Tag>
        ),
    },
    {
      title: "Sort order",
      dataIndex: "sortOrder",
      key: "sortOrder",
      width: 120,
    },
    {
      title: "Size",
      dataIndex: "fileSizeBytes",
      key: "fileSizeBytes",
      width: 120,
      render: formatBytes,
    },
    {
      title: "Dimensions",
      key: "dimensions",
      width: 140,
      render: (_, item) => formatDimensions(item.width, item.height),
    },
    {
      title: "Alt",
      key: "alt",
      width: 260,
      render: (_, item) =>
        renderOptionalText(item.altTextOverride || item.defaultAltText),
    },
    {
      title: "Caption",
      dataIndex: "caption",
      key: "caption",
      width: 240,
      render: renderOptionalText,
    },
    {
      title: "Set version",
      dataIndex: "attachmentSetVersion",
      key: "attachmentSetVersion",
      width: 130,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 360,
      render: (_, item) => (
        <Space size={8} wrap>
          <Button
            icon={<LinkOutlined />}
            onClick={() => navigate(getMediaAssetPath(item.mediaId))}
          >
            Asset
          </Button>

          <Button
            icon={<StarOutlined />}
            disabled={item.isPrimary || item.isDeleted || isActionPending}
            onClick={() => setPrimary(item)}
          >
            Primary
          </Button>

          <Button
            icon={<VerticalAlignTopOutlined />}
            disabled={!canMoveUp(item.mediaId) || item.isDeleted || isActionPending}
            onClick={() => moveMedia(item.mediaId, "up")}
          />

          <Button
            icon={<VerticalAlignBottomOutlined />}
            disabled={
              !canMoveDown(item.mediaId) || item.isDeleted || isActionPending
            }
            onClick={() => moveMedia(item.mediaId, "down")}
          />

          <Popconfirm
            title="Detach media from article?"
            description="This only removes the article attachment. The media asset and stored file remain in the Media Library."
            okText="Detach"
            cancelText="Cancel"
            onConfirm={() => detachMedia(item.mediaId)}
          >
            <Button
              icon={<DisconnectOutlined />}
              disabled={item.isDeleted || isActionPending}
            >
              Detach
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
}

function getMediaPickerColumns(
  attachedMediaIds: Set<number>,
): TableProps<AdminMediaAsset>["columns"] {
  return [
    {
      title: "Preview",
      key: "preview",
      fixed: "left",
      width: 96,
      render: (_, asset) => renderMediaPreview(asset, 56),
    },
    {
      title: "Asset",
      key: "asset",
      fixed: "left",
      width: 320,
      render: (_, asset) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Space size={6} wrap>
            <Typography.Text strong style={wrappingTextStyle}>
              {asset.fileName}
            </Typography.Text>
            {attachedMediaIds.has(asset.mediaId) && (
              <Tag color="processing">Attached</Tag>
            )}
          </Space>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {asset.publicId}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "mediaType",
      key: "mediaType",
      width: 120,
      render: renderMediaTypeTag,
    },
    {
      title: "Size",
      dataIndex: "fileSizeBytes",
      key: "fileSizeBytes",
      width: 120,
      render: formatBytes,
    },
    {
      title: "Dimensions",
      key: "dimensions",
      width: 140,
      render: (_, asset) => formatDimensions(asset.width, asset.height),
    },
    {
      title: "Alt text",
      dataIndex: "altText",
      key: "altText",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: formatDateTime,
    },
  ];
}

export function ArticleMediaPage() {
  const { articleId } = useParams();
  const parsedArticleId = Number(articleId);
  const selectedArticleId =
    Number.isSafeInteger(parsedArticleId) && parsedArticleId > 0
      ? parsedArticleId
      : null;
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [attachForm] = Form.useForm<AttachMediaFormValues>();
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [pickerMediaType, setPickerMediaType] = useState<AdminMediaAssetType>();
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerPageSize, setPickerPageSize] = useState(10);
  const [selectedPickerMediaId, setSelectedPickerMediaId] = useState<number | null>(
    null,
  );

  const articleDetailQuery = useAdminArticleDetail(selectedArticleId ?? 0);
  const article = articleDetailQuery.data;
  const articleMediaQuery = useAdminArticleMedia(selectedArticleId ?? 0, {
    page,
    pageSize,
    includeDeleted,
  });
  const primaryMediaQuery = useAdminArticlePrimaryMedia(selectedArticleId ?? 0);
  const mediaStateQuery = useAdminArticleMediaState(selectedArticleId ?? 0);
  const mediaPickerQuery = useAdminMediaAssets({
    page: pickerPage,
    pageSize: pickerPageSize,
    isDeleted: false,
    mediaType: pickerMediaType ?? null,
  });
  const attachMediaMutation = useAttachMediaToArticle();
  const detachMediaMutation = useDetachMediaFromArticle();
  const setPrimaryMutation = useSetPrimaryArticleMedia();
  const reorderMediaMutation = useReorderArticleMedia();
  const currentItems = [...(articleMediaQuery.data?.items ?? [])].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const attachedMediaIds = new Set(
    currentItems
      .filter((item) => !item.isDeleted)
      .map((item) => item.mediaId),
  );
  const currentVersion =
    mediaStateQuery.data?.version ?? currentItems[0]?.attachmentSetVersion ?? 0;
  const isActionPending =
    attachMediaMutation.isPending ||
    detachMediaMutation.isPending ||
    setPrimaryMutation.isPending ||
    reorderMediaMutation.isPending;

  function openAttachModal() {
    attachForm.setFieldsValue({
      isPrimary: false,
    });
    setPickerMediaType(undefined);
    setPickerPage(1);
    setSelectedPickerMediaId(null);
    setIsAttachModalOpen(true);
  }

  function closeAttachModal() {
    setIsAttachModalOpen(false);
    attachForm.resetFields();
    setSelectedPickerMediaId(null);
  }

  function canMoveMedia(mediaId: number, direction: ReorderDirection) {
    const index = currentItems.findIndex((item) => item.mediaId === mediaId);

    if (direction === "up") {
      return index > 0;
    }

    return index >= 0 && index < currentItems.length - 1;
  }

  async function handleAttachMedia() {
    if (!selectedArticleId) {
      return;
    }

    if (!selectedPickerMediaId) {
      notification.warning({
        title: "Select a media asset to attach.",
        placement: "topRight",
      });
      return;
    }

    const values = attachForm.getFieldsValue();

    try {
      await attachMediaMutation.mutateAsync({
        articleId: selectedArticleId,
        request: {
          mediaId: selectedPickerMediaId,
          isPrimary: Boolean(values.isPrimary),
        },
      });

      notification.success({
        title: "Media attached to article",
        placement: "topRight",
      });
      setPage(1);
      closeAttachModal();
    } catch (error) {
      notification.error({
        title: "Could not attach media to article.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function handleDetachMedia(mediaId: number) {
    if (!selectedArticleId) {
      return;
    }

    try {
      await detachMediaMutation.mutateAsync({
        articleId: selectedArticleId,
        mediaId,
      });

      notification.success({
        title: "Media detached from article",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        title: "Could not detach media from article.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function handleSetPrimary(item: AdminArticleMediaItem) {
    if (!selectedArticleId) {
      return;
    }

    try {
      await setPrimaryMutation.mutateAsync({
        articleId: selectedArticleId,
        request: {
          mediaId: item.mediaId,
          expectedVersion: currentVersion || item.attachmentSetVersion,
        },
      });

      notification.success({
        title: "Primary media updated",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        title: "Could not update primary media.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function handleMoveMedia(mediaId: number, direction: ReorderDirection) {
    if (!selectedArticleId) {
      return;
    }

    const index = currentItems.findIndex((item) => item.mediaId === mediaId);
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (index < 0 || swapIndex < 0 || swapIndex >= currentItems.length) {
      return;
    }

    const nextItems = [...currentItems];
    const currentItem = nextItems[index];
    const swapItem = nextItems[swapIndex];

    nextItems[index] = swapItem;
    nextItems[swapIndex] = currentItem;

    try {
      await reorderMediaMutation.mutateAsync({
        articleId: selectedArticleId,
        request: {
          expectedVersion: currentVersion || currentItem.attachmentSetVersion,
          items: nextItems.map((item, itemIndex) => ({
            mediaId: item.mediaId,
            sortOrder: itemIndex + 1,
          })),
        },
      });

      notification.success({
        title: "Article media reordered",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        title: "Could not reorder article media.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  const articleMediaColumns = getArticleMediaColumns({
    canMoveDown: (mediaId) => canMoveMedia(mediaId, "down"),
    canMoveUp: (mediaId) => canMoveMedia(mediaId, "up"),
    detachMedia: handleDetachMedia,
    isActionPending,
    moveMedia: handleMoveMedia,
    navigate,
    setPrimary: handleSetPrimary,
  });
  const mediaPickerColumns = getMediaPickerColumns(attachedMediaIds);

  if (!selectedArticleId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid article id.</Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Space size={12} wrap>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(`${ROUTES.CONTENT_NEWS}/${selectedArticleId}`)}
        >
          Back to article
        </Button>

        <Button icon={<FileImageOutlined />} onClick={() => navigate(ROUTES.MEDIA_ASSETS)}>
          Media library
        </Button>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          {primaryMediaQuery.data ? (
            renderMediaPreview(primaryMediaQuery.data, 112)
          ) : (
            <div />
          )}

          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Article media
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {article?.title || `Article #${selectedArticleId}`}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              <Tag>Article #{selectedArticleId}</Tag>
              <Tag>Set version {currentVersion || "N/A"}</Tag>
              {articleDetailQuery.isError && <Tag color="warning">Article not loaded</Tag>}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Article ID">
            {selectedArticleId}
          </Descriptions.Item>
          <Descriptions.Item label="Attachment set version">
            {currentVersion || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Primary media">
            {primaryMediaQuery.data
              ? `${primaryMediaQuery.data.fileName} (#${primaryMediaQuery.data.mediaId})`
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Primary URL">
            {renderOptionalText(primaryMediaQuery.data?.url)}
          </Descriptions.Item>
          <Descriptions.Item label="Set created at">
            {formatDateTime(mediaStateQuery.data?.createdAt)}
          </Descriptions.Item>
          <Descriptions.Item label="Set updated at">
            {formatDateTime(mediaStateQuery.data?.updatedAt)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Attachments"
        style={{ marginTop: 16 }}
        extra={
          <Space size={12} wrap>
            <Checkbox
              checked={includeDeleted}
              onChange={(event) => {
                setIncludeDeleted(event.target.checked);
                setPage(1);
              }}
            >
              Include deleted
            </Checkbox>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAttachModal}
            >
              Attach media
            </Button>
          </Space>
        }
      >
        <Table<AdminArticleMediaItem>
          bordered
          rowKey={(item) => String(item.articleMediaId)}
          columns={articleMediaColumns}
          dataSource={articleMediaQuery.data?.items ?? []}
          loading={
            articleMediaQuery.isFetching ||
            mediaStateQuery.isFetching ||
            primaryMediaQuery.isFetching
          }
          scroll={{ x: 2630 }}
          locale={{
            emptyText: articleMediaQuery.isError
              ? "Could not load article media."
              : "No media attached.",
          }}
          pagination={{
            current: articleMediaQuery.data?.page ?? page,
            pageSize: articleMediaQuery.data?.pageSize ?? pageSize,
            total: articleMediaQuery.data?.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} attachments`,
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
        />
      </Card>

      <Modal
        title="Attach media"
        open={isAttachModalOpen}
        okText="Attach"
        width={960}
        confirmLoading={attachMediaMutation.isPending}
        okButtonProps={{ disabled: !selectedPickerMediaId }}
        onOk={handleAttachMedia}
        onCancel={closeAttachModal}
        forceRender
        destroyOnHidden
      >
        <Form form={attachForm} layout="vertical" requiredMark={false}>
          <Space size={12} wrap style={{ marginBottom: 12 }}>
            <Select<AdminMediaAssetType>
              allowClear
              placeholder="Media type"
              value={pickerMediaType}
              onChange={(value) => {
                setPickerMediaType(value);
                setPickerPage(1);
                setSelectedPickerMediaId(null);
              }}
              options={ADMIN_MEDIA_TYPE_OPTIONS}
              style={{ width: 170 }}
            />

            {selectedPickerMediaId && (
              <Tag color="processing">Selected #{selectedPickerMediaId}</Tag>
            )}
          </Space>

          <Table<AdminMediaAsset>
            bordered
            rowKey={(asset) => String(asset.mediaId)}
            columns={mediaPickerColumns}
            dataSource={mediaPickerQuery.data?.items ?? []}
            loading={mediaPickerQuery.isFetching}
            rowSelection={{
              type: "radio",
              selectedRowKeys: selectedPickerMediaId
                ? [String(selectedPickerMediaId)]
                : [],
              getCheckboxProps: (asset) => ({
                disabled: attachedMediaIds.has(asset.mediaId),
              }),
              onChange: (selectedRowKeys) => {
                const selectedKey = selectedRowKeys[0];
                setSelectedPickerMediaId(
                  selectedKey ? Number(selectedKey) : null,
                );
              },
            }}
            scroll={{ x: 1246, y: 360 }}
            locale={{
              emptyText: mediaPickerQuery.isError
                ? "Could not load media assets."
                : "No media assets found.",
            }}
            pagination={{
              current: mediaPickerQuery.data?.page ?? pickerPage,
              pageSize: mediaPickerQuery.data?.pageSize ?? pickerPageSize,
              total: mediaPickerQuery.data?.totalItems ?? 0,
              showSizeChanger: true,
              showTotal: (total) => `${total} media assets`,
              onChange: (nextPage, nextPageSize) => {
                setPickerPage(nextPage);
                setPickerPageSize(nextPageSize);
                setSelectedPickerMediaId(null);
              },
            }}
            style={{
              border: "1px solid #f0f0f0",
              borderRadius: 8,
              marginBottom: 16,
              overflow: "hidden",
            }}
            onRow={(asset) => ({
              onClick: () => {
                if (!attachedMediaIds.has(asset.mediaId)) {
                  setSelectedPickerMediaId(asset.mediaId);
                }
              },
              style: {
                cursor: attachedMediaIds.has(asset.mediaId)
                  ? "not-allowed"
                  : "pointer",
              },
            })}
          />

          <Form.Item name="isPrimary" valuePropName="checked">
            <Checkbox>Set as primary</Checkbox>
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
