import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
  type TableProps,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTablePagination } from "../../../shared/pagination";
import { useAdminUserDetails } from "../../identity/hooks/useAdminUserDetails";
import type { AdminUserDetailResponse } from "../../identity/types/adminUser.types";
import {
  AUDIT_ACTION_CATEGORY_OPTIONS,
  AUDIT_OUTCOME_OPTIONS,
  AUDIT_RESOURCE_TYPE_OPTIONS,
  AUDIT_RISK_LEVEL_OPTIONS,
  AUDIT_SEVERITY_OPTIONS,
} from "../constants";
import { useAdminAuditLogs } from "../hooks/log/useAdminAuditLogs";
import { useAdminAuditModules } from "../hooks/metadata/useAdminAuditModules";
import type { AdminAuditLogListItem } from "../types";
import {
  buildAuditLogPath,
  formatDateTime,
  renderCodeText,
  renderOptionalText,
  renderOutcomeTag,
  renderRiskTag,
  renderSeverityTag,
  toNullableString,
  wrappingTextStyle,
} from "../utils/auditUi";

const { RangePicker } = DatePicker;

type AuditLogFilters = {
  messageId?: string;
  sourceModule?: string;
  eventType?: string;
  action?: string;
  actionCategory?: string;
  resourceType?: string;
  resourceId?: string;
  actorUserId?: string;
  actorInternalId?: number;
  outcome?: string;
  severity?: string;
  riskLevel?: string;
  correlationId?: string;
  occurredRange?: [Dayjs, Dayjs];
};

function toUtcIso(value?: Dayjs | null) {
  return value ? value.toDate().toISOString() : null;
}

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

function getActorInternalId(item: AdminAuditLogListItem) {
  const actorInternalId = item.actor.actorInternalId ?? null;

  return actorInternalId && actorInternalId > 0 ? actorInternalId : null;
}

function getEnrichedActor(
  item: AdminAuditLogListItem,
  usersById: Map<number, AdminUserDetailResponse>,
) {
  const actorInternalId = getActorInternalId(item);
  const identityUser = actorInternalId
    ? usersById.get(actorInternalId)
    : undefined;

  return {
    displayName:
      normalizeOptionalText(item.actor.actorDisplayName) ??
      normalizeOptionalText(identityUser?.fullName) ??
      item.actor.actorType,
    email:
      normalizeOptionalText(item.actor.actorEmail) ??
      normalizeOptionalText(identityUser?.email),
    publicId:
      normalizeOptionalText(item.actor.actorUserId) ??
      normalizeOptionalText(identityUser?.publicId),
    internalId: actorInternalId,
  };
}

function getActorFallbackText(
  actor: ReturnType<typeof getEnrichedActor>,
  isFetchingIdentityUsers: boolean,
) {
  if (actor.email || actor.publicId) {
    return null;
  }

  if (isFetchingIdentityUsers && actor.internalId) {
    return "Loading identity...";
  }

  return actor.internalId ?? "N/A";
}

function getColumns(
  navigate: ReturnType<typeof useNavigate>,
  usersById: Map<number, AdminUserDetailResponse>,
  isFetchingIdentityUsers: boolean,
): TableProps<AdminAuditLogListItem>["columns"] {
  return [
    {
      title: "Event",
      key: "event",
      fixed: "left",
      width: 330,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 280 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {item.summary}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.eventType}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Module",
      dataIndex: "sourceModule",
      key: "sourceModule",
      width: 140,
    },
    {
      title: "Action",
      key: "action",
      width: 230,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 190 }}>
          <Typography.Text style={wrappingTextStyle}>{item.action}</Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.actionCategory ?? "N/A"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Risk",
      dataIndex: "riskLevel",
      key: "riskLevel",
      width: 120,
      render: renderRiskTag,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 120,
      render: renderSeverityTag,
    },
    {
      title: "Outcome",
      dataIndex: "outcome",
      key: "outcome",
      width: 120,
      render: renderOutcomeTag,
    },
    {
      title: "Resource",
      key: "resource",
      width: 300,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 250 }}>
          <Typography.Text style={wrappingTextStyle}>
            {item.resource.type}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.resource.displayName ?? item.resource.id}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Actor",
      key: "actor",
      width: 300,
      render: (_, item) => {
        const actor = getEnrichedActor(item, usersById);
        const fallbackText = getActorFallbackText(
          actor,
          isFetchingIdentityUsers,
        );

        return (
          <div style={{ minWidth: 0, maxWidth: 250 }}>
            <Typography.Text style={wrappingTextStyle}>
              {actor.displayName}
            </Typography.Text>
            {actor.email && (
              <Typography.Text type="secondary" style={wrappingTextStyle}>
                {actor.email}
              </Typography.Text>
            )}
            {actor.publicId && (
              <Typography.Text type="secondary" style={wrappingTextStyle}>
                {actor.publicId}
              </Typography.Text>
            )}
            {fallbackText && (
              <Typography.Text type="secondary" style={wrappingTextStyle}>
                {fallbackText}
              </Typography.Text>
            )}
          </div>
        );
      },
    },
    {
      title: "Message ID",
      dataIndex: "messageId",
      key: "messageId",
      width: 260,
      render: renderCodeText,
    },
    {
      title: "Correlation ID",
      dataIndex: "correlationId",
      key: "correlationId",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Occurred at",
      dataIndex: "occurredAtUtc",
      key: "occurredAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Ingested at",
      dataIndex: "ingestedAtUtc",
      key: "ingestedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 110,
      render: (_, item) => (
        <Button
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigate(buildAuditLogPath(item.publicId));
          }}
        >
          View
        </Button>
      ),
    },
  ];
}

export function AuditLogsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<AuditLogFilters>();
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const modulesQuery = useAdminAuditModules();
  const logsQuery = useAdminAuditLogs({
    page,
    pageSize,
    sort: "-occurredAtUtc",
    messageId: toNullableString(filters.messageId),
    sourceModule: filters.sourceModule ?? null,
    eventType: toNullableString(filters.eventType),
    action: toNullableString(filters.action),
    actionCategory: filters.actionCategory ?? null,
    resourceType: filters.resourceType ?? null,
    resourceId: toNullableString(filters.resourceId),
    actorUserId: toNullableString(filters.actorUserId),
    actorInternalId: filters.actorInternalId ?? null,
    outcome: filters.outcome ?? null,
    severity: filters.severity ?? null,
    riskLevel: filters.riskLevel ?? null,
    correlationId: toNullableString(filters.correlationId),
    fromUtc: toUtcIso(filters.occurredRange?.[0]),
    toUtc: toUtcIso(filters.occurredRange?.[1]),
  });

  const actorInternalIds = useMemo(
    () =>
      (logsQuery.data?.items ?? [])
        .map(getActorInternalId)
        .filter((actorInternalId): actorInternalId is number =>
          actorInternalId !== null,
        ),
    [logsQuery.data?.items],
  );
  const actorUsersQuery = useAdminUserDetails(actorInternalIds);

  const moduleOptions = useMemo(
    () =>
      (modulesQuery.data?.items ?? []).map((module) => ({
        label: module.sourceModule,
        value: module.sourceModule,
      })),
    [modulesQuery.data?.items],
  );

  const columns = getColumns(
    navigate,
    actorUsersQuery.usersById,
    actorUsersQuery.isFetching,
  );

  function applyFilters(values: AuditLogFilters) {
    setFilters(values);
    setPage(1);
  }

  function clearFilters() {
    form.resetFields();
    setFilters({});
    setPage(1);
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Audit logs
      </Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Space size={12} wrap align="end">
            <Form.Item label="Message ID" name="messageId" style={{ width: 270 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Correlation ID" name="correlationId" style={{ width: 270 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Source module" name="sourceModule" style={{ width: 180 }}>
              <Select allowClear options={moduleOptions} loading={modulesQuery.isFetching} />
            </Form.Item>
            <Form.Item label="Event type" name="eventType" style={{ width: 260 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Action" name="action" style={{ width: 200 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Action category" name="actionCategory" style={{ width: 190 }}>
              <Select allowClear options={AUDIT_ACTION_CATEGORY_OPTIONS} />
            </Form.Item>
            <Form.Item label="Resource type" name="resourceType" style={{ width: 180 }}>
              <Select allowClear showSearch options={AUDIT_RESOURCE_TYPE_OPTIONS} />
            </Form.Item>
            <Form.Item label="Resource ID" name="resourceId" style={{ width: 260 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Actor public ID" name="actorUserId" style={{ width: 260 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Actor internal ID" name="actorInternalId">
              <InputNumber min={1} style={{ width: 150 }} />
            </Form.Item>
            <Form.Item label="Outcome" name="outcome" style={{ width: 150 }}>
              <Select allowClear options={AUDIT_OUTCOME_OPTIONS} />
            </Form.Item>
            <Form.Item label="Severity" name="severity" style={{ width: 150 }}>
              <Select allowClear options={AUDIT_SEVERITY_OPTIONS} />
            </Form.Item>
            <Form.Item label="Risk" name="riskLevel" style={{ width: 150 }}>
              <Select allowClear options={AUDIT_RISK_LEVEL_OPTIONS} />
            </Form.Item>
            <Form.Item label="Occurred range" name="occurredRange">
              <RangePicker showTime style={{ width: 360 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
                  Search
                </Button>
                <Button onClick={clearFilters}>Reset</Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Card>
        <Table<AdminAuditLogListItem>
          bordered
          rowKey={(item) => item.publicId}
          columns={columns}
          dataSource={logsQuery.data?.items ?? []}
          loading={logsQuery.isFetching}
          scroll={{ x: 2800 }}
          locale={{
            emptyText: logsQuery.isError
              ? "Could not load audit logs."
              : "No audit logs found.",
          }}
          pagination={createTablePagination(
            logsQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} audit logs`,
          )}
          onRow={(item) => ({
            onClick: () => navigate(buildAuditLogPath(item.publicId)),
          })}
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}
        />
      </Card>
    </section>
  );
}
