/** Mongo id from API records that may expose `_id`, `id`, or both. */
export function getRecordId(record: { _id?: unknown; id?: unknown } | null | undefined): string {
  if (!record) return '';
  const raw = record._id ?? record.id;
  if (raw == null) return '';
  return String(raw);
}

/** Prefer human-readable match code (M-101) when present, else Mongo id. */
export function getMatchApiId(match: { _id?: unknown; id?: unknown } | null | undefined): string {
  if (!match) return '';
  if (match.id != null && typeof match.id === 'string' && !/^[a-f0-9]{24}$/i.test(match.id)) {
    return match.id;
  }
  return getRecordId(match);
}
