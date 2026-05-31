import { ArrowLeftOutlined, EyeOutlined } from "@ant-design/icons";
import {
  App,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Select,
  Skeleton,
  Space,
  Table,
  type TableProps,
  Typography,
} from "antd";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getApiErrorDescription } from "../../../shared/api/apiError";
import { ROUTES } from "../../../shared/constants/routes";
import { createTablePagination } from "../../../shared/pagination";
import {
  COMMENT_STATUS,
  MODERATION_REASON,
  MODERATION_REASON_OPTIONS,
  type ModerationReason,
} from "../constants/interactionConstants";
import { useAdminCommentDetail } from "../hooks/comment/useAdminCommentDetail";
import { useAdminCommentModerationHistory } from "../hooks/comment/useAdminCommentModerationHistory";
import { useHideAdminComment } from "../hooks/comment/useHideAdminComment";
import { useRestoreAdminComment } from "../hooks/comment/useRestoreAdminComment";
import type { AdminCommentModerationHistoryItem } from "../types/adminComment.types";
import {
  buildArticleInteractionStatsPath,
  buildModerationCasePath,
  formatDateTime,
  renderActionTypeTag,
  renderCommentStatusTag,
  renderOptionalText,
  renderReasonTag,
  toNullableString,
  wrappingTextStyle,
} from "../utils/interactionUi";

type HideCommentFormValues = {
  reasonCode: ModerationReason;
  note?: string;
};

type RestoreCommentFormValues = {
  note?: string;
};

function getHistoryColumns(
  navigate: ReturnType<typeof useNavigate>,
): TableProps<AdminCommentModerationHistoryItem>["columns"] {
  return [
    {
      title: "History ID",
      dataIndex: "historyPublicId",
      key: "historyPublicId",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      width: 190,
      render: renderActionTypeTag,
    },
    {
      title: "From",
      dataIndex: "fromStatus",
      key: "fromStatus",
      width: 120,
      render: (status) => (status ? renderCommentStatusTag(status) : renderOptionalText(null)),
    },
    {
      title: "To",
      dataIndex: "toStatus",
      key: "toStatus",
      width: 120,
      render: (status) => (status ? renderCommentStatusTag(status) : renderOptionalText(null)),
    },
    {
      title: "Case",
      dataIndex: "commentModerationCasePublicId",
      key: "commentModerationCasePublicId",
      width: 260,
      render: (casePublicId: string | null) =>
        casePublicId ? (
          <Typography.Link
            onClick={() => navigate(buildModerationCasePath(casePublicId))}
            style={wrappingTextStyle}
          >
            {casePublicId}
          </Typography.Link>
        ) : (
          renderOptionalText(null)
        ),
    },
    {
      title: "Actor",
      key: "actor",
      width: 180,
      render: (_, item) => `${item.actorType}${item.actorUserId ? ` #${item.actorUserId}` : ""}`,
    },
    {
      title: "Reason",
      dataIndex: "reasonCode",
      key: "reasonCode",
      width: 160,
      render: renderReasonTag,
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 320,
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
      title: "Correlation ID",
      dataIndex: "correlationId",
      key: "correlationId",
      width: 260,
      render: renderOptionalText,
    },
  ];
}

export function InteractionCommentDetailPage() {
  const { commentPublicId } = useParams();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [hideForm] = Form.useForm<HideCommentFormValues>();
  const [restoreForm] = Form.useForm<RestoreCommentFormValues>();
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize, setHistoryPageSize] = useState(10);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const commentQuery = useAdminCommentDetail(commentPublicId);
  const historyQuery = useAdminCommentModerationHistory(commentPublicId, {
    page: historyPage,
    pageSize: historyPageSize,
  });
  const hideCommentMutation = useHideAdminComment();
  const restoreCommentMutation = useRestoreAdminComment();
  const comment = commentQuery.data;
  const historyColumns = getHistoryColumns(navigate);

  function openHideModal() {
    hideForm.setFieldsValue({ reasonCode: MODERATION_REASON.Spam, note: "" });
    setIsHideModalOpen(true);
  }

  function openRestoreModal() {
    restoreForm.setFieldsValue({ note: "" });
    setIsRestoreModalOpen(true);
  }

  async function hideComment() {
    if (!comment || !commentPublicId) {
      return;
    }

    const values = await hideForm.validateFields();

    try {
      await hideCommentMutation.mutateAsync({
        commentPublicId,
        expectedVersion: comment.version,
        reasonCode: values.reasonCode,
        note: toNullableString(values.note),
      });
      notification.success({ title: "Comment hidden.", placement: "topRight" });
      setIsHideModalOpen(false);
    } catch (error) {
      notification.error({
        title: "Could not hide comment.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function restoreComment() {
    if (!comment || !commentPublicId) {
      return;
    }

    const values = await restoreForm.validateFields();

    try {
      await restoreCommentMutation.mutateAsync({
        commentPublicId,
        expectedVersion: comment.version,
        note: toNullableString(values.note),
      });
      notification.success({ title: "Comment restored.", placement: "topRight" });
      setIsRestoreModalOpen(false);
    } catch (error) {
      notification.error({
        title: "Could not restore comment.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  if (!commentPublicId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid comment id.</Typography.Text>
      </Card>
    );
  }

  if (commentQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  if (!comment) {
    return (
      <Card>
        <Typography.Text type="secondary">Comment information is not available.</Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.INTERACTION_COMMENTS)}>
        Back to comments
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Comment
        </Typography.Title>
        <Space size={8} wrap>
          {renderCommentStatusTag(comment.status)}
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(buildArticleInteractionStatsPath(comment.articlePublicId))}
          >
            Article stats
          </Button>
        </Space>

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} style={{ marginTop: 24 }}>
          <Descriptions.Item label="Comment public ID">
            <Typography.Text style={wrappingTextStyle}>{comment.commentPublicId}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Article public ID">
            <Typography.Text style={wrappingTextStyle}>{comment.articlePublicId}</Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Author user ID">{comment.authorUserId}</Descriptions.Item>
          <Descriptions.Item label="Version">{comment.version}</Descriptions.Item>
          <Descriptions.Item label="Status">{renderCommentStatusTag(comment.status)}</Descriptions.Item>
          <Descriptions.Item label="Parent comment">
            {renderOptionalText(comment.parentCommentPublicId)}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">{formatDateTime(comment.createdAtUtc)}</Descriptions.Item>
          <Descriptions.Item label="Updated at">{formatDateTime(comment.updatedAtUtc)}</Descriptions.Item>
          <Descriptions.Item label="Deleted at">{formatDateTime(comment.deletedAtUtc)}</Descriptions.Item>
          <Descriptions.Item label="Content" span={2}>
            <Typography.Text style={wrappingTextStyle}>{comment.content}</Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={8} wrap>
          <Button
            danger
            disabled={comment.status !== COMMENT_STATUS.Visible}
            onClick={openHideModal}
          >
            Hide
          </Button>
          <Button
            disabled={comment.status !== COMMENT_STATUS.Hidden}
            onClick={openRestoreModal}
          >
            Restore
          </Button>
        </Space>
      </Card>

      <Card title="Moderation history" style={{ marginTop: 16 }}>
        <Table<AdminCommentModerationHistoryItem>
          bordered
          rowKey={(item) => item.historyPublicId}
          columns={historyColumns}
          dataSource={historyQuery.data?.items ?? []}
          loading={historyQuery.isFetching}
          scroll={{ x: 2060 }}
          locale={{
            emptyText: historyQuery.isError
              ? "Could not load moderation history."
              : "No moderation history found.",
          }}
          pagination={createTablePagination(
            historyQuery.data,
            { page: historyPage, pageSize: historyPageSize },
            (nextPage, nextPageSize) => {
              setHistoryPage(nextPage);
              setHistoryPageSize(nextPageSize);
            },
          )}
        />
      </Card>

      <Modal
        title="Hide comment"
        open={isHideModalOpen}
        forceRender
        okText="Hide"
        okButtonProps={{ danger: true, loading: hideCommentMutation.isPending }}
        onOk={hideComment}
        onCancel={() => setIsHideModalOpen(false)}
      >
        <Form form={hideForm} layout="vertical">
          <Form.Item
            label="Reason"
            name="reasonCode"
            rules={[{ required: true, message: "Reason is required." }]}
          >
            <Select options={MODERATION_REASON_OPTIONS} />
          </Form.Item>
          <Form.Item
            label="Note"
            name="note"
            rules={[
              ({ getFieldValue }) => ({
                validator: (_, value?: string) => {
                  if (
                    getFieldValue("reasonCode") === MODERATION_REASON.Other &&
                    !value?.trim()
                  ) {
                    return Promise.reject(new Error("Note is required for Other."));
                  }

                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Restore comment"
        open={isRestoreModalOpen}
        forceRender
        okText="Restore"
        confirmLoading={restoreCommentMutation.isPending}
        onOk={restoreComment}
        onCancel={() => setIsRestoreModalOpen(false)}
      >
        <Form form={restoreForm} layout="vertical">
          <Form.Item label="Note" name="note">
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
