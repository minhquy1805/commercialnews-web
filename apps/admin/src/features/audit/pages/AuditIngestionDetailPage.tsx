import { ArrowLeftOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Descriptions, Skeleton, Space, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminAuditIngestionDetail } from "../hooks/ingestion/useAdminAuditIngestionDetail";
import {
  formatDateTime,
  renderCodeText,
  renderIngestionStatusTag,
  renderOptionalText,
} from "../utils/auditUi";

export function AuditIngestionDetailPage() {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const ingestionQuery = useAdminAuditIngestionDetail(publicId);
  const ingestion = ingestionQuery.data;

  if (ingestionQuery.isLoading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (!ingestion) {
    return (
      <section>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.AUDIT_INGESTIONS)}>
          Back
        </Button>
        <Alert
          type="error"
          showIcon
          message={
            ingestionQuery.isError
              ? "Could not load audit ingestion."
              : "Audit ingestion not found."
          }
          style={{ marginTop: 16 }}
        />
      </section>
    );
  }

  return (
    <section>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.AUDIT_INGESTIONS)}>
          Back
        </Button>
      </Space>

      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Audit ingestion detail
      </Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Public ID">
            {renderCodeText(ingestion.publicId)}
          </Descriptions.Item>
          <Descriptions.Item label="Message ID">
            {renderCodeText(ingestion.messageId)}
          </Descriptions.Item>
          <Descriptions.Item label="Event type">
            {renderCodeText(ingestion.eventType)}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {renderIngestionStatusTag(ingestion.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Consumer">
            {renderOptionalText(ingestion.consumerName)}
          </Descriptions.Item>
          <Descriptions.Item label="Attempt count">
            {renderOptionalText(ingestion.attemptCount)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Aggregate type">
            {renderOptionalText(ingestion.aggregateType)}
          </Descriptions.Item>
          <Descriptions.Item label="Aggregate ID">
            {renderOptionalText(ingestion.aggregateId)}
          </Descriptions.Item>
          <Descriptions.Item label="Aggregate public ID">
            {renderOptionalText(ingestion.aggregatePublicId)}
          </Descriptions.Item>
          <Descriptions.Item label="Aggregate version">
            {renderOptionalText(ingestion.aggregateVersion)}
          </Descriptions.Item>
          <Descriptions.Item label="Correlation ID">
            {renderCodeText(ingestion.correlationId)}
          </Descriptions.Item>
          <Descriptions.Item label="Source priority">
            {renderOptionalText(ingestion.sourcePriority)}
          </Descriptions.Item>
          <Descriptions.Item label="Source occurred at">
            {formatDateTime(ingestion.sourceOccurredAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Source published at">
            {formatDateTime(ingestion.sourcePublishedAtUtc)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="First received">
            {formatDateTime(ingestion.firstReceivedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Last attempt">
            {formatDateTime(ingestion.lastAttemptAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Processed at">
            {formatDateTime(ingestion.processedAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Dead-lettered at">
            {formatDateTime(ingestion.deadLetteredAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {formatDateTime(ingestion.createdAtUtc)}
          </Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {formatDateTime(ingestion.updatedAtUtc)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Last error code">
            {renderCodeText(ingestion.lastErrorCode)}
          </Descriptions.Item>
          <Descriptions.Item label="Last error class">
            {renderOptionalText(ingestion.lastErrorClass)}
          </Descriptions.Item>
          <Descriptions.Item label="Last error message">
            {renderOptionalText(ingestion.lastErrorMessage)}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </section>
  );
}
