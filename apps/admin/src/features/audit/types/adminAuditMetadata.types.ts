export type AdminAuditModule = {
  sourceModule: string;
  description: string;
};

export type GetAdminAuditModulesResponse = {
  items: AdminAuditModule[];
};

export type GetAdminAuditModuleActionsResponse = {
  sourceModule: string;
  items: string[];
};