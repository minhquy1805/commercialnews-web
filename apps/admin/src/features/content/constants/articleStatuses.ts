export const ArticleStatuses = {
  Draft: 'Draft',
  Published: 'Published',
  Archived: 'Archived',
} as const;

export type ArticleStatus =
  (typeof ArticleStatuses)[keyof typeof ArticleStatuses];

export const ArticleStatusOptions = [
  {
    label: 'Draft',
    value: ArticleStatuses.Draft,
  },
  {
    label: 'Published',
    value: ArticleStatuses.Published,
  },
  {
    label: 'Archived',
    value: ArticleStatuses.Archived,
  },
] as const;

export const ArticleStatusLabels: Record<ArticleStatus, string> = {
  [ArticleStatuses.Draft]: 'Draft',
  [ArticleStatuses.Published]: 'Published',
  [ArticleStatuses.Archived]: 'Archived',
};

export const ArticleStatusColors: Record<ArticleStatus, string> = {
  [ArticleStatuses.Draft]: 'default',
  [ArticleStatuses.Published]: 'green',
  [ArticleStatuses.Archived]: 'orange',
};