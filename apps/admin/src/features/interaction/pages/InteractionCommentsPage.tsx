import { EyeOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
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
  COMMENT_STATUS_OPTIONS,
  type CommentStatus,
} from "../constants/interactionConstants";
import { useAdminComments } from "../hooks/comment/useAdminComments";
import type { AdminCommentItem } from "../types/adminComment.types";
import {
  buildArticleInteractionStatsPath,
  buildCommentPath,
  formatDateTime,
  renderCommentStatusTag,
  renderOptionalText,
  wrappingTextStyle,
} from "../utils/interactionUi";

type CommentFilters = {
  status?: CommentStatus;
  articlePublicId?: string;
  authorUserId?: number;
};

function toOptionalString(value?: string) {
  const normalized = value?.trim();

  return normalized || undefined;
}

function getCommentColumns(
  navigate: ReturnType<typeof useNavigate>,
): TableProps<AdminCommentItem>["columns"] {
  return [
    {
      title: "Comment",
      key: "comment",
      fixed: "left",
      width: 340,
      render: (_, comment) => (
        <div style={{ minWidth: 0, maxWidth: 290 }}>
          <Typography.Text strong style={wrappingTextStyle}>
            {comment.commentPublicId}
          </Typography.Text>
          <Typography.Text type="secondary" style={wrappingTextStyle}>
            {comment.content}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: renderCommentStatusTag,
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
      title: "Author",
      dataIndex: "authorUserId",
      key: "authorUserId",
      width: 110,
    },
    {
      title: "Parent",
      dataIndex: "parentCommentPublicId",
      key: "parentCommentPublicId",
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
      dataIndex: "createdAtUtc",
      key: "createdAtUtc",
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
      title: "Deleted at",
      dataIndex: "deletedAtUtc",
      key: "deletedAtUtc",
      width: 190,
      render: formatDateTime,
    },
    {
      title: "Actions",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, comment) => (
        <Button
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation();
            navigate(buildCommentPath(comment.commentPublicId));
          }}
        >
          View
        </Button>
      ),
    },
  ];
}

export function InteractionCommentsPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CommentFilters>();
  const [filters, setFilters] = useState<CommentFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const commentsQuery = useAdminComments({
    page,
    pageSize,
    status: filters.status,
    articlePublicId: toOptionalString(filters.articlePublicId),
    authorUserId: filters.authorUserId,
  });
  const columns = getCommentColumns(navigate);

  function applyFilters(values: CommentFilters) {
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
      <Typography.Title level={2}>Comments</Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Form form={form} layout="vertical" onFinish={applyFilters}>
          <Space size={12} wrap align="end">
            <Form.Item label="Status" name="status" style={{ minWidth: 180 }}>
              <Select allowClear options={COMMENT_STATUS_OPTIONS} />
            </Form.Item>
            <Form.Item
              label="Article public ID"
              name="articlePublicId"
              style={{ minWidth: 280 }}
            >
              <Input allowClear />
            </Form.Item>
            <Form.Item label="Author user ID" name="authorUserId">
              <InputNumber min={1} style={{ width: 160 }} />
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
        <Table<AdminCommentItem>
          bordered
          rowKey={(comment) => comment.commentPublicId}
          columns={columns}
          dataSource={commentsQuery.data?.items ?? []}
          loading={commentsQuery.isFetching}
          scroll={{ x: 1950 }}
          locale={{
            emptyText: commentsQuery.isError
              ? "Could not load comments."
              : "No comments found.",
          }}
          pagination={createTablePagination(
            commentsQuery.data,
            { page, pageSize },
            (nextPage, nextPageSize) => {
              setPage(nextPage);
              setPageSize(nextPageSize);
            },
            (total) => `${total} comments`,
          )}
          onRow={(comment) => ({
            onClick: () => navigate(buildCommentPath(comment.commentPublicId)),
          })}
          style={{ border: "1px solid #f0f0f0", borderRadius: 8, overflow: "hidden" }}
        />
      </Card>
    </section>
  );
}
