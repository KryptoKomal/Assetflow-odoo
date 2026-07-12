import { Boxes, ArrowLeftRight, CalendarClock, Wrench } from "lucide-react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import KpiCard from "../../components/cards/KpiCard";
import DashboardCard from "../../components/cards/DashboardCard";
import AssetStatusChart from "../../components/cards/AssetStatusChart";
import AllocationTrendChart from "../../components/charts/AllocationTrendChart";
import QuickActions from "../../components/cards/QuickActions";
import RecentActivity from "../../components/cards/RecentActivity";
import { buildAssetStatusData, buildAllocationTrendData } from "../../utils/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";

function Dashboard() {
    const { userProfile } = useAuth();

    const { data: assets, loading: assetsLoading } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const { data: allocations, loading: allocLoading } = useFirestoreCollection(COLLECTIONS.ALLOCATIONS);
    const { data: bookings, loading: bookingsLoading } = useFirestoreCollection(COLLECTIONS.BOOKINGS);
    const { data: maintenanceReqs, loading: maintLoading } = useFirestoreCollection(COLLECTIONS.MAINTENANCE_REQUESTS);
    const { data: activityLogs, loading: logsLoading } = useFirestoreCollection(COLLECTIONS.ACTIVITY_LOGS, {
        orderByField: "date",
        orderDirection: "desc",
        limit: 6,
    });

    const activeAllocations = allocations.filter((a) => a.status === "active").length;
    const pendingMaintenance = maintenanceReqs.filter((m) => m.status === "pending").length;
    const upcomingBookings = bookings.filter((b) => b.status === "confirmed" || b.status === "upcoming").length;

    const assetStatusData = buildAssetStatusData(assets);
    const allocationTrendData = buildAllocationTrendData(allocations);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Welcome back{userProfile?.name ? `, ${userProfile.name.split(" ")[0]}` : ""} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Here's what's happening with your assets today.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <KpiCard
                    label="Total Assets"
                    value={assets.length}
                    icon={Boxes}
                    colorClass="bg-primary/10 text-primary"
                    loading={assetsLoading}
                />
                <KpiCard
                    label="Active Allocations"
                    value={activeAllocations}
                    icon={ArrowLeftRight}
                    colorClass="bg-accent/10 text-accent"
                    loading={allocLoading}
                />
                <KpiCard
                    label="Upcoming Bookings"
                    value={upcomingBookings}
                    icon={CalendarClock}
                    colorClass="bg-warning/10 text-warning"
                    loading={bookingsLoading}
                />
                <KpiCard
                    label="Pending Maintenance"
                    value={pendingMaintenance}
                    icon={Wrench}
                    colorClass="bg-danger/10 text-danger"
                    loading={maintLoading}
                />
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Quick Actions
                </h2>
                <QuickActions />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <DashboardCard
                    title="Asset Status Breakdown"
                    subtitle="Current distribution across all assets"
                    className="lg:col-span-2"
                >
                    <AssetStatusChart data={assetStatusData} />
                </DashboardCard>

                <DashboardCard title="Recent Activity" subtitle="Latest actions across the system">
                    <RecentActivity logs={activityLogs} loading={logsLoading} />
                </DashboardCard>
            </div>

            <DashboardCard title="Allocation Trend" subtitle="Assets allocated over the last 6 months">
                <AllocationTrendChart data={allocationTrendData} />
            </DashboardCard>
        </div>
    );
}

export default Dashboard;