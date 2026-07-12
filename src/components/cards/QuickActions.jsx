import { useNavigate } from "react-router-dom";
import { PlusCircle, ArrowLeftRight, CalendarPlus, Wrench } from "lucide-react";

const ACTIONS = [
    { label: "Add Asset", path: "/assets", icon: PlusCircle, colorClass: "bg-primary/10 text-primary" },
    { label: "Allocate", path: "/allocation", icon: ArrowLeftRight, colorClass: "bg-accent/10 text-accent" },
    { label: "New Booking", path: "/bookings", icon: CalendarPlus, colorClass: "bg-warning/10 text-warning" },
    { label: "Raise Request", path: "/maintenance", icon: Wrench, colorClass: "bg-danger/10 text-danger" },
];

// Shortcut buttons to jump straight into common creation workflows
function QuickActions() {
    const navigate = useNavigate();

    return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ACTIONS.map((action) => (
                <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-4 text-center transition hover:border-primary/40 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.colorClass}`}>
                        <action.icon className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {action.label}
          </span>
                </button>
            ))}
        </div>
    );
}

export default QuickActions;