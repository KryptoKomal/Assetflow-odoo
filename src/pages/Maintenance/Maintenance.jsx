import { useState } from "react";
import { Wrench, Plus, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { updateMaintenanceStatus, resolveMaintenance } from "../../services/maintenanceService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import MaintenanceFormModal from "./MaintenanceFormModal";

const PRIORITY_STYLES = { low: "bg-slate-100 text-slate-500", medium: "bg-warning/10 text-warning", high: "bg-danger/10 text-danger" };

function Maintenance() {
    const { currentUser } = useAuth();
    const { data: requests, loading } = useFirestoreCollection(COLLECTIONS.MAINTENANCE_REQUESTS, { orderByField: "createdAt", orderDirection: "desc" });
    const { data: assets } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const [formOpen, setFormOpen] = useState(false);

    function assetLabel(id) { const a = assets.find((x) => x.id === id); return a ? a.assetName : "—"; }

    async function handleApprove(row) {
        try { await updateMaintenanceStatus(row.id, "in-progress", "", currentUser.uid); toast.success("Request approved"); }
        catch (e) { toast.error("Failed"); console.error(e); }
    }
    async function handleResolve(row) {
        try { await resolveMaintenance(row, currentUser.uid); toast.success("Marked as resolved"); }
        catch (e) { toast.error("Failed"); console.error(e); }
    }

    const columns = [
        { key: "assetId", label: "Asset", render: (r) => assetLabel(r.assetId) },
        { key: "issue", label: "Issue", render: (r) => <span className="line-clamp-1 max-w-xs">{r.issue}</span> },
        { key: "priority", label: "Priority", render: (r) => <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${PRIORITY_STYLES[r.priority]}`}>{r.priority}</span> },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions", label: "Actions", sortable: false,
            render: (r) => (
                <div className="flex gap-2">
                    {r.status === "pending" && <Button variant="outline" className="!px-2.5 !py-1.5 text-xs" onClick={() => handleApprove(r)}>Approve</Button>}
                    {r.status === "in-progress" && (
                        <button onClick={() => handleResolve(r)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-success hover:bg-green-50 dark:border-slate-700">
                            <CheckCircle className="h-3.5 w-3.5" /> Resolve
                        </button>
                    )}
                    {r.status === "resolved" && <span className="text-xs text-slate-400">—</span>}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Maintenance</h1>
                    <p className="mt-1 text-sm text-slate-500">Track and resolve asset maintenance requests</p>
                </div>
                <Button icon={Plus} onClick={() => setFormOpen(true)}>Raise Request</Button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable columns={columns} data={requests} loading={loading} emptyTitle="No maintenance requests yet" emptyIcon={Wrench} />
            </div>
            <MaintenanceFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} assets={assets} />
        </div>
    );
}

export default Maintenance;