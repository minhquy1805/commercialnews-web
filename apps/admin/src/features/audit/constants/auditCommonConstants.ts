export const AUDIT_FIELD_LIMITS = {
  publicIdLength: 26,
  messageIdLength: 26,
  hashLength: 64,

  maxEventTypeLength: 200,
  maxSourceModuleLength: 100,

  maxActionLength: 120,
  maxActionCategoryLength: 100,

  maxAggregateTypeLength: 100,
  maxAggregateIdLength: 100,

  maxResourceTypeLength: 100,
  maxResourceIdLength: 100,
  maxResourceDisplayNameLength: 300,

  maxActorEmailLength: 320,
  maxActorDisplayNameLength: 200,

  maxSummaryLength: 500,

  maxCorrelationIdLength: 100,
  maxCausationIdLength: 100,
  maxTraceIdLength: 100,

  maxIpAddressLength: 45,
  maxUserAgentLength: 500,

  maxConsumerNameLength: 150,

  maxErrorCodeLength: 100,
  maxErrorMessageLength: 2000,

  minSourcePriority: 1,
  maxSourcePriority: 9,

  minVersion: 1,
} as const;