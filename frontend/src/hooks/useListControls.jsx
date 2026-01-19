import { useEffect, useMemo, useState } from "react";
import { useDebouncedValue } from "./useDebouncedValue";

export function useListControls(
  items,
  {
    pageSize = 8,
    searchFields = [],
    getSortValue = (x) => x?.name ?? "",
    locale = "cs",
    initialQuery = "",
    initialPage = 1,
  } = {},
) {
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebouncedValue(query, 250);

  const [page, setPage] = useState(initialPage);

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) =>
      String(getSortValue(a) || "").localeCompare(
        String(getSortValue(b) || ""),
        locale,
        {
          sensitivity: "base",
        },
      ),
    );
    return arr;
  }, [items, getSortValue, locale]);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return sorted;

    return sorted.filter((item) => {
      return searchFields.some((fn) => {
        const v = String(fn(item) || "").toLowerCase();
        return v.includes(q);
      });
    });
  }, [sorted, debouncedQuery, searchFields]);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery]);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pageSize]);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(1, p), pageCount));
  }, [pageCount]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const resetControls = () => {
    setQuery("");
    setPage(1);
  };

  return {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    pageCount,
    totalCount: sorted.length,
    filteredCount: filtered.length,
    items: paged,
    allSorted: sorted,
    allFiltered: filtered,
    resetControls,
  };
}
