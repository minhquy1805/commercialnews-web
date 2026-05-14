export const ContentFieldLimits = {
  publicIdLength: 26,

  articleTitleMaxLength: 300,
  articleSummaryMaxLength: 1000,

  categoryNameMaxLength: 200,
  categoryNameNormalizedMaxLength: 200,

  tagNameMaxLength: 150,
  tagNameNormalizedMaxLength: 150,
  tagDescriptionMaxLength: 500,

  lifecycleActionTypeMaxLength: 30,
  lifecycleStatusMaxLength: 30,
  lifecycleReasonMaxLength: 500,

  correlationIdMaxLength: 100,
  changeSummaryMaxLength: 300,
} as const;