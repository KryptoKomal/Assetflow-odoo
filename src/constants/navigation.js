import {
    LayoutDashboard,
    Building2,
    Users,
    FolderTree,
    Boxes,
    ArrowLeftRight,
    ArrowRightLeft,
    CalendarClock,
    Wrench,
    ClipboardCheck,
    BarChart3,
    Bell,
    History,
} from "lucide-react";

// Single source of truth for sidebar navigation — grouped by section
export const NAV_SECTIONS = [
    {
        label: "Overview",
        items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard }],
    },
    {
        label: "Organization",
        items: [
            { label: "Departments", path: "/departments", icon: Building2 },
            { label: "Employees", path: "/employees", icon: Users },
            { label: "Categories", path: "/categories", icon: FolderTree },
        ],
    },
    {
        label: "Assets",
        items: [
            { label: "Assets", path: "/assets", icon: Boxes },
            { label: "Allocation", path: "/allocation", icon: ArrowLeftRight },
            { label: "Transfer", path: "/transfer", icon: ArrowRightLeft },
        ],
    },
    {
        label: "Operations",
        items: [
            { label: "Bookings", path: "/bookings", icon: CalendarClock },
            { label: "Maintenance", path: "/maintenance", icon: Wrench },
            { label: "Audit", path: "/audit", icon: ClipboardCheck },
        ],
    },
    {
        label: "Insights",
        items: [
            { label: "Reports", path: "/reports", icon: BarChart3 },
            { label: "Notifications", path: "/notifications", icon: Bell },
            { label: "Logs", path: "/logs", icon: History },
        ],
    },
];