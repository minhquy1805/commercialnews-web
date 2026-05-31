export const COMMENT_REPORT_REASON = {
  Spam: 'Spam',
  Harassment: 'Harassment',
  HateSpeech: 'HateSpeech',
  Violence: 'Violence',
  SexualContent: 'SexualContent',
  PersonalInformation: 'PersonalInformation',
  Misinformation: 'Misinformation',
  OffTopic: 'OffTopic',
  Other: 'Other',
} as const;

export type CommentReportReason =
  (typeof COMMENT_REPORT_REASON)[keyof typeof COMMENT_REPORT_REASON];

export const COMMENT_REPORT_REASON_OPTIONS: Array<{
  value: CommentReportReason;
  label: string;
  description: string;
  requiresDescription?: boolean;
}> = [
  {
    value: COMMENT_REPORT_REASON.Spam,
    label: 'Spam',
    description: 'Unwanted, repetitive, or promotional content.',
  },
  {
    value: COMMENT_REPORT_REASON.Harassment,
    label: 'Harassment',
    description: 'Bullying, threats, insults, or targeted abuse.',
  },
  {
    value: COMMENT_REPORT_REASON.HateSpeech,
    label: 'Hate speech',
    description: 'Content attacking protected groups or identities.',
  },
  {
    value: COMMENT_REPORT_REASON.Violence,
    label: 'Violence',
    description: 'Violent threats or encouragement of physical harm.',
  },
  {
    value: COMMENT_REPORT_REASON.SexualContent,
    label: 'Sexual content',
    description: 'Sexually explicit or inappropriate content.',
  },
  {
    value: COMMENT_REPORT_REASON.PersonalInformation,
    label: 'Personal information',
    description: 'Sharing private or sensitive personal information.',
  },
  {
    value: COMMENT_REPORT_REASON.Misinformation,
    label: 'Misinformation',
    description: 'False or misleading information.',
  },
  {
    value: COMMENT_REPORT_REASON.OffTopic,
    label: 'Off topic',
    description: 'Irrelevant content that does not match the article discussion.',
  },
  {
    value: COMMENT_REPORT_REASON.Other,
    label: 'Other',
    description: 'Another reason not covered by the available options.',
    requiresDescription: true,
  },
];

export const MODERATION_REASON = {
  Spam: 'Spam',
  Harassment: 'Harassment',
  HateSpeech: 'HateSpeech',
  Violence: 'Violence',
  SexualContent: 'SexualContent',
  PersonalInformation: 'PersonalInformation',
  Misinformation: 'Misinformation',
  OffTopic: 'OffTopic',
  PolicyViolation: 'PolicyViolation',
  Other: 'Other',
} as const;

export type ModerationReason =
  (typeof MODERATION_REASON)[keyof typeof MODERATION_REASON];

export const MODERATION_REASON_OPTIONS: Array<{
  value: ModerationReason;
  label: string;
  description: string;
  requiresNote?: boolean;
}> = [
  {
    value: MODERATION_REASON.Spam,
    label: 'Spam',
    description: 'The comment contains spam or promotional content.',
  },
  {
    value: MODERATION_REASON.Harassment,
    label: 'Harassment',
    description: 'The comment contains harassment or abusive language.',
  },
  {
    value: MODERATION_REASON.HateSpeech,
    label: 'Hate speech',
    description: 'The comment contains hate speech or discriminatory content.',
  },
  {
    value: MODERATION_REASON.Violence,
    label: 'Violence',
    description: 'The comment contains violent threats or harmful content.',
  },
  {
    value: MODERATION_REASON.SexualContent,
    label: 'Sexual content',
    description: 'The comment contains sexually explicit or inappropriate content.',
  },
  {
    value: MODERATION_REASON.PersonalInformation,
    label: 'Personal information',
    description: 'The comment exposes private or sensitive personal information.',
  },
  {
    value: MODERATION_REASON.Misinformation,
    label: 'Misinformation',
    description: 'The comment contains false or misleading information.',
  },
  {
    value: MODERATION_REASON.OffTopic,
    label: 'Off topic',
    description: 'The comment is irrelevant to the current discussion.',
  },
  {
    value: MODERATION_REASON.PolicyViolation,
    label: 'Policy violation',
    description: 'The comment violates platform policy.',
  },
  {
    value: MODERATION_REASON.Other,
    label: 'Other',
    description: 'Another moderation reason not covered by the available options.',
    requiresNote: true,
  },
];

export const COMMENT_STATUS = {
  Visible: 'Visible',
  Hidden: 'Hidden',
  Deleted: 'Deleted',

  // Reserved for future selective moderation.
  Pending: 'Pending',
  Rejected: 'Rejected',
} as const;

export type CommentStatus =
  (typeof COMMENT_STATUS)[keyof typeof COMMENT_STATUS];

export const COMMENT_STATUS_META: Record<
  CommentStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [COMMENT_STATUS.Visible]: {
    label: 'Visible',
    description: 'The comment is publicly visible.',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  [COMMENT_STATUS.Hidden]: {
    label: 'Hidden',
    description: 'The comment is hidden by moderation.',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  [COMMENT_STATUS.Deleted]: {
    label: 'Deleted',
    description: 'The comment was deleted by the author or system.',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  [COMMENT_STATUS.Pending]: {
    label: 'Pending',
    description: 'Reserved for future selective moderation.',
    badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  [COMMENT_STATUS.Rejected]: {
    label: 'Rejected',
    description: 'Reserved for future selective moderation.',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700',
  },
};

// Full list. Use this when rendering/filtering backend data, including reserved statuses.
export const COMMENT_STATUS_OPTIONS = Object.values(COMMENT_STATUS).map(
  (value) => ({
    value,
    label: COMMENT_STATUS_META[value].label,
  }),
);

// V1 runtime statuses. Pending and Rejected are reserved for future selective moderation.
export const CURRENT_COMMENT_STATUS_OPTIONS = [
  COMMENT_STATUS.Visible,
  COMMENT_STATUS.Hidden,
  COMMENT_STATUS.Deleted,
].map((value) => ({
  value,
  label: COMMENT_STATUS_META[value].label,
}));

export const COMMENT_REPORT_STATUS = {
  Pending: 'Pending',
  Dismissed: 'Dismissed',
  Actioned: 'Actioned',
  ClosedByAuthorDeletion: 'ClosedByAuthorDeletion',
} as const;

export type CommentReportStatus =
  (typeof COMMENT_REPORT_STATUS)[keyof typeof COMMENT_REPORT_STATUS];

export const COMMENT_REPORT_STATUS_META: Record<
  CommentReportStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [COMMENT_REPORT_STATUS.Pending]: {
    label: 'Pending',
    description: 'The report is waiting for moderator review.',
    badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  [COMMENT_REPORT_STATUS.Dismissed]: {
    label: 'Dismissed',
    description: 'The report was reviewed and dismissed.',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  [COMMENT_REPORT_STATUS.Actioned]: {
    label: 'Actioned',
    description: 'The report resulted in a moderation action.',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  [COMMENT_REPORT_STATUS.ClosedByAuthorDeletion]: {
    label: 'Closed by author deletion',
    description: 'The report was closed because the author deleted the comment.',
    badgeClassName: 'border-zinc-200 bg-zinc-50 text-zinc-600',
  },
};

export const COMMENT_REPORT_STATUS_OPTIONS = Object.values(
  COMMENT_REPORT_STATUS,
).map((value) => ({
  value,
  label: COMMENT_REPORT_STATUS_META[value].label,
}));

export const MODERATION_CASE_STATUS = {
  Open: 'Open',
  Dismissed: 'Dismissed',
  Actioned: 'Actioned',
  ClosedByAuthorDeletion: 'ClosedByAuthorDeletion',
} as const;

export type ModerationCaseStatus =
  (typeof MODERATION_CASE_STATUS)[keyof typeof MODERATION_CASE_STATUS];

export const MODERATION_CASE_STATUS_META: Record<
  ModerationCaseStatus,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [MODERATION_CASE_STATUS.Open]: {
    label: 'Open',
    description: 'The moderation case is open and needs review.',
    badgeClassName: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  [MODERATION_CASE_STATUS.Dismissed]: {
    label: 'Dismissed',
    description: 'The moderation case was dismissed without action.',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  [MODERATION_CASE_STATUS.Actioned]: {
    label: 'Actioned',
    description: 'The moderation case was handled with an action.',
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  [MODERATION_CASE_STATUS.ClosedByAuthorDeletion]: {
    label: 'Closed by author deletion',
    description: 'The case was closed because the author deleted the comment.',
    badgeClassName: 'border-zinc-200 bg-zinc-50 text-zinc-600',
  },
};

export const MODERATION_CASE_STATUS_OPTIONS = Object.values(
  MODERATION_CASE_STATUS,
).map((value) => ({
  value,
  label: MODERATION_CASE_STATUS_META[value].label,
}));

export const MODERATION_CASE_PRIORITY = {
  Normal: 'Normal',
  High: 'High',
  Critical: 'Critical',
} as const;

export type ModerationCasePriority =
  (typeof MODERATION_CASE_PRIORITY)[keyof typeof MODERATION_CASE_PRIORITY];

export const MODERATION_CASE_PRIORITY_META: Record<
  ModerationCasePriority,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [MODERATION_CASE_PRIORITY.Normal]: {
    label: 'Normal',
    description: 'Standard moderation priority.',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  [MODERATION_CASE_PRIORITY.High]: {
    label: 'High',
    description: 'Important case that should be reviewed soon.',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  [MODERATION_CASE_PRIORITY.Critical]: {
    label: 'Critical',
    description: 'Urgent case that requires immediate attention.',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700',
  },
};

export const MODERATION_CASE_PRIORITY_OPTIONS = Object.values(
  MODERATION_CASE_PRIORITY,
).map((value) => ({
  value,
  label: MODERATION_CASE_PRIORITY_META[value].label,
}));

export const REPORT_SEVERITY = {
  Normal: 'Normal',
  High: 'High',
  Critical: 'Critical',
} as const;

export type ReportSeverity =
  (typeof REPORT_SEVERITY)[keyof typeof REPORT_SEVERITY];

export const REPORT_SEVERITY_META: Record<
  ReportSeverity,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [REPORT_SEVERITY.Normal]: {
    label: 'Normal',
    description: 'Standard report severity.',
    badgeClassName: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  [REPORT_SEVERITY.High]: {
    label: 'High',
    description: 'Potentially harmful content that should be reviewed soon.',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  [REPORT_SEVERITY.Critical]: {
    label: 'Critical',
    description: 'Highly sensitive or dangerous content requiring urgent review.',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700',
  },
};

export const REPORT_SEVERITY_OPTIONS = Object.values(REPORT_SEVERITY).map(
  (value) => ({
    value,
    label: REPORT_SEVERITY_META[value].label,
  }),
);

export const REPORT_ALERT_LEVEL = {
  High: 'High',
  Critical: 'Critical',
} as const;

export type ReportAlertLevel =
  (typeof REPORT_ALERT_LEVEL)[keyof typeof REPORT_ALERT_LEVEL];

export const REPORT_ALERT_LEVEL_META: Record<
  ReportAlertLevel,
  {
    label: string;
    description: string;
    badgeClassName: string;
  }
> = {
  [REPORT_ALERT_LEVEL.High]: {
    label: 'High',
    description: 'High-level alert for moderator attention.',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  [REPORT_ALERT_LEVEL.Critical]: {
    label: 'Critical',
    description: 'Critical alert requiring immediate moderator attention.',
    badgeClassName: 'border-red-200 bg-red-50 text-red-700',
  },
};

export const REPORT_ALERT_LEVEL_OPTIONS = Object.values(REPORT_ALERT_LEVEL).map(
  (value) => ({
    value,
    label: REPORT_ALERT_LEVEL_META[value].label,
  }),
);

export const COMMENT_MODERATION_ACTION_TYPE = {
  Hide: 'Hide',
  Restore: 'Restore',
  DismissReportedCase: 'DismissReportedCase',
  HideReportedComment: 'HideReportedComment',
  CloseCaseByAuthorDeletion: 'CloseCaseByAuthorDeletion',

  // Reserved for future selective moderation.
  Approve: 'Approve',
  Reject: 'Reject',
} as const;

export type CommentModerationActionType =
  (typeof COMMENT_MODERATION_ACTION_TYPE)[keyof typeof COMMENT_MODERATION_ACTION_TYPE];

export const COMMENT_MODERATION_ACTION_TYPE_META: Record<
  CommentModerationActionType,
  {
    label: string;
    description: string;
  }
> = {
  [COMMENT_MODERATION_ACTION_TYPE.Hide]: {
    label: 'Hide comment',
    description: 'Hide a visible comment.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.Restore]: {
    label: 'Restore comment',
    description: 'Restore a hidden comment.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.DismissReportedCase]: {
    label: 'Dismiss reported case',
    description: 'Dismiss a moderation case without hiding the comment.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.HideReportedComment]: {
    label: 'Hide reported comment',
    description: 'Hide the comment linked to the moderation case.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.CloseCaseByAuthorDeletion]: {
    label: 'Close by author deletion',
    description: 'Close the case because the author deleted the comment.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.Approve]: {
    label: 'Approve comment',
    description: 'Reserved for future selective moderation.',
  },
  [COMMENT_MODERATION_ACTION_TYPE.Reject]: {
    label: 'Reject comment',
    description: 'Reserved for future selective moderation.',
  },
};

// Full list. Use this when rendering history/backend data, including reserved actions.
export const COMMENT_MODERATION_ACTION_TYPE_OPTIONS = Object.values(
  COMMENT_MODERATION_ACTION_TYPE,
).map((value) => ({
  value,
  label: COMMENT_MODERATION_ACTION_TYPE_META[value].label,
}));

// V1 available moderation actions. Approve and Reject are reserved for future selective moderation.
export const CURRENT_COMMENT_MODERATION_ACTION_TYPE_OPTIONS = [
  COMMENT_MODERATION_ACTION_TYPE.Hide,
  COMMENT_MODERATION_ACTION_TYPE.Restore,
  COMMENT_MODERATION_ACTION_TYPE.DismissReportedCase,
  COMMENT_MODERATION_ACTION_TYPE.HideReportedComment,
  COMMENT_MODERATION_ACTION_TYPE.CloseCaseByAuthorDeletion,
].map((value) => ({
  value,
  label: COMMENT_MODERATION_ACTION_TYPE_META[value].label,
}));

export const MODERATION_CASE_RESOLUTION_TYPE = {
  DismissReportedCase: 'DismissReportedCase',
  HideReportedComment: 'HideReportedComment',
  CloseCaseByAuthorDeletion: 'CloseCaseByAuthorDeletion',
} as const;

export type ModerationCaseResolutionType =
  (typeof MODERATION_CASE_RESOLUTION_TYPE)[keyof typeof MODERATION_CASE_RESOLUTION_TYPE];

export const MODERATION_CASE_RESOLUTION_TYPE_META: Record<
  ModerationCaseResolutionType,
  {
    label: string;
    description: string;
  }
> = {
  [MODERATION_CASE_RESOLUTION_TYPE.DismissReportedCase]: {
    label: 'Dismiss case',
    description: 'Dismiss the reported case without taking action on the comment.',
  },
  [MODERATION_CASE_RESOLUTION_TYPE.HideReportedComment]: {
    label: 'Hide reported comment',
    description: 'Hide the reported comment and mark the case as actioned.',
  },
  [MODERATION_CASE_RESOLUTION_TYPE.CloseCaseByAuthorDeletion]: {
    label: 'Close by author deletion',
    description: 'Close the case because the author deleted the comment.',
  },
};

export const MODERATION_CASE_RESOLUTION_TYPE_OPTIONS = Object.values(
  MODERATION_CASE_RESOLUTION_TYPE,
).map((value) => ({
  value,
  label: MODERATION_CASE_RESOLUTION_TYPE_META[value].label,
}));

export const isOtherCommentReportReason = (
  value?: string | null,
): value is typeof COMMENT_REPORT_REASON.Other => {
  return value === COMMENT_REPORT_REASON.Other;
};

export const isOtherModerationReason = (
  value?: string | null,
): value is typeof MODERATION_REASON.Other => {
  return value === MODERATION_REASON.Other;
};