type AuditableByUser = {
  createdByUserId: number | null;
  updatedByUserId: number | null;
};

export function getAuthorizationAuditUserIds(items: AuditableByUser[]) {
  const userIds = items.flatMap((item) => [
    item.createdByUserId,
    item.updatedByUserId,
  ]);

  return getNumericUserIds(userIds);
}

export function getNumericUserIds(userIds: Array<number | null | undefined>) {
  return userIds.filter(
    (userId): userId is number => typeof userId === "number",
  );
}
