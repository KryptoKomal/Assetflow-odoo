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


export const NAV_SECTIONS = [
    {
        label: "Overview",
        items: [{ label: "Dashboard", path: "/", icon: LayoutDashboard, roles: ["admin", "manager", "employee"] }],
    },
    {
        label: "Organization",
        items: [
            { label: "Departments", path: "/departments", icon: Building2, roles: ["admin"] },
            { label: "Employees", path: "/employees", icon: Users, roles: ["admin"] },
            { label: "Categories", path: "/categories", icon: FolderTree, roles: ["admin"] },
        ],
    },
    {
        label: "Assets",
        items: [
            { label: "Assets", path: "/assets", icon: Boxes, roles: ["admin", "manager", "employee"] },
            { label: "Allocation", path: "/allocation", icon: ArrowLeftRight, roles: ["admin"] },
            { label: "Transfer", path: "/transfer", icon: ArrowRightLeft, roles: ["admin"] },
        ],
    },
    {
        label: "Operations",
        items: [
            { label: "Bookings", path: "/bookings", icon: CalendarClock, roles: ["admin", "manager", "employee"] },
            { label: "Maintenance", path: "/maintenance", icon: Wrench, roles: ["admin", "manager", "employee"] },
            { label: "Audit", path: "/audit", icon: ClipboardCheck, roles: ["admin"] },
        ],
    },
    {
        label: "Insights",
        items: [
            { label: "Reports", path: "/reports", icon: BarChart3, roles: ["admin"] },
            { label: "Notifications", path: "/notifications", icon: Bell, roles: ["admin", "manager", "employee"] },
            { label: "Logs", path: "/logs", icon: History, roles: ["admin"] },
        ],
    },
];