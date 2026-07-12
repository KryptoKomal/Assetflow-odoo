import { Activity } from "lucide-react";
import { timeAgo } from "../../utils/dashboardHelpers";

// Shows the latest entries from the activityLogs collection
function RecentActivity({ logs, loading }) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800" />
                ))}
            </div>
        );
    }

    if (!logs || logs.length === 0) {
        return (
            <div className="flex h-40 flex-col items-center justify-center text-center text-slate-400">
                <Activity className="mb-2 h-6 w-6" />
                <p className="text-sm">No recent activity yet</p>
            </div>
        );
    }

    return (
        <ul className="space-y-3">
            {logs.map((log) => (
                <li key={log.id} className="flex items-start gap-3">
                    <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Activity className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-slate-700 dark:text-slate-200">{log.action}</p>
                        <p className="text-xs text-slate-400">{timeAgo(log.date)}</p>
                    </div>
                </li>
            ))}
        </ul>
    );
}

export default RecentActivity;