import { ArrowLeftOutlined } from "@ant-design/icons";
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
import {
  MODERATION_CASE_STATUS,
  MODERATION_REASON,
  MODERATION_REASON_OPTIONS,
  type ModerationReason,
} from "../constants/interactionConstants";
import { useAdminModerationCaseDetail } from "../hooks/moderation-case/useAdminModerationCaseDetail";
import { useDismissAdminModerationCase } from "../hooks/moderation-case/useDismissAdminModerationCase";
import { useHideAdminModerationCaseComment } from "../hooks/moderation-case/useHideAdminModerationCaseComment";
import type { AdminModerationCaseReport } from "../types/adminModerationCase.types";
import {
  buildArticleInteractionStatsPath,
  buildCommentPath,
  formatDateTime,
  renderAlertLevelTag,
  renderCommentStatusTag,
  renderModerationCaseStatusTag,
  renderOptionalText,
  renderPriorityTag,
  renderReasonTag,
  renderReportStatusTag,
  renderResolutionTypeTag,
  renderSeverityTag,
  toNullableString,
  wrappingTextStyle,
} from "../utils/interactionUi";

type CaseActionFormValues = {
  reasonCode: ModerationReason;
  note?: string;
};

function getReportColumns(): TableProps<AdminModerationCaseReport>["columns"] {
  return [
    {
      title: "Report ID",
      dataIndex: "commentReportPublicId",
      key: "commentReportPublicId",
      width: 260,
      render: renderOptionalText,
    },
    {
      title: "Reporter",
      dataIndex: "reporterUserId",
      key: "reporterUserId",
      width: 120,
    },
    {
      title: "Reason",
      dataIndex: "reasonCode",
      key: "reasonCode",
      width: 170,
      render: renderReasonTag,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: renderReportStatusTag,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 340,
      render: renderOptionalText,
    },
    {
      title: "Created at",
      dataIndex: "createdAtUtc",
      key: "createdAtUtc",
      width: 190,
      render: formatDateTime,
    },
  ];
}

export function InteractionModerationCaseDetailPage() {
  const { casePublicId } = useParams();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [dismissForm] = Form.useForm<CaseActionFormValues>();
  const [hideForm] = Form.useForm<CaseActionFormValues>();
  const [isDismissModalOpen, setIsDismissModalOpen] = useState(false);
  const [isHideModalOpen, setIsHideModalOpen] = useState(false);

  const caseQuery = useAdminModerationCaseDetail(casePublicId);
  const dismissCaseMutation = useDismissAdminModerationCase();
  const hideCaseCommentMutation = useHideAdminModerationCaseComment();
  const moderationCase = caseQuery.data;

  function openDismissModal() {
    dismissForm.setFieldsValue({ reasonCode: MODERATION_REASON.Spam, note: "" });
    setIsDismissModalOpen(true);
  }

  function openHideModal() {
    hideForm.setFieldsValue({ reasonCode: MODERATION_REASON.Spam, note: "" });
    setIsHideModalOpen(true);
  }

  async function dismissCase() {
    if (!casePublicId || !moderationCase) {
      return;
    }

    const values = await dismissForm.validateFields();

    try {
      await dismissCaseMutation.mutateAsync({
        casePublicId,
        expectedCaseVersion: moderationCase.version,
        reasonCode: values.reasonCode,
        note: toNullableString(values.note),
      });
      notification.success({ title: "Moderation case dismissed.", placement: "topRight" });
      setIsDismissModalOpen(false);
    } catch (error) {
      notification.error({
        title: "Could not dismiss case.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  async function hideComment() {
    if (!casePublicId || !moderationCase) {
      return;
    }

    const values = await hideForm.validateFields();

    try {
      await hideCaseCommentMutation.mutateAsync({
        casePublicId,
        expectedCaseVersion: moderationCase.version,
        expectedCommentVersion: moderationCase.comment.version,
        reasonCode: values.reasonCode,
        note: toNullableString(values.note),
      });
      notification.success({ title: "Reported comment hidden.", placement: "topRight" });
      setIsHideModalOpen(false);
    } catch (error) {
      notification.error({
        title: "Could not hide reported comment.",
        description: getApiErrorDescription(error),
        placement: "topRight",
      });
    }
  }

  function renderReasonNoteRule() {
    return [
      ({ getFieldValue }: { getFieldValue: (name: string) => unknown }) => ({
        validator: (_: unknown, value?: string) => {
          if (
            getFieldValue("reasonCode") === MODERATION_REASON.Other &&
            !value?.trim()
          ) {
            return Promise.reject(new Error("Note is required for Other."));
          }

          return Promise.resolve();
        },
      }),
    ];
  }

  if (!casePublicId) {
    return (
      <Card>
        <Typography.Text type="secondary">Invalid moderation case id.</Typography.Text>
      </Card>
    );
  }

  if (caseQuery.isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!moderationCase) {
    return (
      <Card>
        <Typography.Text type="secondary">
          Moderation case information is not available.
        </Typography.Text>
      </Card>
    );
  }

  return (
    <section>
      <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.INTERACTION_MODERATION_CASES)}>
        Back to moderation cases
      </Button>

      <Card style={{ marginTop: 16 }}>
        <Typography.Title level={2} style={{ marginTop: 0 }}>
          Moderation case
        </Typography.Title>
        <Space size={8} wrap>
          {renderModerationCaseStatusTag(moderationCase.status)}
          {renderPriorityTag(moderationCase.priority)}
          {renderSeverityTag(moderationCase.highestSeverity)}
        </Space>

        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }} style={{ marginTop: 24 }}>
          <Descriptions.Item label="Case public ID">
            <Typography.Text style={wrappingTextStyle}>
              {moderationCase.commentModerationCasePublicId}
            </Typography.Text>
          </Descriptions.Item>
          <Descriptions.Item label="Version">{moderationCase.version}</Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderModerationCaseStatusTag(moderationCase.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Priority">
            {renderPriorityTag(moderationCase.priority)}
          </Descriptions.Item>
          <Descriptions.Item label="Highest severity">
            {renderSeverityTag(moderationCase.highestSeverity)}
          </Descriptions.Item>
          <Descriptions.Item label="Alert level">
            {renderAlertLevelTag(moderationCase.alertLevel)}
          </Descriptions.Item>
          <Descriptions.Item label="Opened at">
            {formatDateTime(moderationCase.openedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Alert triggered at">
            {formatDateTime(moderationCase.alertTriggeredAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Resolved at">
            {formatDateTime(moderationCase.resolvedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Resolution type">
            {renderResolutionTypeTag(moderationCase.resolutionType)}
          </Descriptions.Item>
          <Descriptions.Item label="Resolution reason">
            {renderReasonTag(moderationCase.resolutionReasonCode)}
          </Descriptions.Item>
          <Descriptions.Item label="Resolution note">
            {renderOptionalText(moderationCase.resolutionNote)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Comment" style={{ marginTop: 16 }}>
        <Descriptions bordered column={{ xs: 1, sm: 1, md: 2 }}>
          <Descriptions.Item label="Comment public ID">
            <Typography.Link onClick={() => navigate(buildCommentPath(moderationCase.comment.commentPublicId))}>
              {moderationCase.comment.commentPublicId}
            </Typography.Link>
          </Descriptions.Item>
          <Descriptions.Item label="Article public ID">
            <Typography.Link
              onClick={() => navigate(buildArticleInteractionStatsPath(moderationCase.comment.articlePublicId))}
            >
              {moderationCase.comment.articlePublicId}
            </Typography.Link>
          </Descriptions.Item>
          <Descriptions.Item label="Author user ID">
            {moderationCase.comment.authorUserId}
          </Descriptions.Item>
          <Descriptions.Item label="Comment version">
            {moderationCase.comment.version}
          </Descriptions.Item>
          <Descriptions.Item label="Comment status">
            {renderCommentStatusTag(moderationCase.comment.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Content" span={2}>
            <Typography.Text style={wrappingTextStyle}>
              {moderationCase.comment.content}
            </Typography.Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Actions" style={{ marginTop: 16 }}>
        <Space size={8} wrap>
          <Button
            disabled={moderationCase.status !== MODERATION_CASE_STATUS.Open}
            onClick={openDismissModal}
          >
            Dismiss case
          </Button>
          <Button
            danger
            disabled={moderationCase.status !== MODERATION_CASE_STATUS.Open}
            onClick={openHideModal}
          >
            Hide reported comment
          </Button>
        </Space>
      </Card>

      <Card title="Reports" style={{ marginTop: 16 }}>
        <Table<AdminModerationCaseReport>
          bordered
          rowKey={(report) => report.commentReportPublicId}
          columns={getReportColumns()}
          dataSource={moderationCase.reports}
          pagination={false}
          scroll={{ x: 1420 }}
          locale={{ emptyText: "No reports found." }}
        />
      </Card>

      <Modal
        title="Dismiss case"
        open={isDismissModalOpen}
        forceRender
        okText="Dismiss"
        confirmLoading={dismissCaseMutation.isPending}
        onOk={dismissCase}
        onCancel={() => setIsDismissModalOpen(false)}
      >
        <Form form={dismissForm} layout="vertical">
          <Form.Item
            label="Reason"
            name="reasonCode"
            rules={[{ required: true, message: "Reason is required." }]}
          >
            <Select options={MODERATION_REASON_OPTIONS} />
          </Form.Item>
          <Form.Item label="Note" name="note" rules={renderReasonNoteRule()}>
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Hide reported comment"
        open={isHideModalOpen}
        forceRender
        okText="Hide"
        okButtonProps={{ danger: true, loading: hideCaseCommentMutation.isPending }}
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
          <Form.Item label="Note" name="note" rules={renderReasonNoteRule()}>
            <Input.TextArea rows={4} maxLength={1000} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}
