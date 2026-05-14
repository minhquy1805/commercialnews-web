export const ArticleLifecycleActionTypes = {
  Publish: 'Publish',
  Unpublish: 'Unpublish',
  Archive: 'Archive',
  SoftDelete: 'SoftDelete',
} as const;

export type ArticleLifecycleActionType =
  (typeof ArticleLifecycleActionTypes)[keyof typeof ArticleLifecycleActionTypes];

export const ArticleLifecycleActionTypeLabels: Record<
  ArticleLifecycleActionType,
  string
> = {
  [ArticleLifecycleActionTypes.Publish]: 'Publish',
  [ArticleLifecycleActionTypes.Unpublish]: 'Unpublish',
  [ArticleLifecycleActionTypes.Archive]: 'Archive',
  [ArticleLifecycleActionTypes.SoftDelete]: 'Soft delete',
};

export const ArticleLifecycleActionTypeColors: Record<
  ArticleLifecycleActionType,
  string
> = {
  [ArticleLifecycleActionTypes.Publish]: 'green',
  [ArticleLifecycleActionTypes.Unpublish]: 'blue',
  [ArticleLifecycleActionTypes.Archive]: 'orange',
  [ArticleLifecycleActionTypes.SoftDelete]: 'red',
};