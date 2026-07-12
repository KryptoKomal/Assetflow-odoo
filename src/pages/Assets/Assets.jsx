import { useState } from "react";
import { Boxes, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { deleteAsset } from "../../services/assetService";
import { useAuth } from "../../context/AuthContext";
import { useRole } from "../../hooks/useRole";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import AssetFormModal from "./AssetFormModal";
import AssetDetailDrawer from "./AssetDetailDrawer";

function Assets() {
    const { currentUser } = useAuth();
    const { canManage } = useRole();
    const { data: assets, loading } = useFirestoreCollection(COLLECTIONS.ASSETS);
    const { data: categories } = useFirestoreCollection(COLLECTIONS.ASSET_CATEGORIES);

    const [formOpen, setFormOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState(null);
    const [viewingAsset, setViewingAsset] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingAsset(null);
        setFormOpen(true);
    }

    function openEdit(asset) {
        setEditingAsset(asset);
        setFormOpen(true);
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteAsset(deleteTarget.id, deleteTarget.assetName, deleteTarget.photoPath, currentUser.uid);
            toast.success("Asset deleted");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to delete asset");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    }

    function categoryName(id) {
        return categories.find((c) => c.id === id)?.name || "—";
    }

    const columns = [
        {
            key: "assetName",
            label: "Asset",
            render: (row) => (
                <div className="flex items-center gap-3">
                    {row.photo ? (
                        <img src={row.photo} alt={row.assetName} className="h-9 w-9 rounded-lg object-cover" />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                            <Boxes className="h-4 w-4 text-slate-400" />
                        </div>
                    )}
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{row.assetName}</p>
                        <p className="text-xs text-slate-400">{row.assetTag}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "categoryId",
            label: "Category",
            render: (row) => categoryName(row.categoryId),
        },
        { key: "location", label: "Location" },
        {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
        },
        {
            key: "condition",
            label: "Condition",
            render: (row) => <span className="capitalize">{row.condition}</span>,
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (row) => (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewingAsset(row)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    {canManage && (
                        <>
                            <button
                                onClick={() => openEdit(row)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                <Pencil className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setDeleteTarget(row)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Assets</h1>
                    <p className="mt-1 text-sm text-slate-500">Register and manage all organizational assets</p>
                </div>
                {canManage && (
                    <Button icon={Plus} onClick={openCreate}>
                        Register Asset
                    </Button>
                )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable
                    columns={columns}
                    data={assets}
                    loading={loading}
                    emptyTitle="No assets registered yet"
                    emptyIcon={Boxes}
                />
            </div>

            <AssetFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                editingAsset={editingAsset}
                categories={categories}
            />

            <AssetDetailDrawer
                isOpen={Boolean(viewingAsset)}
                onClose={() => setViewingAsset(null)}
                asset={viewingAsset}
                categoryName={viewingAsset ? categoryName(viewingAsset.categoryId) : ""}
            />

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Asset"
                message={`Are you sure you want to delete "${deleteTarget?.assetName}"? This action cannot be undone.`}
            />
        </div>
    );
}

export default Assets;