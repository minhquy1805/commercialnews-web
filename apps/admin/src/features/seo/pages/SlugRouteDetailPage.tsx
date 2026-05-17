import { ArrowLeftOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Skeleton, Space, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminSlugRouteDetail } from "../hooks/slug-route/useAdminSlugRouteDetail";
import {
  buildArticleSeoSettingsPath,
  formatDateTime,
  isArticleResource,
  renderBooleanTag,
  renderOptionalText,
  renderResourceTypeTag,
  renderScopeTag,
  wrappingTextStyle,
} from "../utils/seoUi";

export function SlugRouteDetailPage() {
  const { slugId } = useParams();
  const parsedSlugId = Number(slugId);
  const selectedSlugId =
    Number.isSafeInteger(parsedSlugId) && parsedSlugId > 0
      ? parsedSlugId
      : null;
  const navigate = useNavigate();
  const slugRouteDetailQuery = useAdminSlugRouteDetail(selectedSlugId ?? 0);
  const slugRoute = slugRouteDetailQuery.data;

  if (!selectedSlugId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid slug route id.</Typography.Text>
      </Card>
    );
  }

  if (slugRouteDetailQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!slugRoute) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Slug route information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(ROUTES.SEO_SLUG_ROUTES)}
      >
        Back to slug routes
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              {slugRoute.slug}
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {slugRoute.canonicalUrl || "No canonical URL"}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {renderScopeTag(slugRoute.scope)}
              {renderResourceTypeTag(slugRoute.resourceType)}
              {renderBooleanTag(slugRoute.isActive, "Active", "Inactive")}
              {renderBooleanTag(slugRoute.isIndexable, "Indexable", "Noindex")}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Slug ID">
            {slugRoute.slugId}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            <Typography.Text style={wrappingTextStyle}>
              {slugRoute.slug}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Scope">
            {renderScopeTag(slugRoute.scope)}
          </Descriptions.Item>
          <Descriptions.Item label="Resource type">
            {renderResourceTypeTag(slugRoute.resourceType)}
          </Descriptions.Item>
          <Descriptions.Item label="Resource public ID">
            <Typography.Text style={wrappingTextStyle}>
              {slugRoute.resourcePublicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Canonical URL">
            {renderOptionalText(slugRoute.canonicalUrl)}
          </Descriptions.Item>
          <Descriptions.Item label="Active">
            {renderBooleanTag(slugRoute.isActive, "Active", "Inactive")}
          </Descriptions.Item>
          <Descriptions.Item label="Indexable">
            {renderBooleanTag(slugRoute.isIndexable, "Indexable", "Noindex")}
          </Descriptions.Item>
          <Descriptions.Item label="Version">
            {slugRoute.version}
          </Descriptions.Item>
          <Descriptions.Item label="Source version">
            {slugRoute.sourceAggregateVersion ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last applied message ID">
            {renderOptionalText(slugRoute.lastAppliedMessageId)}
          </Descriptions.Item>
          <Descriptions.Item label="Last synced">
            {formatDateTime(slugRoute.lastSyncedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(slugRoute.createdAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Created by">
            {slugRoute.createdByUserId ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(slugRoute.updatedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated by">
            {slugRoute.updatedByUserId ?? "N/A"}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {isArticleResource(slugRoute.resourceType) && (
        <Card title="Actions" style={{ marginTop: 16 }}>
          <Button
            icon={<SettingOutlined />}
            onClick={() =>
              navigate(buildArticleSeoSettingsPath(slugRoute.resourcePublicId))
            }
          >
            Open article SEO settings
          </Button>
        </Card>
      )}
    </section>
  );
}
