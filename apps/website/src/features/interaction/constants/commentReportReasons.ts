export const COMMENT_REPORT_REASONS = [
  {
    label: "Spam",
    value: "Spam",
  },
  {
    label: "Harassment or abuse",
    value: "Harassment",
  },
  {
    label: "Hate speech",
    value: "HateSpeech",
  },
  {
    label: "Violence",
    value: "Violence",
  },
  {
    label: "Sexual content",
    value: "SexualContent",
  },
  {
    label: "Personal information",
    value: "PersonalInformation",
  },
  {
    label: "Misinformation",
    value: "Misinformation",
  },
  {
    label: "Off-topic",
    value: "OffTopic",
  },
  {
    label: "Other",
    value: "Other",
  },
] as const;

export type CommentReportReasonCode =
  (typeof COMMENT_REPORT_REASONS)[number]["value"];

export function commentReportReasonRequiresDescription(
  reasonCode: CommentReportReasonCode,
) {
  return reasonCode === "Other";
}
