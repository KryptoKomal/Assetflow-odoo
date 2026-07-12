// Reusable "no data yet" placeholder for tables/lists across the app
function EmptyState({ icon: Icon, title, message, action }) {
    return (
        <div className="flex flex-col items-center justify-center py-14 text-center">
            {Icon && (
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                    <Icon className="h-6 w-6 text-slate-400" />
                </div>
            )}
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{title}</p>
            {message && <p className="mt-1 text-xs text-slate-400">{message}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

export default EmptyState;