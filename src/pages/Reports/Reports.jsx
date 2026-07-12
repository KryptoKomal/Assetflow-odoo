import { Download, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import DashboardCard from "../../components/cards/DashboardCard";
import Button from "../../components/common/Button";
import { exportToCSV } from "../../utils/csvExport";
import { exportToPDF } from "../../utils/pdfExport";

function Reports() {
    const { data: assets } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const { data: departments } = useFirestoreCollection(COLLECTIONS.DEPARTMENTS);
    const { data: maintenance } = useFirestoreCollection(COLLECTIONS.MAINTENANCE_REQUESTS);
    const { data: categories } = useFirestoreCollection(COLLECTIONS.ASSET_CATEGORIES);

    function categoryName(id) { return categories.find((c) => c.id === id)?.name || "Uncategorized"; }

    // Assets per category
    const categoryData = categories.map((c) => ({
        name: c.name,
        count: assets.filter((a) => a.categoryId === c.id).length,
    }));

    // Maintenance by priority
    const maintenanceData = ["low", "medium", "high"].map((p) => ({
        priority: p,
        count: maintenance.filter((m) => m.priority === p).length,
    }));

    function handleExportAssets() {
        exportToCSV("assets_report", assets.map((a) => ({
            Tag: a.assetTag, Name: a.assetName, Category: categoryName(a.categoryId),
            Status: a.status, Condition: a.condition, Location: a.location,
        })));
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Reports & Analytics</h1>
                    <p className="mt-1 text-sm text-slate-500">Insights across departments and assets</p>
                </div>
                <div className="flex gap-2">
                    <Button icon={Download} onClick={handleExportAssets} variant="outline">Export CSV</Button>
                    <Button icon={Download} variant="outline" onClick={() =>
                        exportToPDF("Assets Report", assets.map((a) => ({
                            Tag: a.assetTag, Name: a.assetName, Category: categoryName(a.categoryId),
                            Status: a.status, Location: a.location,
                        })))
                    }>
                        Export PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <DashboardCard title="Assets by Category">
                    {categoryData.length ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="py-10 text-center text-sm text-slate-400">No category data yet</p>}
                </DashboardCard>

                <DashboardCard title="Maintenance by Priority">
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={maintenanceData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                            <XAxis dataKey="priority" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </DashboardCard>
            </div>

            <DashboardCard title="Department Summary">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {departments.map((d) => (
                        <div key={d.id} className="rounded-xl border border-slate-200 p-4 text-center dark:border-slate-800">
                            <p className="text-2xl font-semibold text-primary">{assets.filter((a) => a.location === d.name).length}</p>
                            <p className="mt-1 text-xs text-slate-500">{d.name}</p>
                        </div>
                    ))}
                </div>
            </DashboardCard>
        </div>
    );
}

export default Reports;