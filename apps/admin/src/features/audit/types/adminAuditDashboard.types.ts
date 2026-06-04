import type { AdminAuditLogListItem } from './adminAuditLog.types';

export type GetAdminAuditDashboardSummaryRequest = {
  fromUtc?: string | null;
  toUtc?: string | null;
  sourceModule?: string | null;
};

export type GetAdminRecentRiskEventsRequest = {
  fromUtc?: string | null;
  toUtc?: string | null;
  sourceModule?: string | null;
  riskLevel?: string | null;
  limit?: number;
};

export type AdminAuditDashboardWindow = {
  fromUtc?: string | null;
  toUtc?: string | null;
};

export type AdminAuditDashboardTotals = {
  auditEvents: number;
  highRiskEvents: number;
  criticalEvents: number;
  failedIngestion: number;
  duplicateIngestion: number;
};

export type AdminAuditDashboardCountByModule = {
  sourceModule: string;
  count: number;
};

export type AdminAuditDashboardCountBySeverity = {
  severity: string;
  count: number;
};

export type AdminAuditDashboardCountByRiskLevel = {
  riskLevel: string;
  count: number;
};

export type AdminAuditDashboardFreshness = {
  generatedAtUtc: string;
  oldestFailedIngestionAgeSeconds?: number | null;
};

export type AdminAuditDashboardSummary = {
  window: AdminAuditDashboardWindow;
  totals: AdminAuditDashboardTotals;
  byModule: AdminAuditDashboardCountByModule[];
  bySeverity: AdminAuditDashboardCountBySeverity[];
  byRiskLevel: AdminAuditDashboardCountByRiskLevel[];
  freshness: AdminAuditDashboardFreshness;
};

export type AdminRecentRiskEvents = {
  items: AdminAuditLogListItem[];
};