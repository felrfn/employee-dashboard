export type PaginationInput = {
  page?: number;
  pageSize?: number;
};

export function normalizePagination(input: PaginationInput) {
  const pageRaw = input.page ?? 1;
  const pageSizeRaw = input.pageSize ?? 20;

  const page = Number.isFinite(pageRaw) ? Math.floor(pageRaw) : 1;
  const pageSize = Number.isFinite(pageSizeRaw) ? Math.floor(pageSizeRaw) : 20;

  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  const offset = (safePage - 1) * safePageSize;

  return { page: safePage, pageSize: safePageSize, offset };
}
