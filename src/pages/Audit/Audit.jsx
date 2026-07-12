import { useState } from "react";
import { ClipboardCheck, Plus, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { completeAudit } from "../../services/auditService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import AuditFormModal from "./AuditFormModal";

function Audit() {
    const { currentUser } = useAuth();
    const { data: audits, loading } = useFirestoreCollection(COLLECTIONS.AUDIT_CYCLES, { orderByField: "createdAt", orderDirection: "desc" });
    const { data: departments } = useFirestoreCollection(COLLECTIONS.DEPARTMENTS);
    const [formOpen, setFormOpen] = useState(false);

    function deptName(id) { return departments.find((d) => d.id === id)?.name || "—"; }

    async function handleComplete(row) {
        try { await completeAudit(row.id, currentUser.uid); toast.success("Audit marked completed"); }
        catch (e) { toast.error("Failed"); console.error(e); }
    }

    const columns = [
        { key: "department", label: "Department", render: (r) => deptName(r.department) },
        { key: "auditors", label: "Auditor(s)" },
        { key: "startDate", label: "Start Date" },
        { key: "endDate", label: "End Date" },
        { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
        {
            key: "actions", label: "Actions", sortable: false,
            render: (r) => r.status === "in-progress" ? (
                <button onClick={() => handleComplete(r)} className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-success hover:bg-green-50 dark:border-slate-700">
                    <CheckCircle className="h-3.5 w-3.5" /> Complete
                </button>
            ) : <span className="text-xs text-slate-400">—</span>,
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Audit Cycles</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage department-wise asset audits</p>
                </div>
                <Button icon={Plus} onClick={() => setFormOpen(true)}>Start Audit</Button>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable columns={columns} data={audits} loading={loading} emptyTitle="No audit cycles yet" emptyIcon={ClipboardCheck} />
            </div>
            <AuditFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} departments={departments} />
        </div>
    );
}

export default Audit;