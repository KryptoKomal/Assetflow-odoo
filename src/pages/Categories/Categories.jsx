import { useState } from "react";
import { FolderTree, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { deleteCategory } from "../../services/categoryService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import CategoryFormModal from "./CategoryFormModal";

function Categories() {
    const { currentUser } = useAuth();
    const { data: categories, loading } = useFirestoreCollection(COLLECTIONS.ASSET_CATEGORIES);

    const [formOpen, setFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingCategory(null);
        setFormOpen(true);
    }

    function openEdit(cat) {
        setEditingCategory(cat);
        setFormOpen(true);
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteCategory(deleteTarget.id, deleteTarget.name, currentUser.uid);
            toast.success("Category deleted");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to delete category");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    }

    const columns = [
        { key: "name", label: "Category Name" },
        {
            key: "description",
            label: "Description",
            render: (row) => (
                <span className="line-clamp-1 max-w-xs text-slate-500">
          {row.description || "—"}
        </span>
            ),
        },
        {
            key: "warranty",
            label: "Warranty",
            render: (row) => `${row.warranty || 0} months`,
        },
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (row) => (
                <div className="flex items-center gap-2">
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
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Asset Categories</h1>
                    <p className="mt-1 text-sm text-slate-500">Organize assets into categories</p>
                </div>
                <Button icon={Plus} onClick={openCreate}>
                    Add Category
                </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable
                    columns={columns}
                    data={categories}
                    loading={loading}
                    emptyTitle="No categories yet"
                    emptyIcon={FolderTree}
                />
            </div>

            <CategoryFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                editingCategory={editingCategory}
            />

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Category"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? Assets using this category won't be deleted, but will show an unresolved category.`}
            />
        </div>
    );
}

export default Categories;