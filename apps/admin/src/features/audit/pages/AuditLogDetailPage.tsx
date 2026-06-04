import { ArrowLeftOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Skeleton,
  Space,
  Tabs,
  Typography,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTES } from "../../../shared/constants/routes";
import { useAdminUserDetail } from "../../identity/hooks/useAdminUserDetail";
import { useAdminAuditLogDetail } from "../hooks/log/useAdminAuditLogDetail";
import {
  formatDateTime,
  renderCodeText,
  renderJsonBlock,
  renderOptionalText,
  renderOutcomeTag,
  renderRiskTag,
  renderSeverityTag,
} from "../utils/auditUi";

function normalizeOptionalText(value?: string | null) {
  const normalized = value?.trim();

  return normalized ? normalized : null;
}

export function AuditLogDetailPage() {
  const { publicId } = useParams();
  const navigate = useNavigate();
  const logQuery = useAdminAuditLogDetail(publicId);
  const log = logQuery.data;
  const actorInternalId =
    log?.actor.actorInternalId && log.actor.actorInternalId > 0
      ? log.actor.actorInternalId
      : null;
  const actorUserQuery = useAdminUserDetail(actorInternalId);

  const actorUserId =
    normalizeOptionalText(log?.actor.actorUserId) ??
    normalizeOptionalText(actorUserQuery.data?.publicId);
  const actorEmail =
    normalizeOptionalText(log?.actor.actorEmail) ??
    normalizeOptionalText(actorUserQuery.data?.email);
  const actorDisplayName =
    normalizeOptionalText(log?.actor.actorDisplayName) ??
    normalizeOptionalText(actorUserQuery.data?.fullName);
  const identityLoadingText = actorUserQuery.isFetching
    ? "Loading identity..."
    : null;

  if (logQuery.isLoading) {
    return <Skeleton active paragraph={{ rows: 10 }} />;
  }

  if (!log) {
    return (
      <section>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.AUDIT_LOGS)}>
          Back
        </Button>
        <Alert
          type="error"
          showIcon
          message={logQuery.isError ? "Could not load audit log." : "Audit log not found."}
          style={{ marginTop: 16 }}
        />
      </section>
    );
  }

  return (
    <section>
      <Space style={{ marginBottom: 16 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(ROUTES.AUDIT_LOGS)}>
          Back
        </Button>
      </Space>

      <Typography.Title level={2} style={{ marginTop: 0 }}>
        Audit log detail
      </Typography.Title>

      <Card style={{ marginBottom: 16 }}>
        <Descriptions bordered column={2} size="small">
          <Descriptions.Item label="Public ID">
            {renderCodeText(log.publicId)}
          </Descriptions.Item>
          <Descriptions.Item label="Message ID">
            {renderCodeText(log.messageId)}
          </Descriptions.Item>
          <Descriptions.Item label="Event type">
            {renderCodeText(log.eventType)}
          </Descriptions.Item>
          <Descriptions.Item label="Event version">
            {renderOptionalText(log.eventVersion)}
          </Descriptions.Item>
          <Descriptions.Item label="Source module">
            {renderOptionalText(log.sourceModule)}
          </Descriptions.Item>
          <Descriptions.Item label="Action">
            {renderOptionalText(log.action)}
          </Descriptions.Item>
          <Descriptions.Item label="Action category">
            {renderOptionalText(log.actionCategory)}
          </Descriptions.Item>
          <Descriptions.Item label="Outcome">
            {renderOutcomeTag(log.outcome)}
          </Descriptions.Item>
          <Descriptions.Item label="Severity">
            {renderSeverityTag(log.severity)}
          </Descriptions.Item>
          <Descriptions.Item label="Risk level">
            {renderRiskTag(log.riskLevel)}
          </Descriptions.Item>
          <Descriptions.Item label="Summary" span={2}>
            {renderOptionalText(log.summary)}
          </Descriptions.Item>
          <Descriptions.Item label="Reason" span={2}>
            {renderOptionalText(log.reason)}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs
        items={[
          {
            key: "context",
            label: "Context",
            children: (
              <Card>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Actor type">
                    {renderOptionalText(log.actor.actorType)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Actor internal ID">
                    {renderOptionalText(log.actor.actorInternalId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Actor user ID">
                    {renderOptionalText(actorUserId ?? identityLoadingText)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Actor email">
                    {renderOptionalText(actorEmail ?? identityLoadingText)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Actor display name" span={2}>
                    {renderOptionalText(actorDisplayName ?? identityLoadingText)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Resource type">
                    {renderOptionalText(log.resource.type)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Resource ID">
                    {renderCodeText(log.resource.id)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Resource display name" span={2}>
                    {renderOptionalText(log.resource.displayName)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aggregate type">
                    {renderOptionalText(log.aggregate.type)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aggregate ID">
                    {renderOptionalText(log.aggregate.id)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aggregate public ID">
                    {renderOptionalText(log.aggregate.publicId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Aggregate version">
                    {renderOptionalText(log.aggregate.version)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: "trace",
            label: "Trace",
            children: (
              <Card>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Correlation ID">
                    {renderCodeText(log.correlationId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Causation ID">
                    {renderCodeText(log.causationId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Trace ID">
                    {renderCodeText(log.traceId)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Source priority">
                    {renderOptionalText(log.sourcePriority)}
                  </Descriptions.Item>
                  <Descriptions.Item label="IP address">
                    {renderOptionalText(log.ipAddress)}
                  </Descriptions.Item>
                  <Descriptions.Item label="User agent">
                    {renderOptionalText(log.userAgent)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Occurred at">
                    {formatDateTime(log.occurredAtUtc)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ingested at">
                    {formatDateTime(log.ingestedAtUtc)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Created at">
                    {formatDateTime(log.createdAtUtc)}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ),
          },
          {
            key: "payload",
            label: "Payload",
            children: (
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Card title="Sanitized payload">
                  {renderJsonBlock(log.sanitizedPayloadJson)}
                </Card>
                <Card title="Metadata">
                  {renderJsonBlock(log.metadataJson)}
                </Card>
                <Card title="Headers">
                  {renderJsonBlock(log.headersJson)}
                </Card>
              </Space>
            ),
          },
          {
            key: "changes",
            label: "Changes",
            children: (
              <Space direction="vertical" size={16} style={{ width: "100%" }}>
                <Card title="Before">
                  {renderJsonBlock(log.beforeJson)}
                </Card>
                <Card title="After">
                  {renderJsonBlock(log.afterJson)}
                </Card>
                <Card title="Changes">
                  {renderJsonBlock(log.changesJson)}
                </Card>
              </Space>
            ),
          },
        ]}
      />
    </section>
  );
}
