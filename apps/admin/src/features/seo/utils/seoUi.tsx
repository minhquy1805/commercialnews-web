import { Tag, Typography } from "antd";
import type { CSSProperties } from "react";
import { SEO_RESOURCE_TYPES } from "../constants/seoConstants";

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

export function formatDateTime(value: string | null) {
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

export function buildArticleSeoSettingsPath(articlePublicId: string) {
  return `/seo/articles/${encodeURIComponent(articlePublicId)}`;
}

export function isArticleResource(resourceType: string) {
  return resourceType === SEO_RESOURCE_TYPES.ARTICLE;
}

export function renderOptionalText(value: string | null) {
  return (
    <Typography.Text style={wrappingTextStyle}>
      {value || "N/A"}
    </Typography.Text>
  );
}

export function renderBooleanTag(
  value: boolean,
  trueLabel: string,
  falseLabel: string,
) {
  return value ? (
    <Tag color="success">{trueLabel}</Tag>
  ) : (
    <Tag color="default">{falseLabel}</Tag>
  );
}

export function renderNullableBooleanTag(
  value: boolean | null,
  trueLabel: string,
  falseLabel: string,
) {
  if (value === null) {
    return <Tag color="default">N/A</Tag>;
  }

  return renderBooleanTag(value, trueLabel, falseLabel);
}

export function renderScopeTag(scope: string) {
  return <Tag color="blue">{scope}</Tag>;
}

export function renderResourceTypeTag(resourceType: string) {
  return <Tag color={isArticleResource(resourceType) ? "geekblue" : "default"}>{resourceType}</Tag>;
}
