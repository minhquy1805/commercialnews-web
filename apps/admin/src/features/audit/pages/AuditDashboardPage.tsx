import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Row,
  Col,
  Select,
  Space,
  Statistic,
  Table,
  type TableProps,
  Typography,
} from "antd";
import type { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AUDIT_RISK_LEVEL_OPTIONS } from "../constants";
import { useAdminAuditDashboardSummary } from "../hooks/dashboard/useAdminAuditDashboardSummary";
import { useAdminRecentRiskEvents } from "../hooks/dashboard/useAdminRecentRiskEvents";
import { useAdminAuditModules } from "../hooks/metadata/useAdminAuditModules";
import type {
  AdminAuditDashboardCountByModule,
  AdminAuditDashboardCountByRiskLevel,
  AdminAuditDashboardCountBySeverity,
  AdminAuditLogListItem,
} from "../types";
import {
  buildAuditLogPath,
  formatDateTime,
  renderOutcomeTag,
  renderRiskTag,
  renderSeverityTag,
  wrappingTextStyle,
} from "../utils/auditUi";

const { RangePicker } = DatePicker;

type DashboardFilters = {
  sourceModule?: string;
  riskLevel?: string;
  range?: [Dayjs, Dayjs];
};

function toUtcIso(value?: Dayjs | null) {
  return value ? value.toDate().toISOString() : null;
}

function getRecentRiskColumns(
  navigate: ReturnType<typeof useNavigate>,
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
      title: "Occurred at",
      dataIndex: "occurredAtUtc",
      key: "occurredAtUtc",
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

function getModuleColumns(): TableProps<AdminAuditDashboardCountByModule>["columns"] {
  return [
    {
      title: "Module",
      dataIndex: "sourceModule",
      key: "sourceModule",
    },
    {
      title: "Events",
      dataIndex: "count",
      key: "count",
      width: 120,
    },
  ];
}

function getSeverityColumns(): TableProps<AdminAuditDashboardCountBySeverity>["columns"] {
  return [
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      render: renderSeverityTag,
    },
    {
      title: "Events",
      dataIndex: "count",
      key: "count",
      width: 120,
    },
  ];
}

function getRiskColumns(): TableProps<AdminAuditDashboardCountByRiskLevel>["columns"] {
  return [
    {
      title: "Risk",
      dataIndex: "riskLevel",
      key: "riskLevel",
      render: renderRiskTag,
    },
    {
      title: "Events",
      dataIndex: "count",
      key: "count",
      width: 120,
    },
  ];
}

export function AuditDashboardPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<DashboardFilters>();
  const [filters, setFilters] = useState<DashboardFilters>({});

  const fromUtc = toUtcIso(filters.range?.[0]);
  const toUtc = toUtcIso(filters.range?.[1]);
  const modulesQuery = useAdminAuditModules();
  const summaryQuery = useAdminAuditDashboardSummary({
    fromUtc,
    toUtc,
    sourceModule: filters.sourceModule ?? null,
  });
  const recentRiskQuery = useAdminRecentRiskEvents({
    fromUtc,
    toUtc,
    sourceModule: filters.sourceModule ?? null,
    riskLevel: filters.riskLevel ?? null,
    limit: 20,
  });

  const moduleOptions = useMemo(
    () =>
      (modulesQuery.data?.items ?? []).map((module) => ({
        label: module.sourceModule,
        value: module.sourceModule,
      })),
    [modulesQuery.data?.items],
  );

  const summary = summaryQuery.data;
  const recentRiskColumns = getRecentRiskColumns(navigate);

  function applyFilters(values: DashboardFilters) {
    setFilters(values);
  }

  function clearFilters() {
    form.resetFields();
    setFilters({});
  }

  return (
    <section>
      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Audit dashboard
      </Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Space size={12} wrap align="end">
            <Form.Item label="Source module" name="sourceModule" style={{ width: 190 }}>
              <Select allowClear options={moduleOptions} loading={modulesQuery.isFetching} />
            </Form.Item>
            <Form.Item label="Recent risk level" name="riskLevel" style={{ width: 190 }}>
              <Select allowClear options={AUDIT_RISK_LEVEL_OPTIONS} />
            </Form.Item>
            <Form.Item label="Time range" name="range">
              <RangePicker showTime style={{ width: 360 }} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button htmlType="submit" type="primary" icon={<SearchOutlined />}>
                  Apply
                </Button>
                <Button onClick={clearFilters}>Reset</Button>
              </Space>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} xl={5}>
          <Card>
            <Statistic title="Audit events" value={summary?.totals.auditEvents ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={5}>
          <Card>
            <Statistic title="High risk" value={summary?.totals.highRiskEvents ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={5}>
          <Card>
            <Statistic title="Critical" value={summary?.totals.criticalEvents ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={5}>
          <Card>
            <Statistic title="Failed ingestion" value={summary?.totals.failedIngestion ?? 0} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={4}>
          <Card>
            <Statistic title="Duplicate ingestion" value={summary?.totals.duplicateIngestion ?? 0} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} lg={8}>
          <Card title="By module">
            <Table<AdminAuditDashboardCountByModule>
              size="small"
              rowKey={(item) => item.sourceModule}
              columns={getModuleColumns()}
              dataSource={summary?.byModule ?? []}
              loading={summaryQuery.isFetching}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="By severity">
            <Table<AdminAuditDashboardCountBySeverity>
              size="small"
              rowKey={(item) => item.severity}
              columns={getSeverityColumns()}
              dataSource={summary?.bySeverity ?? []}
              loading={summaryQuery.isFetching}
              pagination={false}
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="By risk level">
            <Table<AdminAuditDashboardCountByRiskLevel>
              size="small"
              rowKey={(item) => item.riskLevel}
              columns={getRiskColumns()}
              dataSource={summary?.byRiskLevel ?? []}
              loading={summaryQuery.isFetching}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent risk events">
        <Table<AdminAuditLogListItem>
          bordered
          rowKey={(item) => item.publicId}
          columns={recentRiskColumns}
          dataSource={recentRiskQuery.data?.items ?? []}
          loading={recentRiskQuery.isFetching}
          pagination={false}
          scroll={{ x: 1200 }}
          locale={{
            emptyText: recentRiskQuery.isError
              ? "Could not load recent risk events."
              : "No recent risk events found.",
          }}
          onRow={(item) => ({
            onClick: () => navigate(buildAuditLogPath(item.publicId)),
          })}
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}
        />
      </Card>
    </section>
  );
}
