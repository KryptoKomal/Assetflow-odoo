import { useState } from "react";
import { Building2, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { deleteDepartment } from "../../services/departmentService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import DepartmentFormModal from "./DepartmentFormModal";

function Departments() {
    const { currentUser } = useAuth();
    const { data: departments, loading } = useFirestoreCollection(COLLECTIONS.DEPARTMENTS);

    const [formOpen, setFormOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingDepartment(null);
        setFormOpen(true);
    }

    function openEdit(dept) {
        setEditingDepartment(dept);
        setFormOpen(true);
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteDepartment(deleteTarget.id, deleteTarget.name, currentUser.uid);
            toast.success("Department deleted");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to delete department");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    }

    
    function parentName(id) {
        return departments.find((d) => d.id === id)?.name || "—";
    }

    const columns = [
        { key: "name", label: "Department Name" },
        {
            key: "parentDepartment",
            label: "Parent Department",
            render: (row) => parentName(row.parentDepartment),
        },
        {
            key: "status",
            label: "Status",
            render: (row) => <StatusBadge status={row.status} />,
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
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Departments</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage organizational departments</p>
                </div>
                <Button icon={Plus} onClick={openCreate}>
                    Add Department
                </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable
                    columns={columns}
                    data={departments}
                    loading={loading}
                    emptyTitle="No departments yet"
                    emptyIcon={Building2}
                />
            </div>

            <DepartmentFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                editingDepartment={editingDepartment}
                departments={departments}
            />

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Department"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
            />
        </div>
    );
}

export default Departments;