import {
  FileImageOutlined,
  FileOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Image, Tag, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import { ADMIN_MEDIA_TYPES } from "../constants/mediaConstants";
import type { AdminMediaAssetType } from "../types/adminMediaAsset.types";

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

const mediaPreviewFallbackStyle: CSSProperties = {
  alignItems: "center",
  background: "#f5f5f5",
  border: "1px solid #f0f0f0",
  borderRadius: 8,
  color: "#6b7280",
  display: "flex",
  justifyContent: "center",
};

type MediaPreviewAsset = {
  mediaType: AdminMediaAssetType;
  url?: string | null;
  fileName: string;
  mimeType?: string | null;
  altText?: string | null;
  defaultAltText?: string | null;
};

const missingImagePreviewFallback = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
    <rect width="160" height="160" rx="14" fill="#f5f5f5"/>
    <path d="M49 102l18-21 14 15 13-17 18 23H49z" fill="#d1d5db"/>
    <rect x="43" y="43" width="74" height="74" rx="10" fill="none" stroke="#9ca3af" stroke-width="8"/>
    <circle cx="62" cy="62" r="8" fill="#9ca3af"/>
    <text x="80" y="136" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#6b7280">Unavailable</text>
  </svg>`,
)}`;

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

export function formatBytes(value?: number | null) {
  if (!value || value <= 0) {
    return "N/A";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function formatDimensions(
  width?: number | null,
  height?: number | null,
) {
  if (!width || !height) {
    return "N/A";
  }

  return `${width} x ${height}`;
}

export function toNullableString(value?: string | null) {
  const normalizedValue = value?.trim();

  return normalizedValue ? normalizedValue : null;
}

export function getMediaAssetPath(mediaId: number) {
  return `/media/assets/${mediaId}`;
}

export function getArticleMediaPath(articleId: number) {
  return `/media/articles/${articleId}`;
}

export function getMediaSourceUrl(url?: string | null) {
  if (!url) {
    return "";
  }

  if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (!apiBaseUrl || !url.startsWith("/")) {
    return url;
  }

  return `${apiBaseUrl.replace(/\/$/, "")}${url}`;
}

export function renderOptionalText(value?: string | null) {
  return (
    <Typography.Text style={wrappingTextStyle}>
      {value || "N/A"}
    </Typography.Text>
  );
}

export function renderMediaTypeTag(mediaType: AdminMediaAssetType) {
  const colorByType: Record<AdminMediaAssetType, string> = {
    [ADMIN_MEDIA_TYPES.IMAGE]: "blue",
    [ADMIN_MEDIA_TYPES.VIDEO]: "purple",
    [ADMIN_MEDIA_TYPES.FILE]: "default",
  };

  return <Tag color={colorByType[mediaType]}>{mediaType}</Tag>;
}

export function renderDeletedTag(isDeleted: boolean) {
  return isDeleted ? (
    <Tag color="error">Deleted</Tag>
  ) : (
    <Tag color="success">Active</Tag>
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

function renderMediaFallback(asset: MediaPreviewAsset, size: number) {
  const icon =
    asset.mediaType === ADMIN_MEDIA_TYPES.VIDEO ? (
      <VideoCameraOutlined />
    ) : asset.mediaType === ADMIN_MEDIA_TYPES.FILE ? (
      <FileOutlined />
    ) : (
      <FileImageOutlined />
    );

  return (
    <div
      style={{
        ...mediaPreviewFallbackStyle,
        fontSize: Math.max(18, Math.round(size / 3)),
        height: size,
        width: size,
      }}
    >
      {icon}
    </div>
  );
}

function canPreviewFile(asset: MediaPreviewAsset) {
  const mimeType = asset.mimeType?.toLowerCase() ?? "";
  const fileName = asset.fileName.toLowerCase();

  return (
    mimeType === "application/pdf" ||
    mimeType === "application/json" ||
    mimeType === "application/xml" ||
    mimeType === "image/svg+xml" ||
    mimeType.startsWith("text/") ||
    /\.(csv|json|md|pdf|svg|txt|xml)$/.test(fileName)
  );
}

function renderFramePreview(
  sourceUrl: string,
  title: string,
  size: number,
) {
  return (
    <iframe
      src={sourceUrl}
      title={title}
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        display: "block",
        height: size,
        pointerEvents: "none",
        width: size,
      }}
    />
  );
}

export function renderMediaPreview(
  asset: MediaPreviewAsset,
  size = 72,
): ReactNode {
  const sourceUrl = getMediaSourceUrl(asset.url);

  if (asset.mediaType === ADMIN_MEDIA_TYPES.IMAGE && asset.url) {
    return (
      <Image
        alt={asset.altText || asset.defaultAltText || asset.fileName}
        fallback={missingImagePreviewFallback}
        height={size}
        preview={false}
        src={sourceUrl}
        style={{
          borderRadius: 8,
          display: "block",
          objectFit: "cover",
        }}
        width={size}
      />
    );
  }

  if (asset.mediaType === ADMIN_MEDIA_TYPES.VIDEO && sourceUrl) {
    return (
      <video
        muted
        playsInline
        preload="metadata"
        src={sourceUrl}
        style={{
          background: "#000",
          borderRadius: 8,
          display: "block",
          height: size,
          objectFit: "cover",
          pointerEvents: "none",
          width: size,
        }}
      >
        <track kind="captions" />
      </video>
    );
  }

  if (
    asset.mediaType === ADMIN_MEDIA_TYPES.FILE &&
    sourceUrl &&
    canPreviewFile(asset)
  ) {
    return renderFramePreview(sourceUrl, asset.fileName, size);
  }

  return renderMediaFallback(asset, size);
}

export function renderMediaDetailPreview(asset: MediaPreviewAsset): ReactNode {
  const sourceUrl = getMediaSourceUrl(asset.url);

  if (!sourceUrl) {
    return renderMediaFallback(asset, 160);
  }

  if (asset.mediaType === ADMIN_MEDIA_TYPES.IMAGE) {
    return (
      <Image
        alt={asset.altText || asset.defaultAltText || asset.fileName}
        fallback={missingImagePreviewFallback}
        preview
        src={sourceUrl}
        style={{
          borderRadius: 8,
          display: "block",
          maxHeight: 560,
          objectFit: "contain",
          width: "100%",
        }}
      />
    );
  }

  if (asset.mediaType === ADMIN_MEDIA_TYPES.VIDEO) {
    return (
      <video
        controls
        src={sourceUrl}
        style={{
          background: "#000",
          borderRadius: 8,
          display: "block",
          maxHeight: 560,
          width: "100%",
        }}
      >
        <track kind="captions" />
      </video>
    );
  }

  if (!canPreviewFile(asset)) {
    return renderMediaFallback(asset, 160);
  }

  return (
    <iframe
      src={sourceUrl}
      title={asset.fileName}
      style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
        display: "block",
        height: 560,
        width: "100%",
      }}
    />
  );
}
