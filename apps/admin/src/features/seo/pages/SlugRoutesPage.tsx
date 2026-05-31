import {
  CheckCircleOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Alert,
  App,
  Button,
  Card,
  Form,
  Input,
  Select,
  Space,
  Table,
  type TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { createTablePagination } from "../../../shared/pagination";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import {
  SEO_DEFAULTS,
  SEO_RESOURCE_TYPE_SELECT_OPTIONS,
  SEO_SCOPE_SELECT_OPTIONS,
  type SeoResourceType,
  type SeoScope,
} from "../constants/seoConstants";
import { useCheckSlugAvailability } from "../hooks/slug-route/useCheckSlugAvailability";
import { useGenerateSlug } from "../hooks/slug-route/useGenerateSlug";
import { useAdminSlugRoutes } from "../hooks/slug-route/useAdminSlugRoutes";
import type {
  AdminSlugRouteListItem,
  CheckSlugAvailabilityRequest,
} from "../types/adminSlugRoute.types";
import {
  formatDateTime,
  renderBooleanTag,
  renderOptionalText,
  renderResourceTypeTag,
  renderScopeTag,
  wrappingTextStyle,
} from "../utils/seoUi";

type BooleanFilter = "all" | "yes" | "no";

type SlugToolFormValues = {
  scope: SeoScope;
  resourceType?: SeoResourceType | null;
  resourcePublicId?: string;
  source?: string;
  slug?: string;
};

function getBooleanFilterValue(filter: BooleanFilter) {
  if (filter === "all") {
    return undefined;
  }

  return filter === "yes";
}

function getSlugRouteColumns(): TableProps<AdminSlugRouteListItem>["columns"] {
  return [
    {
      title: "Slug",
      key: "slug",
      fixed: "left",
      width: 320,
      render: (_, route) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {route.slug}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {route.canonicalUrl || "No canonical URL"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Resource",
      key: "resource",
      width: 320,
      render: (_, route) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Space size={6} wrap>
            {renderScopeTag(route.scope)}
            {renderResourceTypeTag(route.resourceType)}
          </Space>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {route.resourcePublicId}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Active",
      dataIndex: "isActive",
      key: "isActive",
      width: 120,
      render: (isActive: boolean) => renderBooleanTag(isActive, "Active", "Inactive"),
    },
    {
      title: "Indexable",
      dataIndex: "isIndexable",
      key: "isIndexable",
      width: 130,
      render: (isIndexable: boolean) =>
        renderBooleanTag(isIndexable, "Indexable", "Noindex"),
    },
    {
      title: "Source version",
      dataIndex: "sourceAggregateVersion",
      key: "sourceAggregateVersion",
      width: 150,
      render: (version: number | null) => version ?? "N/A",
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 110,
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
    {
      title: "Last message ID",
      dataIndex: "lastAppliedMessageId",
      key: "lastAppliedMessageId",
      width: 280,
      render: renderOptionalText,
    },
  ];
}

export function SlugRoutesPage() {
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [toolForm] = Form.useForm<SlugToolFormValues>();
  const [keyword, setKeyword] = useState("");
  const [submittedKeyword, setSubmittedKeyword] = useState("");
  const [resourcePublicId, setResourcePublicId] = useState("");
  const [submittedResourcePublicId, setSubmittedResourcePublicId] = useState("");
  const [scope, setScope] = useState<SeoScope>();
  const [resourceType, setResourceType] = useState<SeoResourceType>();
  const [activeFilter, setActiveFilter] = useState<BooleanFilter>("all");
  const [indexableFilter, setIndexableFilter] = useState<BooleanFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [availabilityRequest, setAvailabilityRequest] =
    useState<CheckSlugAvailabilityRequest | null>(null);

  const slugRoutesQuery = useAdminSlugRoutes({
    page,
    pageSize,
    keyword: submittedKeyword || null,
    scope: scope ?? null,
    resourceType: resourceType ?? null,
    resourcePublicId: submittedResourcePublicId || null,
    isActive: getBooleanFilterValue(activeFilter),
    isIndexable: getBooleanFilterValue(indexableFilter),
  });
  const generateSlugMutation = useGenerateSlug();
  const availabilityQuery = useCheckSlugAvailability(
    availabilityRequest ?? {
      slug: "",
      scope: SEO_DEFAULTS.SCOPE,
    },
    Boolean(availabilityRequest),
  );
  const slugRouteColumns = getSlugRouteColumns();

  async function handleGenerateSlug() {
    const values = toolForm.getFieldsValue();
    const source = values.source?.trim();

    if (!source) {
      notification.warning({
        title: "Source is required to generate a slug.",
        placement: "topRight",
      });
      return;
    }

    try {
      const response = await generateSlugMutation.mutateAsync({
        source,
        scope: values.scope ?? SEO_DEFAULTS.SCOPE,
        resourceType: values.resourceType ?? null,
        resourcePublicId: values.resourcePublicId?.trim() || null,
      });

      toolForm.setFieldValue("slug", response.suggestedSlug);
      setAvailabilityRequest({
        slug: response.suggestedSlug,
        scope: response.scope as SeoScope,
        resourceType: values.resourceType ?? null,
        resourcePublicId: values.resourcePublicId?.trim() || null,
      });

      notification.success({
        title: response.isUnique ? "Slug generated" : "Slug generated with conflict",
        placement: "topRight",
      });
    } catch (error) {
      notification.error({
        title: "Could not generate slug.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function handleCheckAvailability() {
    const values = toolForm.getFieldsValue();
    const slug = values.slug?.trim();

    if (!slug) {
      notification.warning({
        title: "Slug is required to check availability.",
        placement: "topRight",
      });
      return;
    }

    const nextRequest: CheckSlugAvailabilityRequest = {
      slug,
      scope: values.scope ?? SEO_DEFAULTS.SCOPE,
      resourceType: values.resourceType ?? null,
      resourcePublicId: values.resourcePublicId?.trim() || null,
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

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Slug routes
      </Typography.Title>

      <Card title="Slug tools" style={{ marginTop: 24 }}>
        <Form
          form={toolForm}
          layout="vertical"
          requiredMark={false}
          initialValues={{
            scope: SEO_DEFAULTS.SCOPE,
            resourceType: SEO_DEFAULTS.RESOURCE_TYPE,
          }}
        >
          <Space size={12} wrap align="start" style={{ width: "100%" }}>
            <Form.Item label="Scope" name="scope" style={{ width: 150 }}>
              <Select<SeoScope> options={[...SEO_SCOPE_SELECT_OPTIONS]} />
            </Form.Item>

            <Form.Item
              label="Resource"
              name="resourceType"
              style={{ width: 170 }}
            >
              <Select<SeoResourceType>
                allowClear
                options={[...SEO_RESOURCE_TYPE_SELECT_OPTIONS]}
              />
            </Form.Item>

            <Form.Item
              label="Resource public ID"
              name="resourcePublicId"
              style={{ width: 280 }}
            >
              <Input autoComplete="off" />
            </Form.Item>

            <Form.Item label="Source" name="source" style={{ width: 300 }}>
              <Input autoComplete="off" />
            </Form.Item>
          </Space>

          <Form.Item label="Slug" style={{ marginBottom: 0 }}>
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
        </Form>

        {availabilityQuery.data && (
          <Alert
            type={
              availabilityQuery.data.isAvailable ||
              availabilityQuery.data.belongsToCurrentResource
                ? "success"
                : "warning"
            }
            showIcon
            style={{ marginTop: 16 }}
            message={
              availabilityQuery.data.isAvailable
                ? "Slug is available."
                : availabilityQuery.data.belongsToCurrentResource
                  ? "Slug belongs to the selected resource."
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
            style={{ marginTop: 16 }}
            message="Could not check slug availability."
          />
        )}
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Space size={12} wrap style={{ marginBottom: 16 }}>
          <Input.Search
            allowClear
            placeholder="Search slug routes"
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

          <Select<BooleanFilter>
            value={activeFilter}
            onChange={(value) => {
              setActiveFilter(value);
              setPage(1);
            }}
            options={[
              { label: "All activity", value: "all" },
              { label: "Active", value: "yes" },
              { label: "Inactive", value: "no" },
            ]}
            style={{ width: 150 }}
          />

          <Select<BooleanFilter>
            value={indexableFilter}
            onChange={(value) => {
              setIndexableFilter(value);
              setPage(1);
            }}
            options={[
              { label: "All index", value: "all" },
              { label: "Indexable", value: "yes" },
              { label: "Noindex", value: "no" },
            ]}
            style={{ width: 150 }}
          />
        </Space>

        <Table<AdminSlugRouteListItem>
          bordered
          rowKey={(route) => String(route.slugId)}
          columns={slugRouteColumns}
          dataSource={slugRoutesQuery.data?.items ?? []}
          loading={slugRoutesQuery.isFetching}
          scroll={{ x: 2260 }}
          locale={{
            emptyText: slugRoutesQuery.isError
              ? "Could not load slug routes."
              : "No slug routes found.",
          }}
          pagination={createTablePagination(
            slugRoutesQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} slug routes`,
          )}
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: 8,
            overflow: "hidden",
          }}
          onRow={(route) => ({
            onClick: () => navigate(`${ROUTES.SEO_SLUG_ROUTES}/${route.slugId}`),
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </section>
  );
}
