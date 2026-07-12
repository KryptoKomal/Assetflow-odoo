import { useState } from "react";
import { ArrowRightLeft, Plus, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { approveTransfer, rejectTransfer } from "../../services/transferService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import TransferFormModal from "./TransferFormModal";

function Transfer() {
  const { currentUser } = useAuth();
  const { data: transfers, loading } = useFirestoreCollection(COLLECTIONS.TRANSFER_REQUESTS, { orderByField: "createdAt", orderDirection: "desc" });
  const { data: assets } = useFirestoreCollection(COLLECTIONS.ASSETS);
  const { data: employees } = useFirestoreCollection(COLLECTIONS.USERS);
  const [formOpen, setFormOpen] = useState(false);

  const allocatedAssets = assets.filter((a) => a.status === "allocated");

  function assetLabel(id) { const a = assets.find((x) => x.id === id); return a ? a.assetName : "—"; }
  function empName(id) { return employees.find((e) => e.id === id)?.name || "—"; }

  async function handleApprove(row) {
    try { await approveTransfer(row, currentUser.uid); toast.success("Transfer approved"); }
    catch (e) { toast.error("Failed to approve"); console.error(e); }
  }
  async function handleReject(row) {
    try { await rejectTransfer(row.id, currentUser.uid); toast.success("Transfer rejected"); }
    catch (e) { toast.error("Failed to reject"); console.error(e); }
  }

  const columns = [
    { key: "assetId", label: "Asset", render: (r) => assetLabel(r.assetId) },
    { key: "fromEmployeeId", label: "From", render: (r) => empName(r.fromEmployeeId) },
    { key: "toEmployeeId", label: "To", render: (r) => empName(r.toEmployeeId) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "actions", label: "Actions", sortable: false,
      render: (r) => r.status === "pending" ? (
        <div className="flex gap-2">
          <button onClick={() => handleApprove(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-success hover:bg-green-50"><Check className="h-4 w-4" /></button>
          <button onClick={() => handleReject(r)} className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-red-50"><X className="h-4 w-4" /></button>
        </div>
      ) : <span className="text-xs text-slate-400">—</span>,
    },
  ];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Asset Transfer</h1>
          <p className="mt-1 text-sm text-slate-500">Request and approve asset transfers between employees</p>
        </div>
        <Button icon={Plus} onClick={() => setFormOpen(true)}>Request Transfer</Button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <DataTable columns={columns} data={transfers} loading={loading} emptyTitle="No transfer requests yet" emptyIcon={ArrowRightLeft} />
      </div>
      <TransferFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} allocatedAssets={allocatedAssets} employees={employees} />
    </div>
  );
}

export default Transfer;