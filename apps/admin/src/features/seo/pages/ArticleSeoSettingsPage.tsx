import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  LinkOutlined,
  SaveOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Form,
  Input,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import {
  SEO_DEFAULTS,
  SEO_RESOURCE_TYPES,
  SEO_ROBOTS_SELECT_OPTIONS,
  SEO_SCOPE_SELECT_OPTIONS,
  type SeoRobotsOption,
  type SeoScope,
} from "../constants/seoConstants";
import { useAdminArticleSeoSettings } from "../hooks/metadata/useAdminArticleSeoSettings";
import { useUpsertAdminArticleSeoSettings } from "../hooks/metadata/useUpsertAdminArticleSeoSettings";
import { useAdminSlugRouteByResource } from "../hooks/slug-route/useAdminSlugRouteByResource";
import { useCheckSlugAvailability } from "../hooks/slug-route/useCheckSlugAvailability";
import { useGenerateSlug } from "../hooks/slug-route/useGenerateSlug";
import type { CheckSlugAvailabilityRequest } from "../types/adminSlugRoute.types";
import {
  formatDateTime,
  renderNullableBooleanTag,
  renderOptionalText,
  renderResourceTypeTag,
  renderScopeTag,
  toNullableString,
  wrappingTextStyle,
} from "../utils/seoUi";

type ArticleSeoSettingsFormValues = {
  scope: SeoScope;
  slug?: string;
  canonicalUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImageUrl?: string;
  robots?: SeoRobotsOption | null;
  isIndexable: boolean;
  isActive: boolean;
};

const defaultFormValues: ArticleSeoSettingsFormValues = {
  scope: SEO_DEFAULTS.SCOPE,
  slug: "",
  canonicalUrl: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImageUrl: "",
  robots: null,
  isIndexable: true,
  isActive: true,
};

export function ArticleSeoSettingsPage() {
  const { articlePublicId } = useParams();
  const selectedArticlePublicId = articlePublicId?.trim() ?? "";
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [form] = Form.useForm<ArticleSeoSettingsFormValues>();
  const [selectedScope, setSelectedScope] = useState<SeoScope>(
    SEO_DEFAULTS.SCOPE,
  );
  const [availabilityRequest, setAvailabilityRequest] =
    useState<CheckSlugAvailabilityRequest | null>(null);

  const settingsQuery = useAdminArticleSeoSettings(
    selectedArticlePublicId,
    selectedScope,
  );
  const settings = settingsQuery.data;
  const slugRouteQuery = useAdminSlugRouteByResource({
    resourceType: SEO_RESOURCE_TYPES.ARTICLE,
    resourcePublicId: selectedArticlePublicId,
    scope: selectedScope,
    onlyActive: null,
  });
  const generateSlugMutation = useGenerateSlug();
  const upsertSettingsMutation = useUpsertAdminArticleSeoSettings();
  const availabilityQuery = useCheckSlugAvailability(
    availabilityRequest ?? {
      slug: "",
      scope: selectedScope,
      resourceType: SEO_RESOURCE_TYPES.ARTICLE,
      resourcePublicId: selectedArticlePublicId,
    },
    Boolean(availabilityRequest),
  );

  useEffect(() => {
    if (!settings) {
      return;
    }

    const scope = (settings.scope as SeoScope) || SEO_DEFAULTS.SCOPE;
    form.setFieldsValue({
      scope,
      slug: settings.slug ?? "",
      canonicalUrl: settings.canonicalUrl ?? "",
      metaTitle: settings.metaTitle ?? "",
      metaDescription: settings.metaDescription ?? "",
      ogTitle: settings.ogTitle ?? "",
      ogDescription: settings.ogDescription ?? "",
      ogImageUrl: settings.ogImageUrl ?? "",
      twitterTitle: settings.twitterTitle ?? "",
      twitterDescription: settings.twitterDescription ?? "",
      twitterImageUrl: settings.twitterImageUrl ?? "",
      robots: (settings.robots as SeoRobotsOption | null) ?? null,
      isIndexable: settings.isIndexable ?? true,
      isActive: settings.isActive ?? true,
    });
  }, [form, settings]);

  async function handleGenerateSlug() {
    const values = form.getFieldsValue();
    const source =
      values.metaTitle?.trim() ||
      values.slug?.trim() ||
      selectedArticlePublicId;

    if (!source) {
      notification.warning({
        message: "Source is required to generate a slug.",
        placement: "topRight",
      });
      return;
    }

    try {
      const response = await generateSlugMutation.mutateAsync({
        source,
        scope: values.scope ?? selectedScope,
        resourceType: SEO_RESOURCE_TYPES.ARTICLE,
        resourcePublicId: selectedArticlePublicId,
      });

      form.setFieldValue("slug", response.suggestedSlug);
      setAvailabilityRequest({
        slug: response.suggestedSlug,
        scope: response.scope as SeoScope,
        resourceType: SEO_RESOURCE_TYPES.ARTICLE,
        resourcePublicId: selectedArticlePublicId,
      });

      notification.success({
        message: response.isUnique ? "Slug generated" : "Slug generated with conflict",
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Could not generate slug.",
        placement: "topRight",
      });
    }
  }

  async function handleCheckAvailability() {
    const values = form.getFieldsValue();
    const slug = values.slug?.trim();

    if (!slug) {
      notification.warning({
        message: "Slug is required to check availability.",
        placement: "topRight",
      });
      return;
    }

    const nextRequest: CheckSlugAvailabilityRequest = {
      slug,
      scope: values.scope ?? selectedScope,
      resourceType: SEO_RESOURCE_TYPES.ARTICLE,
      resourcePublicId: selectedArticlePublicId,
    };

    setAvailabilityRequest(nextRequest);

    if (
      availabilityRequest?.slug === nextRequest.slug &&
      availabilityRequest?.scope === nextRequest.scope &&
      availabilityRequest?.resourceType === nextRequest.resourceType &&
      availabilityRequest?.resourcePublicId === nextRequest.resourcePublicId
    ) {
      await availabilityQuery.refetch();
    }
  }

  async function handleSaveSettings() {
    const values = await form.validateFields();
    const scope = values.scope ?? selectedScope;

    try {
      await upsertSettingsMutation.mutateAsync({
        articlePublicId: selectedArticlePublicId,
        request: {
          scope,
          slug: toNullableString(values.slug),
          canonicalUrl: toNullableString(values.canonicalUrl),
          metaTitle: toNullableString(values.metaTitle),
          metaDescription: toNullableString(values.metaDescription),
          ogTitle: toNullableString(values.ogTitle),
          ogDescription: toNullableString(values.ogDescription),
          ogImageUrl: toNullableString(values.ogImageUrl),
          twitterTitle: toNullableString(values.twitterTitle),
          twitterDescription: toNullableString(values.twitterDescription),
          twitterImageUrl: toNullableString(values.twitterImageUrl),
          robots: values.robots ?? null,
          isIndexable: Boolean(values.isIndexable),
          isActive: Boolean(values.isActive),
          expectedSlugVersion: slugRouteQuery.data?.version ?? null,
          expectedSeoMetadataVersion: settings?.version ?? null,
        },
      });

      setSelectedScope(scope);
      notification.success({
        message: "Article SEO settings saved",
        placement: "topRight",
      });
    } catch {
      notification.error({
        message: "Could not save article SEO settings.",
        placement: "topRight",
      });
    }
  }

  if (!selectedArticlePublicId) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Invalid article public ID.
        </Typography.Text>
      </Card>
    );
  }

  if (settingsQuery.isLoading && !settings) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  return (
    <section>
      <Space size={12} wrap>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <Button
          icon={<LinkOutlined />}
          onClick={() => navigate(ROUTES.SEO_SLUG_ROUTES)}
        >
          Slug routes
        </Button>
      </Space>

      <Card style={{ marginTop: 16 }}>
        <Space align="start" size={16} wrap>
          <div style={{ minWidth: 0 }}>
            <Typography.Title level={2} style={{ margin: 0 }}>
              Article SEO settings
            </Typography.Title>

            <Typography.Text type="secondary" style={wrappingTextStyle}>
              {selectedArticlePublicId}
            </Typography.Text>

            <Space size={8} wrap style={{ marginTop: 12 }}>
              {renderScopeTag(settings?.scope ?? selectedScope)}
              {renderResourceTypeTag(SEO_RESOURCE_TYPES.ARTICLE)}
              {settings?.isManualOverride ? (
                <Tag color="warning">Manual</Tag>
              ) : (
                <Tag color="default">Synced</Tag>
              )}
              {renderNullableBooleanTag(settings?.isActive ?? null, "Active", "Inactive")}
              {renderNullableBooleanTag(
                settings?.isIndexable ?? null,
                "Indexable",
                "Noindex",
              )}
            </Space>
          </div>
        </Space>

        <Descriptions
          bordered
          column={{ xs: 1, sm: 1, md: 2 }}
          style={{ marginTop: 24 }}
        >
          <Descriptions.Item label="Article public ID">
            <Typography.Text style={wrappingTextStyle}>
              {selectedArticlePublicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Slug route version">
            {slugRouteQuery.data?.version ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="SEO metadata version">
            {settings?.version ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Source version">
            {settings?.sourceAggregateVersion ?? "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Last applied message ID">
            {renderOptionalText(settings?.lastAppliedMessageId ?? null)}
          </Descriptions.Item>
          <Descriptions.Item label="Last synced">
            {formatDateTime(settings?.lastSyncedAtUtc ?? null)}
          </Descriptions.Item>
          <Descriptions.Item label="Current slug">
            {renderOptionalText(settings?.slug ?? null)}
          </Descriptions.Item>
          <Descriptions.Item label="Canonical URL">
            {renderOptionalText(settings?.canonicalUrl ?? null)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title="Edit settings"
        style={{ marginTop: 16 }}
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={upsertSettingsMutation.isPending}
            onClick={handleSaveSettings}
          >
            Save
          </Button>
        }
      >
        {settingsQuery.isError && (
          <Alert
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
            message="Could not load existing SEO settings."
          />
        )}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={defaultFormValues}
        >
          <Space size={12} wrap align="start" style={{ width: "100%" }}>
            <Form.Item label="Scope" name="scope" style={{ width: 160 }}>
              <Select<SeoScope>
                options={[...SEO_SCOPE_SELECT_OPTIONS]}
                onChange={(value) => setSelectedScope(value)}
              />
            </Form.Item>

            <Form.Item label="Robots" name="robots" style={{ width: 220 }}>
              <Select<SeoRobotsOption>
                allowClear
                options={[...SEO_ROBOTS_SELECT_OPTIONS]}
              />
            </Form.Item>

            <Form.Item name="isIndexable" valuePropName="checked">
              <Checkbox>Indexable</Checkbox>
            </Form.Item>

            <Form.Item name="isActive" valuePropName="checked">
              <Checkbox>Active</Checkbox>
            </Form.Item>
          </Space>

          <Form.Item label="Slug">
            <Space.Compact style={{ width: "100%" }}>
              <Form.Item name="slug" noStyle>
                <Input autoComplete="off" />
              </Form.Item>
              <Button
                htmlType="button"
                icon={<ThunderboltOutlined />}
                loading={generateSlugMutation.isPending}
                onClick={handleGenerateSlug}
              >
                Generate
              </Button>
              <Button
                htmlType="button"
                icon={<CheckCircleOutlined />}
                loading={availabilityQuery.isFetching && Boolean(availabilityRequest)}
                onClick={handleCheckAvailability}
              >
                Check
              </Button>
            </Space.Compact>
          </Form.Item>

          {availabilityQuery.data && (
            <Alert
              type={
                availabilityQuery.data.isAvailable ||
                availabilityQuery.data.belongsToCurrentResource
                  ? "success"
                  : "warning"
              }
              showIcon
              style={{ marginBottom: 16 }}
              message={
                availabilityQuery.data.isAvailable
                  ? "Slug is available."
                  : availabilityQuery.data.belongsToCurrentResource
                    ? "Slug belongs to this article."
                    : "Slug is already used by another resource."
              }
              description={
                availabilityQuery.data.existingResourceType
                  ? `${availabilityQuery.data.existingResourceType} ${availabilityQuery.data.existingResourcePublicId ?? ""}`
                  : undefined
              }
            />
          )}

          {availabilityQuery.isError && (
            <Alert
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
              message="Could not check slug availability."
            />
          )}

          <Form.Item label="Canonical URL" name="canonicalUrl">
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item label="Meta title" name="metaTitle">
            <Input autoComplete="off" showCount maxLength={70} />
          </Form.Item>

          <Form.Item label="Meta description" name="metaDescription">
            <Input.TextArea
              autoSize={{ minRows: 3, maxRows: 5 }}
              showCount
              maxLength={170}
            />
          </Form.Item>

          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item label="OG title" name="ogTitle" style={{ flex: 1 }}>
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Twitter title"
              name="twitterTitle"
              style={{ flex: 1 }}
            >
              <Input autoComplete="off" />
            </Form.Item>
          </Space>

          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item
              label="OG description"
              name="ogDescription"
              style={{ flex: 1 }}
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>

            <Form.Item
              label="Twitter description"
              name="twitterDescription"
              style={{ flex: 1 }}
            >
              <Input.TextArea autoSize={{ minRows: 3, maxRows: 5 }} />
            </Form.Item>
          </Space>

          <Space size={12} style={{ width: "100%" }} align="start">
            <Form.Item label="OG image URL" name="ogImageUrl" style={{ flex: 1 }}>
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Twitter image URL"
              name="twitterImageUrl"
              style={{ flex: 1 }}
            >
              <Input autoComplete="off" />
            </Form.Item>
          </Space>
        </Form>
      </Card>
    </section>
  );
}
