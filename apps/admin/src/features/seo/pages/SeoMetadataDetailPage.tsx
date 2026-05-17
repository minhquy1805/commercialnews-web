import { ArrowLeftOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Skeleton, Space, Tag, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminSeoMetadataDetail } from "../hooks/metadata/useAdminSeoMetadataDetail";
import {
  buildArticleSeoSettingsPath,
  formatDateTime,
  isArticleResource,
  renderOptionalText,
  renderResourceTypeTag,
  renderScopeTag,
  wrappingTextStyle,
} from "../utils/seoUi";

export function SeoMetadataDetailPage() {
  const { seoId } = useParams();
  const parsedSeoId = Number(seoId);
  const selectedSeoId =
    Number.isSafeInteger(parsedSeoId) && parsedSeoId > 0 ? parsedSeoId : null;
  const navigate = useNavigate();
  const metadataDetailQuery = useAdminSeoMetadataDetail(selectedSeoId ?? 0);
  const metadata = metadataDetailQuery.data;

  if (!selectedSeoId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid SEO metadata id.</Typography.Text>
      </Card>
    );
  }

  if (metadataDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!metadata) {
    return (
      <Card>
        <Typography.Text type="secondary">
          SEO metadata information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.SEO_METADATA)}
      >
        Back to SEO metadata
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {metadata.metaTitle || `SEO metadata #${metadata.seoId}`}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {metadata.metaDescription || "No meta description"}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {renderScopeTag(metadata.scope)}
              {renderResourceTypeTag(metadata.resourceType)}
              {metadata.isManualOverride ? (
                <Tag color="warning">Manual</Tag>
              ) : (
                <Tag color="default">Synced</Tag>
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="SEO ID">{metadata.seoId}</Descriptions.Item>
          <Descriptions.Item label="Resource public ID">
            <Typography.Text style={wrappingTextStyle}>
              {metadata.resourcePublicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Scope">
            {renderScopeTag(metadata.scope)}
          </Descriptions.Item>
          <Descriptions.Item label="Resource type">
            {renderResourceTypeTag(metadata.resourceType)}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {renderOptionalText(metadata.slug)}
          </Descriptions.Item>
          <Descriptions.Item label="Canonical URL">
            {renderOptionalText(metadata.canonicalUrl)}
          </Descriptions.Item>
          <Descriptions.Item label="Meta title">
            {renderOptionalText(metadata.metaTitle)}
          </Descriptions.Item>
          <Descriptions.Item label="Meta description">
            {renderOptionalText(metadata.metaDescription)}
          </Descriptions.Item>
          <Descriptions.Item label="OG title">
            {renderOptionalText(metadata.ogTitle)}
          </Descriptions.Item>
          <Descriptions.Item label="OG description">
            {renderOptionalText(metadata.ogDescription)}
          </Descriptions.Item>
          <Descriptions.Item label="OG image URL">
            {renderOptionalText(metadata.ogImageUrl)}
          </Descriptions.Item>
          <Descriptions.Item label="Twitter title">
            {renderOptionalText(metadata.twitterTitle)}
          </Descriptions.Item>
          <Descriptions.Item label="Twitter description">
            {renderOptionalText(metadata.twitterDescription)}
          </Descriptions.Item>
          <Descriptions.Item label="Twitter image URL">
            {renderOptionalText(metadata.twitterImageUrl)}
          </Descriptions.Item>
          <Descriptions.Item label="Robots">
            {metadata.robots ? (
              <Tag color="processing">{metadata.robots}</Tag>
            ) : (
              <Tag>N/A</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Manual override">
            {metadata.isManualOverride ? (
              <Tag color="warning">Manual</Tag>
            ) : (
              <Tag color="default">Synced</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Version">{metadata.version}</Descriptions.Item>
          <Descriptions.Item label="Source version">
            {metadata.sourceAggregateVersion ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last applied message ID">
            {renderOptionalText(metadata.lastAppliedMessageId)}
          </Descriptions.Item>
          <Descriptions.Item label="Last synced">
            {formatDateTime(metadata.lastSyncedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(metadata.createdAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(metadata.updatedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            {metadata.updatedByUserId ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {isArticleResource(metadata.resourceType) && (
        <Card title="Actions" style={{ marginTop: 16 }}>
          <Button
            icon={<SettingOutlined />}
            onClick={() =>
              navigate(buildArticleSeoSettingsPath(metadata.resourcePublicId))
            }
          >
            Open article SEO settings
          </Button>
        </Card>
      )}
    </section>
  );
}
