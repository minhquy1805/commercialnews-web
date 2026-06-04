import { Tag, Typography } from "antd";
import type { CSSProperties } from "react";
import {
  AUDIT_INGESTION_STATUSES,
  AUDIT_OUTCOMES,
  AUDIT_RISK_LEVELS,
  AUDIT_SEVERITIES,
} from "../constants";

export const wrappingTextStyle: CSSProperties = {
  display: "block",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  lineHeight: 1.35,
};

export const preWrapTextStyle: CSSProperties = {
  ...wrappingTextStyle,
  whiteSpace: "pre-wrap",
};

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "N/A";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

export function toNullableString(value?: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export function renderOptionalText(value?: string | number | null) {
  return (
    <Typography.Text style={wrappingTextStyle}>
      {value ?? "N/A"}
    </Typography.Text>
  );
}

export function renderCodeText(value?: string | number | null) {
  if (value === null || value === undefined || value === "") {
    return <Tag>N/A</Tag>;
  }

  return (
    <Typography.Text code style={wrappingTextStyle}>
      {value}
    </Typography.Text>
  );
}

function formatJsonValue(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function renderJsonBlock(value?: string | null) {
  if (!value) {
    return <Typography.Text type="secondary">N/A</Typography.Text>;
  }

  const formattedValue = formatJsonValue(value);

  return (
    <Typography.Paragraph
      style={{
        ...preWrapTextStyle,
        marginBottom: 0,
        maxHeight: 420,
        overflow: "auto",
        padding: 12,
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        background: "#fafafa",
        fontFamily:
          "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        fontSize: 12,
      }}
    >
      {formattedValue}
    </Typography.Paragraph>
  );
}

export function renderSeverityTag(severity?: string | null) {
  if (!severity) {
    return <Tag>N/A</Tag>;
  }

  const color =
    severity === AUDIT_SEVERITIES.Critical
      ? "red"
      : severity === AUDIT_SEVERITIES.Error
        ? "volcano"
        : severity === AUDIT_SEVERITIES.Warning
          ? "gold"
          : "blue";

  return <Tag color={color}>{severity}</Tag>;
}

export function renderRiskTag(riskLevel?: string | null) {
  if (!riskLevel) {
    return <Tag>N/A</Tag>;
  }

  const color =
    riskLevel === AUDIT_RISK_LEVELS.Critical
      ? "red"
      : riskLevel === AUDIT_RISK_LEVELS.High
        ? "volcano"
        : riskLevel === AUDIT_RISK_LEVELS.Medium
          ? "gold"
          : "green";

  return <Tag color={color}>{riskLevel}</Tag>;
}

export function renderOutcomeTag(outcome?: string | null) {
  if (!outcome) {
    return <Tag>N/A</Tag>;
  }

  const color =
    outcome === AUDIT_OUTCOMES.Success
      ? "green"
      : outcome === AUDIT_OUTCOMES.Failure
        ? "red"
        : outcome === AUDIT_OUTCOMES.Denied
          ? "volcano"
          : "default";

  return <Tag color={color}>{outcome}</Tag>;
}

export function renderIngestionStatusTag(status?: string | null) {
  if (!status) {
    return <Tag>N/A</Tag>;
  }

  const color =
    status === AUDIT_INGESTION_STATUSES.Succeeded
      ? "green"
      : status === AUDIT_INGESTION_STATUSES.Failed ||
          status === AUDIT_INGESTION_STATUSES.DeadLettered
        ? "red"
        : status === AUDIT_INGESTION_STATUSES.Processing
          ? "processing"
          : "default";

  return <Tag color={color}>{status}</Tag>;
}

export function buildAuditLogPath(publicId: string) {
  return `/audit/logs/${encodeURIComponent(publicId)}`;
}

export function buildAuditIngestionPath(publicId: string) {
  return `/audit/ingestions/${encodeURIComponent(publicId)}`;
}
