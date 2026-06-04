export type AdminAuditActor = {
  actorInternalId?: number | null;
  actorUserId?: string | null;
  actorEmail?: string | null;
  actorDisplayName?: string | null;
  actorType: string;
};

export type AdminAuditAggregate = {
  type?: string | null;
  id?: string | null;
  publicId?: string | null;
  version?: number | null;
};

export type AdminAuditResource = {
  type: string;
  id: string;
  displayName?: string | null;
};

export type AdminAuditSortDirection = 'asc' | 'desc';

export type AdminAuditTableSort = {
  sortBy?: string | null;
  sortDirection?: AdminAuditSortDirection | null;
};