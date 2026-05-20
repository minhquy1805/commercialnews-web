import { UploadOutlined } from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  type TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ADMIN_MEDIA_SORT_DIRECTIONS,
  ADMIN_MEDIA_TYPE_OPTIONS,
} from "../constants/mediaConstants";
import { useAdminMediaAssetPublicDetail } from "../hooks/media-assets/useAdminMediaAssetPublicDetail";
import { useAdminMediaAssets } from "../hooks/media-assets/useAdminMediaAssets";
import { useUploadAdminMediaAsset } from "../hooks/media-assets/useUploadAdminMediaAsset";
import type {
  AdminMediaAsset,
  AdminMediaAssetSortDirection,
  AdminMediaAssetType,
} from "../types/adminMediaAsset.types";
import {
  formatBytes,
  formatDateTime,
  formatDimensions,
  getMediaAssetPath,
  renderDeletedTag,
  renderMediaPreview,
  renderMediaTypeTag,
  renderOptionalText,
  toNullableString,
  wrappingTextStyle,
} from "../utils/mediaUi";

type UploadMediaAssetFormValues = {
  mediaType: AdminMediaAssetType;
  altText?: string;
};

type DeletedFilter = "all" | "active" | "deleted";

function getDeletedFilterValue(filter: DeletedFilter) {
  if (filter === "all") {
    return null;
  }

  return filter === "deleted";
}

function buildMediaAssetUploadMetadata(file: File) {
  return {
    source: "admin-web",
    module: "media",
    purpose: "media-asset",
    uploadedFrom: "media-assets-page",
    originalClientFileName: file.name,
    clientMimeType: file.type,
    clientFileSizeBytes: file.size,
  };
}

function getMediaAssetColumns(): TableProps<AdminMediaAsset>["columns"] {
  return [
    {
      title: "Preview",
      key: "preview",
      fixed: "left",
      width: 110,
      render: (_, asset) => renderMediaPreview(asset, 64),
    },
    {
      title: "Asset",
      key: "asset",
      fixed: "left",
      width: 340,
      render: (_, asset) => (
        <div style={{ minWidth: 0, maxWidth: 290 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {asset.fileName}
          </Typography.Text>
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
      title: "Status",
      dataIndex: "isDeleted",
      key: "isDeleted",
      width: 120,
      render: renderDeletedTag,
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
      title: "Provider",
      dataIndex: "storageProvider",
      key: "storageProvider",
      width: 150,
    },
    {
      title: "Alt text",
      dataIndex: "altText",
      key: "altText",
      width: 260,
      render: renderOptionalText,
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

export function MediaAssetsPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [uploadForm] = Form.useForm<UploadMediaAssetFormValues>();
  const [mediaType, setMediaType] = useState<AdminMediaAssetType>();
  const [lookupPublicId, setLookupPublicId] = useState("");
  const [submittedLookupPublicId, setSubmittedLookupPublicId] = useState("");
  const [deletedFilter, setDeletedFilter] = useState<DeletedFilter>("active");
  const [sortDirection, setSortDirection] =
    useState<AdminMediaAssetSortDirection>(ADMIN_MEDIA_SORT_DIRECTIONS.DESC);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null);

  const mediaAssetsQuery = useAdminMediaAssets({
    page,
    pageSize,
    isDeleted: getDeletedFilterValue(deletedFilter),
    mediaType: mediaType ?? null,
    sortDirection,
  });
  const publicDetailQuery = useAdminMediaAssetPublicDetail(submittedLookupPublicId);
  const uploadMediaAssetMutation = useUploadAdminMediaAsset();
  const mediaAssetColumns = getMediaAssetColumns();

  function openUploadModal() {
    uploadForm.setFieldsValue({
      mediaType: "Image",
      altText: "",
    });
    setSelectedUploadFile(null);
    setIsUploadModalOpen(true);
  }

  function closeUploadModal() {
    setIsUploadModalOpen(false);
    uploadForm.resetFields();
    setSelectedUploadFile(null);
  }

  async function handleUploadAsset() {
    const values = await uploadForm.validateFields();

    if (!selectedUploadFile) {
      notification.warning({
        message: "File is required.",
        placement: "topRight",
      });
      return;
    }

    try {
      await uploadMediaAssetMutation.mutateAsync({
        file: selectedUploadFile,
        mediaType: values.mediaType,
        altText: toNullableString(values.altText),
        metadataJson: JSON.stringify(
          buildMediaAssetUploadMetadata(selectedUploadFile),
        ),
      });

      notification.success({
        message: "Media asset uploaded",
        placement: "topRight",
      });
      setPage(1);
      closeUploadModal();
    } catch {
      notification.error({
        message: "Could not upload media asset.",
        placement: "topRight",
      });
    }
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Media assets
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
            <Select<AdminMediaAssetType>
              allowClear
              placeholder="Media type"
              value={mediaType}
              onChange={(value) => {
                setMediaType(value);
                setPage(1);
              }}
              options={ADMIN_MEDIA_TYPE_OPTIONS}
              style={{ width: 160 }}
            />

            <Select<DeletedFilter>
              value={deletedFilter}
              onChange={(value) => {
                setDeletedFilter(value);
                setPage(1);
              }}
              options={[
                { label: "Active", value: "active" },
                { label: "Deleted", value: "deleted" },
                { label: "All records", value: "all" },
              ]}
              style={{ width: 150 }}
            />

            <Select<AdminMediaAssetSortDirection>
              value={sortDirection}
              onChange={(value) => {
                setSortDirection(value);
                setPage(1);
              }}
              options={[
                { label: "Newest first", value: ADMIN_MEDIA_SORT_DIRECTIONS.DESC },
                { label: "Oldest first", value: ADMIN_MEDIA_SORT_DIRECTIONS.ASC },
              ]}
              style={{ width: 160 }}
            />

            <Input.Search
              allowClear
              placeholder="Open public ID"
              value={lookupPublicId}
              onChange={(event) => {
                const nextPublicId = event.target.value;
                setLookupPublicId(nextPublicId);

                if (!nextPublicId) {
                  setSubmittedLookupPublicId("");
                }
              }}
              onSearch={(value) => setSubmittedLookupPublicId(value.trim())}
              style={{ width: 260 }}
            />
          </Space>

          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={openUploadModal}
          >
            Upload
          </Button>
        </div>

        {publicDetailQuery.data && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
            message={`${publicDetailQuery.data.fileName} (#${publicDetailQuery.data.mediaId})`}
            action={
              <Button
                size="small"
                onClick={() =>
                  navigate(getMediaAssetPath(publicDetailQuery.data.mediaId))
                }
              >
                Open
              </Button>
            }
          />
        )}

        {submittedLookupPublicId && publicDetailQuery.isError && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Could not find media asset by public ID."
          />
        )}

        <Table<AdminMediaAsset>
          bordered
          rowKey={(asset) => String(asset.mediaId)}
          columns={mediaAssetColumns}
          dataSource={mediaAssetsQuery.data?.items ?? []}
          loading={mediaAssetsQuery.isFetching}
          scroll={{ x: 1840 }}
          locale={{
            emptyText: mediaAssetsQuery.isError
              ? "Could not load media assets."
              : "No media assets found.",
          }}
          pagination={{
            current: mediaAssetsQuery.data?.page ?? page,
            pageSize: mediaAssetsQuery.data?.pageSize ?? pageSize,
            total: mediaAssetsQuery.data?.totalItems ?? 0,
            showSizeChanger: true,
            showTotal: (total) => `${total} media assets`,
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
          onRow={(asset) => ({
            onClick: () => navigate(getMediaAssetPath(asset.mediaId)),
            style: { cursor: "pointer" },
          })}
        />
      </Card>

      <Modal
        title="Upload media asset"
        open={isUploadModalOpen}
        okText="Upload"
        width={680}
        confirmLoading={uploadMediaAssetMutation.isPending}
        onOk={handleUploadAsset}
        onCancel={closeUploadModal}
        destroyOnHidden
      >
        <Form form={uploadForm} layout="vertical" requiredMark={false}>
          <Form.Item label="File" required>
            <input
              type="file"
              onChange={(event) =>
                setSelectedUploadFile(event.target.files?.[0] ?? null)
              }
            />
          </Form.Item>

          <Form.Item
            label="Media type"
            name="mediaType"
            rules={[{ required: true, message: "Media type is required." }]}
          >
            <Select<AdminMediaAssetType> options={ADMIN_MEDIA_TYPE_OPTIONS} />
          </Form.Item>

          <Form.Item label="Alt text" name="altText">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </Form.Item>

        </Form>
      </Modal>
    </section>
  );
}
