// Generic panel wrapper used for chart/list sections on the dashboard
function DashboardCard({ title, subtitle, action, children, className = "" }) {
    return (
        <div className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}>
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
                    {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
                </div>
                {action}
            </div>
            {children}
        </div>
    );
}

export default DashboardCard;