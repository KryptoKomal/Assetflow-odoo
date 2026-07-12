import { Bell, Check } from "lucide-react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { markAsRead } from "../../services/notificationService";
import { useAuth } from "../../context/AuthContext";
import EmptyState from "../../components/common/EmptyState";
import Spinner from "../../components/common/Spinner";
import { timeAgo } from "../../utils/dashboardHelpers";

function Notifications() {
    const { currentUser } = useAuth();
    const { data: all, loading } = useFirestoreCollection(COLLECTIONS.NOTIFICATIONS, { orderByField: "createdAt", orderDirection: "desc" });
    const myNotifications = all.filter((n) => n.userId === currentUser.uid);

    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">Stay updated on activity relevant to you</p>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {loading ? (
                    <div className="flex justify-center py-10"><Spinner size={26} /></div>
                ) : myNotifications.length === 0 ? (
                    <EmptyState icon={Bell} title="No notifications yet" />
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {myNotifications.map((n) => (
                            <li key={n.id} className={`flex items-start justify-between gap-3 py-3 ${!n.read ? "bg-primary/5 -mx-5 px-5" : ""}`}>
                                <div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{n.title}</p>
                                    <p className="text-xs text-slate-500">{n.message}</p>
                                    <p className="mt-1 text-xs text-slate-400">{timeAgo(n.createdAt)}</p>
                                </div>
                                {!n.read && (
                                    <button onClick={() => markAsRead(n.id)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary hover:bg-primary/10">
                                        <Check className="h-4 w-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Notifications;