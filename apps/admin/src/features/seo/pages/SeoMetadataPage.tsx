import { Card, Input, InputNumber, Select, Space, Table, Tag, type TableProps, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { createTablePagination } from "../../../shared/pagination";
import {
  SEO_RESOURCE_TYPE_SELECT_OPTIONS,
  SEO_SCOPE_SELECT_OPTIONS,
  type SeoResourceType,
  type SeoScope,
} from "../constants/seoConstants";
import { useAdminSeoMetadata } from "../hooks/metadata/useAdminSeoMetadata";
import type { AdminSeoMetadataListItem } from "../types/adminSeoMetadata.types";
import {
  formatDateTime,
  renderOptionalText,
  renderResourceTypeTag,
  renderScopeTag,
  wrappingTextStyle,
} from "../utils/seoUi";

type ManualOverrideFilter = "all" | "manual" | "synced";

function getManualOverrideFilterValue(filter: ManualOverrideFilter) {
  if (filter === "all") {
    return undefined;
  }

  return filter === "manual";
}

function getSeoMetadataColumns(): TableProps<AdminSeoMetadataListItem>["columns"] {
  return [
    {
      title: "Metadata",
      key: "metadata",
      fixed: "left",
      width: 360,
      render: (_, metadata) => (
        <div style={{ minWidth: 0, maxWidth: 310 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {metadata.metaTitle || "Untitled metadata"}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {metadata.metaDescription || "No meta description"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Resource",
      key: "resource",
      width: 320,
      render: (_, metadata) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Space size={6} wrap>
            {renderScopeTag(metadata.scope)}
            {renderResourceTypeTag(metadata.resourceType)}
          </Space>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {metadata.resourcePublicId}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Canonical URL",
      dataIndex: "canonicalUrl",
      key: "canonicalUrl",
      width: 320,
      render: renderOptionalText,
    },
    {
      title: "Robots",
      dataIndex: "robots",
      key: "robots",
      width: 160,
      render: (robots: string | null) =>
        robots ? <Tag color="processing">{robots}</Tag> : <Tag>N/A</Tag>,
    },
    {
      title: "Override",
      dataIndex: "isManualOverride",
      key: "isManualOverride",
      width: 130,
      render: (isManualOverride: boolean) =>
        isManualOverride ? (
          <Tag color="warning">Manual</Tag>
        ) : (
          <Tag color="default">Synced</Tag>
        ),
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 110,
    },
    {
      title: "Source version",
      dataIndex: "sourceAggregateVersion",
      key: "sourceAggregateVersion",
      width: 150,
      render: (version: number | null) => version ?? "N/A",
    },
    {
      title: "Updated by",
      dataIndex: "updatedByUserId",
      key: "updatedByUserId",
      width: 130,
      render: (userId: number | null) => userId ?? "N/A",
    },
    {
      title: "Last synced",
      dataIndex: "lastSyncedAtUtc",
      key: "lastSyncedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Updated at",
      dataIndex: "updatedAtUtc",
      key: "updatedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Created at",
      dataIndex: "createdAtUtc",
      key: "createdAtUtc",
      width: 190,
      render: formatDateTime,
    },
  ];
}

export function SeoMetadataPage() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [resourcePublicId, setResourcePublicId] = useState("");
  const [submittedResourcePublicId, setSubmittedResourcePublicId] = useState("");
  const [scope, setScope] = useState<SeoScope>();
  const [resourceType, setResourceType] = useState<SeoResourceType>();
  const [manualOverrideFilter, setManualOverrideFilter] =
    useState<ManualOverrideFilter>("all");
  const [updatedByUserId, setUpdatedByUserId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const metadataQuery = useAdminSeoMetadata({
    page,
    pageSize,
    keyword: submittedKeyword || null,
    scope: scope ?? null,
    resourceType: resourceType ?? null,
    resourcePublicId: submittedResourcePublicId || null,
    isManualOverride: getManualOverrideFilterValue(manualOverrideFilter),
    updatedByUserId,
  });
  const metadataColumns = getSeoMetadataColumns();

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        SEO metadata
      </Typography.Title>

      <Card style={{ marginTop: 24 }}>
        <Space size={12} wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Search metadata"
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

          <Input.Search
            allowClear
            placeholder="Resource public ID"
            value={resourcePublicId}
            onChange={(event) => {
              const nextResourcePublicId = event.target.value;
              setResourcePublicId(nextResourcePublicId);

              if (!nextResourcePublicId) {
                setSubmittedResourcePublicId("");
                setPage(1);
              }
            }}
            onSearch={(value) => {
              setSubmittedResourcePublicId(value.trim());
              setPage(1);
            }}
            style={{ width: 260 }}
          />

          <Select<SeoScope>
            allowClear
            placeholder="Scope"
            value={scope}
            onChange={(value) => {
              setScope(value);
              setPage(1);
            }}
            options={[...SEO_SCOPE_SELECT_OPTIONS]}
            style={{ width: 150 }}
          />

          <Select<SeoResourceType>
            allowClear
            placeholder="Resource"
            value={resourceType}
            onChange={(value) => {
              setResourceType(value);
              setPage(1);
            }}
            options={[...SEO_RESOURCE_TYPE_SELECT_OPTIONS]}
            style={{ width: 160 }}
          />

          <Select<ManualOverrideFilter>
            value={manualOverrideFilter}
            onChange={(value) => {
              setManualOverrideFilter(value);
              setPage(1);
            }}
            options={[
              { label: "All sources", value: "all" },
              { label: "Manual", value: "manual" },
              { label: "Synced", value: "synced" },
            ]}
            style={{ width: 150 }}
          />

          <InputNumber<number>
            min={1}
            precision={0}
            placeholder="Updated by"
            value={updatedByUserId}
            onChange={(value) => {
              setUpdatedByUserId(value ?? null);
              setPage(1);
            }}
            style={{ width: 140 }}
          />
        </Space>

        <Table<AdminSeoMetadataListItem>
          bordered
          rowKey={(metadata) => String(metadata.seoId)}
          columns={metadataColumns}
          dataSource={metadataQuery.data?.items ?? []}
          loading={metadataQuery.isFetching}
          scroll={{ x: 2390 }}
          locale={{
            emptyText: metadataQuery.isError
              ? "Could not load SEO metadata."
              : "No SEO metadata found.",
          }}
          pagination={createTablePagination(
            metadataQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} metadata records`,
          )}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(metadata) => ({
            onClick: () => navigate(`${ROUTES.SEO_METADATA}/${metadata.seoId}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </section>
  );
}
