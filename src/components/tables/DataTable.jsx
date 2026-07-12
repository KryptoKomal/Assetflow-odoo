import { useMemo, useState } from "react";
import { ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Spinner from "../common/Spinner";
import EmptyState from "../common/EmptyState";

/**
 * Generic reusable data table with sorting, searching, and pagination.
 * columns: [{ key, label, render?(row) }]
 */
function DataTable({ columns, data, loading, searchable = true, pageSize = 8, emptyTitle = "No records found", emptyIcon }) {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        if (!search) return data;
        const lower = search.toLowerCase();
        return data.filter((row) =>
            columns.some((col) => String(row[col.key] ?? "").toLowerCase().includes(lower))
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, search]);

    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const valA = a[sortKey] ?? "";
            const valB = b[sortKey] ?? "";
            if (valA < valB) return sortDir === "asc" ? -1 : 1;
            if (valA > valB) return sortDir === "asc" ? 1 : -1;
            return 0;
        });
    }, [filtered, sortKey, sortDir]);

    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

    function toggleSort(key) {
        if (sortKey === key) {
            setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    }

    return (
        <div>
            {searchable && (
                <div className="mb-4 flex items-center gap-2">
                    <div className="relative w-full max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Search..."
                            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800"
                        />
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                onClick={() => col.sortable !== false && toggleSort(col.key)}
                                className={`whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 ${
                                    col.sortable !== false ? "cursor-pointer select-none" : ""
                                }`}
                            >
                  <span className="flex items-center gap-1">
                    {col.label}
                      {sortKey === col.key &&
                          (sortDir === "asc" ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                  </span>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {loading ? (
                        <tr>
                            <td colSpan={columns.length} className="py-14 text-center">
                                <Spinner size={26} />
                            </td>
                        </tr>
                    ) : paginated.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <EmptyState icon={emptyIcon} title={emptyTitle} />
                            </td>
                        </tr>
                    ) : (
                        paginated.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                {columns.map((col) => (
                                    <td key={col.key} className="whitespace-nowrap px-4 py-3 text-slate-700 dark:text-slate-200">
                                        {col.render ? col.render(row) : row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {!loading && sorted.length > pageSize && (
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
          <span>
            Page {page} of {totalPages} · {sorted.length} records
          </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 dark:border-slate-700"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 disabled:opacity-40 dark:border-slate-700"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DataTable;