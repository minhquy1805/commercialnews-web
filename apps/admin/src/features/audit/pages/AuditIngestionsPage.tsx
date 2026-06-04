import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Select,
  Space,
  Table,
  Tabs,
  type TableProps,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTablePagination } from "../../../shared/pagination";
import {
  AUDIT_INGESTION_ERROR_CLASS_OPTIONS,
  AUDIT_INGESTION_STATUS_OPTIONS,
} from "../constants";
import { useAdminAuditIngestions } from "../hooks/ingestion/useAdminAuditIngestions";
import { useAdminFailedAuditIngestions } from "../hooks/ingestion/useAdminFailedAuditIngestions";
import type { AdminAuditIngestionListItem } from "../types";
import {
  buildAuditIngestionPath,
  formatDateTime,
  renderCodeText,
  renderIngestionStatusTag,
  renderOptionalText,
  toNullableString,
  wrappingTextStyle,
} from "../utils/auditUi";

const { RangePicker } = DatePicker;

type IngestionTab = "all" | "failed";

type AuditIngestionFilters = {
  status?: string;
  messageId?: string;
  eventType?: string;
  aggregateType?: string;
  aggregateId?: string;
  aggregatePublicId?: string;
  correlationId?: string;
  consumerName?: string;
  lastErrorClass?: string;
  receivedRange?: [Dayjs, Dayjs];
};

function toUtcIso(value?: Dayjs | null) {
  return value ? value.toDate().toISOString() : null;
}

function getColumns(
  navigate: ReturnType<typeof useNavigate>,
): TableProps<AdminAuditIngestionListItem>["columns"] {
  return [
    {
      title: "Message",
      key: "message",
      fixed: "left",
      width: 330,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 280 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {item.eventType}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.messageId}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: renderIngestionStatusTag,
    },
    {
      title: "Consumer",
      dataIndex: "consumerName",
      key: "consumerName",
      width: 220,
      render: renderOptionalText,
    },
    {
      title: "Attempts",
      dataIndex: "attemptCount",
      key: "attemptCount",
      width: 110,
    },
    {
      title: "Aggregate",
      key: "aggregate",
      width: 320,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text style={wrappingTextStyle}>
            {item.aggregateType ?? "N/A"}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {item.aggregatePublicId ?? item.aggregateId ?? "N/A"}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Correlation ID",
      dataIndex: "correlationId",
      key: "correlationId",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Priority",
      dataIndex: "sourcePriority",
      key: "sourcePriority",
      width: 100,
      render: renderOptionalText,
    },
    {
      title: "Error class",
      dataIndex: "lastErrorClass",
      key: "lastErrorClass",
      width: 150,
      render: renderOptionalText,
    },
    {
      title: "Error code",
      dataIndex: "lastErrorCode",
      key: "lastErrorCode",
      width: 210,
      render: renderCodeText,
    },
    {
      title: "First received",
      dataIndex: "firstReceivedAtUtc",
      key: "firstReceivedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Last attempt",
      dataIndex: "lastAttemptAtUtc",
      key: "lastAttemptAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Processed",
      dataIndex: "processedAtUtc",
      key: "processedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Dead-lettered",
      dataIndex: "deadLetteredAtUtc",
      key: "deadLetteredAtUtc",
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
            navigate(buildAuditIngestionPath(item.publicId));
          }}
        >
          View
        </Button>
      ),
    },
  ];
}

export function AuditIngestionsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<AuditIngestionFilters>();
  const [activeTab, setActiveTab] = useState<IngestionTab>("all");
  const [filters, setFilters] = useState<AuditIngestionFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const ingestionsQuery = useAdminAuditIngestions({
    page,
    pageSize,
    sort: "-firstReceivedAtUtc",
    status: filters.status ?? null,
    messageId: toNullableString(filters.messageId),
    eventType: toNullableString(filters.eventType),
    aggregateType: toNullableString(filters.aggregateType),
    aggregateId: toNullableString(filters.aggregateId),
    aggregatePublicId: toNullableString(filters.aggregatePublicId),
    correlationId: toNullableString(filters.correlationId),
    consumerName: toNullableString(filters.consumerName),
    lastErrorClass: filters.lastErrorClass ?? null,
    fromUtc: toUtcIso(filters.receivedRange?.[0]),
    toUtc: toUtcIso(filters.receivedRange?.[1]),
  });
  const failedIngestionsQuery = useAdminFailedAuditIngestions({
    page,
    pageSize,
    sort: "-firstReceivedAtUtc",
    eventType: toNullableString(filters.eventType),
    aggregateType: toNullableString(filters.aggregateType),
    aggregateId: toNullableString(filters.aggregateId),
    aggregatePublicId: toNullableString(filters.aggregatePublicId),
    correlationId: toNullableString(filters.correlationId),
    consumerName: toNullableString(filters.consumerName),
    lastErrorClass: filters.lastErrorClass ?? null,
    fromUtc: toUtcIso(filters.receivedRange?.[0]),
    toUtc: toUtcIso(filters.receivedRange?.[1]),
  });
  const currentQuery = activeTab === "failed" ? failedIngestionsQuery : ingestionsQuery;
  const columns = getColumns(navigate);

  function applyFilters(values: AuditIngestionFilters) {
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
        Audit ingestion
      </Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Space size={12} wrap align="end">
            <Form.Item label="Status" name="status" style={{ width: 170 }}>
              <Select
                allowClear
                disabled={activeTab === "failed"}
                options={AUDIT_INGESTION_STATUS_OPTIONS}
              />
            </Form.Item>
            <Form.Item label="Message ID" name="messageId" style={{ width: 270 }}>
              <Input allowClear disabled={activeTab === "failed"} />
            </Form.Item>
            <Form.Item label="Event type" name="eventType" style={{ width: 260 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Aggregate type" name="aggregateType" style={{ width: 190 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Aggregate ID" name="aggregateId" style={{ width: 220 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Aggregate public ID" name="aggregatePublicId" style={{ width: 250 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Correlation ID" name="correlationId" style={{ width: 270 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Consumer" name="consumerName" style={{ width: 220 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Error class" name="lastErrorClass" style={{ width: 170 }}>
              <Select allowClear options={AUDIT_INGESTION_ERROR_CLASS_OPTIONS} />
            </Form.Item>
            <Form.Item label="Received range" name="receivedRange">
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
        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as IngestionTab);
            setPage(1);
          }}
          items={[
            { key: "all", label: "All ingestion" },
            { key: "failed", label: "Failed" },
          ]}
        />
        <Table<AdminAuditIngestionListItem>
          bordered
          rowKey={(item) => item.publicId}
          columns={columns}
          dataSource={currentQuery.data?.items ?? []}
          loading={currentQuery.isFetching}
          scroll={{ x: 2800 }}
          locale={{
            emptyText: currentQuery.isError
              ? "Could not load audit ingestion."
              : "No audit ingestion records found.",
          }}
          pagination={createTablePagination(
            currentQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} ingestion records`,
          )}
          onRow={(item) => ({
            onClick: () => navigate(buildAuditIngestionPath(item.publicId)),
          })}
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}
        />
      </Card>
    </section>
  );
}
