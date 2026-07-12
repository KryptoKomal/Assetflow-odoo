const STYLES = {
    active: "bg-success/10 text-success",
    inactive: "bg-slate-100 text-slate-500 dark:bg-slate-800",
    pending: "bg-warning/10 text-warning",
    approved: "bg-success/10 text-success",
    rejected: "bg-danger/10 text-danger",
};

// Reusable colored pill for status fields across every module
function StatusBadge({ status }) {
    const style = STYLES[status?.toLowerCase()] || "bg-slate-100 text-slate-500 dark:bg-slate-800";
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {status || "unknown"}
    </span>
    );
}

export default StatusBadge;