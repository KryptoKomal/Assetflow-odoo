import { useState } from "react";
import { ArrowLeftRight, Plus, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { returnAsset } from "../../services/allocationService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AllocationFormModal from "./AllocationFormModal";

function Allocation() {
    const { currentUser } = useAuth();
    const { data: allocations, loading } = useFirestoreCollection(COLLECTIONS.ALLOCATIONS, {
        orderByField: "createdAt",
        orderDirection: "desc",
    });
    const { data: assets } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const { data: employees } = useFirestoreCollection(COLLECTIONS.USERS);

    const [formOpen, setFormOpen] = useState(false);
    const [returnTarget, setReturnTarget] = useState(null);
    const [returning, setReturning] = useState(false);

    const availableAssets = assets.filter((a) => a.status === "available");

    function assetLabel(id) {
        const a = assets.find((x) => x.id === id);
        return a ? `${a.assetName} (${a.assetTag})` : "—";
    }
    function employeeName(id) {
        return employees.find((e) => e.id === id)?.name || "—";
    }
    function formatDate(ts) {
        return ts?.toDate ? ts.toDate().toLocaleDateString() : "—";
    }

    async function handleReturn() {
        setReturning(true);
        try {
            await returnAsset(returnTarget, currentUser.uid);
            toast.success("Asset returned successfully");
            setReturnTarget(null);
        } catch (err) {
            toast.error("Failed to return asset");
            console.error(err);
        } finally {
            setReturning(false);
        }
    }

    const columns = [
        { key: "assetId", label: "Asset", render: (row) => assetLabel(row.assetId) },
        { key: "employeeId", label: "Employee", render: (row) => employeeName(row.employeeId) },
        { key: "allocatedDate", label: "Allocated On", render: (row) => formatDate(row.allocatedDate) },
        { key: "expectedReturn", label: "Expected Return", render: (row) => formatDate(row.expectedReturn) },
        { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (row) =>
                row.status === "active" ? (
                    <button
                        onClick={() => setReturnTarget(row)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                        <RotateCcw className="h-3.5 w-3.5" /> Return
                    </button>
                ) : (
                    <span className="text-xs text-slate-400">—</span>
                ),
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Asset Allocation</h1>
                    <p className="mt-1 text-sm text-slate-500">Allocate assets to employees and track returns</p>
                </div>
                <Button icon={Plus} onClick={() => setFormOpen(true)}>
                    Allocate Asset
                </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable
                    columns={columns}
                    data={allocations}
                    loading={loading}
                    emptyTitle="No allocations yet"
                    emptyIcon={ArrowLeftRight}
                />
            </div>

            <AllocationFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                availableAssets={availableAssets}
                employees={employees}
            />

            <ConfirmDialog
                isOpen={Boolean(returnTarget)}
                onClose={() => setReturnTarget(null)}
                onConfirm={handleReturn}
                loading={returning}
                title="Return Asset"
                confirmLabel="Return"
                message="Mark this asset as returned? It will become available for allocation again."
            />
        </div>
    );
}

export default Allocation;