import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";


function KpiCard({ label, value, icon: Icon, trend, trendValue, colorClass = "bg-primary/10 text-primary", loading }) {
    const isPositive = trend === "up";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    {loading ? (
                        <div className="mt-2 h-7 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    ) : (
                        <p className="mt-1 text-2xl font-semibold text-slate-800 dark:text-slate-100">
                            {value}
                        </p>
                    )}
                </div>
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>

            {trendValue && (
                <div className="mt-3 flex items-center gap-1 text-xs font-medium">
                    {isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                    ) : (
                        <ArrowDownRight className="h-3.5 w-3.5 text-danger" />
                    )}
                    <span className={isPositive ? "text-success" : "text-danger"}>{trendValue}</span>
                    <span className="text-slate-400">vs last month</span>
                </div>
            )}
        </motion.div>
    );
}

export default KpiCard;