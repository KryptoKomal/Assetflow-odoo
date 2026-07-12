import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Boxes, ChevronsLeft, ChevronsRight, X } from "lucide-react";
import { useSidebar } from "../../../context/SidebarContext";
import { NAV_SECTIONS } from "../../../constants/navigation";
import { useRole } from "../../../hooks/useRole";

function SidebarContent({ collapsed }) {
    const { role } = useRole();

    return (
        <>
            <div className={`flex items-center gap-2 px-4 py-5 ${collapsed ? "justify-center" : ""}`}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary">
                    <Boxes className="h-5 w-5 text-white" />
                </div>
                {!collapsed && (
                    <span className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        AssetFlow
                    </span>
                )}
            </div>

            <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
                {NAV_SECTIONS.map((section) => {
                    const visibleItems = section.items.filter((item) => item.roles.includes(role));
                    if (visibleItems.length === 0) return null;
                    return (
                        <div key={section.label}>
                            {!collapsed && (
                                <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    {section.label}
                                </p>
                            )}
                            <div className="space-y-1">
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        end={item.path === "/"}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-medium transition ${
                                                isActive
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                            } ${collapsed ? "justify-center" : ""}`
                                        }
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                                        {!collapsed && <span>{item.label}</span>}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </nav>
        </>
    );
}

function Sidebar() {
    const { collapsed, toggleCollapsed, mobileOpen, closeMobile } = useSidebar();

    return (
        <>
            {/* Desktop sidebar */}
            <aside
                className={`relative hidden shrink-0 flex-col border-r border-slate-200 bg-white transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 md:flex ${
                    collapsed ? "w-[76px]" : "w-64"
                }`}
            >
                <SidebarContent collapsed={collapsed} />
                <button
                    onClick={toggleCollapsed}
                    className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm hover:text-primary dark:border-slate-700 dark:bg-slate-800"
                >
                    {collapsed ? <ChevronsRight className="h-3.5 w-3.5" /> : <ChevronsLeft className="h-3.5 w-3.5" />}
                </button>
            </aside>

            {/* Mobile sidebar (drawer) */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobile}
                            className="fixed inset-0 z-40 bg-black/40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-slate-900 md:hidden"
                        >
                            <button
                                onClick={closeMobile}
                                className="absolute right-3 top-5 text-slate-500 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <SidebarContent collapsed={false} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default Sidebar;