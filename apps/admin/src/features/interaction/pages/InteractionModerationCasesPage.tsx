import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Checkbox,
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
import { createTablePagination } from "../../../shared/pagination";
import {
  MODERATION_CASE_PRIORITY_OPTIONS,
  MODERATION_CASE_STATUS_OPTIONS,
  type ModerationCasePriority,
  type ModerationCaseStatus,
} from "../constants/interactionConstants";
import { useAdminModerationCases } from "../hooks/moderation-case/useAdminModerationCases";
import type { AdminModerationCaseItem } from "../types/adminModerationCase.types";
import {
  buildArticleInteractionStatsPath,
  buildCommentPath,
  buildModerationCasePath,
  formatDateTime,
  renderAlertLevelTag,
  renderModerationCaseStatusTag,
  renderPriorityTag,
  renderSeverityTag,
  wrappingTextStyle,
} from "../utils/interactionUi";

type ModerationCaseFilters = {
  status?: ModerationCaseStatus;
  priority?: ModerationCasePriority;
  articlePublicId?: string;
  commentPublicId?: string;
  alertTriggered?: boolean;
};

function toOptionalString(value?: string) {
  const normalized = value?.trim();

  return normalized || undefined;
}

function getModerationCaseColumns(
  navigate: ReturnType<typeof useNavigate>,
): TableProps<AdminModerationCaseItem>["columns"] {
  return [
    {
      title: "Case",
      key: "case",
      fixed: "left",
      width: 320,
      render: (_, item) => (
        <div style={{ minWidth: 0, maxWidth: 270 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {item.commentModerationCasePublicId}
          </Typography.Text>
          <Typography.Link
            onClick={(event) => {
              event.stopPropagation();
              navigate(buildCommentPath(item.commentPublicId));
            }}
            style={wrappingTextStyle}
          >
            {item.commentPublicId}
          </Typography.Link>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: renderModerationCaseStatusTag,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: 130,
      render: renderPriorityTag,
    },
    {
      title: "Severity",
      dataIndex: "highestSeverity",
      key: "highestSeverity",
      width: 130,
      render: renderSeverityTag,
    },
    {
      title: "Reports",
      key: "reports",
      width: 150,
      render: (_, item) => `${item.pendingReportCount} / ${item.distinctReporterCount}`,
    },
    {
      title: "Alert",
      key: "alert",
      width: 170,
      render: (_, item) =>
        item.alertTriggered ? renderAlertLevelTag(item.alertLevel) : "N/A",
    },
    {
      title: "Article",
      dataIndex: "articlePublicId",
      key: "articlePublicId",
      width: 270,
      render: (articlePublicId: string) => (
        <Typography.Link
          onClick={(event) => {
            event.stopPropagation();
            navigate(buildArticleInteractionStatsPath(articlePublicId));
          }}
          style={wrappingTextStyle}
        >
          {articlePublicId}
        </Typography.Link>
      ),
    },
    {
      title: "Opened at",
      dataIndex: "openedAtUtc",
      key: "openedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      width: 100,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, item) => (
        <Button
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigate(buildModerationCasePath(item.commentModerationCasePublicId));
          }}
        >
          View
        </Button>
      ),
    },
  ];
}

export function InteractionModerationCasesPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<ModerationCaseFilters>();
  const [filters, setFilters] = useState<ModerationCaseFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const moderationCasesQuery = useAdminModerationCases({
    page,
    pageSize,
    status: filters.status,
    priority: filters.priority,
    articlePublicId: toOptionalString(filters.articlePublicId),
    commentPublicId: toOptionalString(filters.commentPublicId),
    alertTriggered: filters.alertTriggered,
  });
  const columns = getModerationCaseColumns(navigate);

  function applyFilters(values: ModerationCaseFilters) {
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
      <Typography.Title level={2}>Moderation cases</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Space size={12} wrap align="end">
            <Form.Item label="Status" name="status" style={{ minWidth: 190 }}>
              <Select allowClear options={MODERATION_CASE_STATUS_OPTIONS} />
            </Form.Item>
            <Form.Item label="Priority" name="priority" style={{ minWidth: 160 }}>
              <Select allowClear options={MODERATION_CASE_PRIORITY_OPTIONS} />
            </Form.Item>
            <Form.Item label="Article public ID" name="articlePublicId" style={{ minWidth: 280 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Comment public ID" name="commentPublicId" style={{ minWidth: 280 }}>
              <Input allowClear />
            </Form.Item>
            <Form.Item name="alertTriggered" valuePropName="checked">
              <Checkbox>Alerted only</Checkbox>
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
        <Table<AdminModerationCaseItem>
          bordered
          rowKey={(item) => item.commentModerationCasePublicId}
          columns={columns}
          dataSource={moderationCasesQuery.data?.items ?? []}
          loading={moderationCasesQuery.isFetching}
          scroll={{ x: 1940 }}
          locale={{
            emptyText: moderationCasesQuery.isError
              ? "Could not load moderation cases."
              : "No moderation cases found.",
          }}
          pagination={createTablePagination(
            moderationCasesQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} cases`,
          )}
          onRow={(item) => ({
            onClick: () => navigate(buildModerationCasePath(item.commentModerationCasePublicId)),
          })}
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}
        />
      </Card>
    </section>
  );
}
