import { useState } from "react";
import { Users, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { COLLECTIONS } from "../../constants/collections";
import { deleteEmployee } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import DataTable from "../../components/tables/DataTable";
import Button from "../../components/common/Button";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Avatar from "../../components/common/Avatar";
import EmployeeFormModal from "./EmployeeFormModal";

const ROLE_STYLES = {
    admin: "bg-primary/10 text-primary",
    manager: "bg-warning/10 text-warning",
    employee: "bg-slate-100 text-slate-500 dark:bg-slate-800",
};

function Employees() {
    const { currentUser } = useAuth();
    const { data: employees, loading } = useFirestoreCollection(COLLECTIONS.USERS);
    const { data: departments } = useFirestoreCollection(COLLECTIONS.DEPARTMENTS);

    const [formOpen, setFormOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);

    function openCreate() {
        setEditingEmployee(null);
        setFormOpen(true);
    }

    function openEdit(emp) {
        setEditingEmployee(emp);
        setFormOpen(true);
    }

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteEmployee(deleteTarget.id, deleteTarget.name, currentUser.uid);
            toast.success("Employee removed");
            setDeleteTarget(null);
        } catch (err) {
            toast.error("Failed to remove employee");
            console.error(err);
        } finally {
            setDeleting(false);
        }
    }

    function departmentName(id) {
        return departments.find((d) => d.id === id)?.name || "—";
    }

    const columns = [
        {
            key: "name",
            label: "Employee",
            render: (row) => (
                <div className="flex items-center gap-3">
                    <Avatar name={row.name} size={32} />
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{row.name}</p>
                        <p className="text-xs text-slate-400">{row.email}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "departmentId",
            label: "Department",
            render: (row) => departmentName(row.departmentId),
        },
        {
            key: "role",
            label: "Role",
            render: (row) => (
                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${ROLE_STYLES[row.role] || ROLE_STYLES.employee}`}>
          {row.role || "employee"}
        </span>
            ),
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
                    <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Employees</h1>
                    <p className="mt-1 text-sm text-slate-500">Manage employee directory, roles & departments</p>
                </div>
                <Button icon={Plus} onClick={openCreate}>
                    Add Employee
                </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <DataTable
                    columns={columns}
                    data={employees}
                    loading={loading}
                    emptyTitle="No employees yet"
                    emptyIcon={Users}
                />
            </div>

            <EmployeeFormModal
                isOpen={formOpen}
                onClose={() => setFormOpen(false)}
                editingEmployee={editingEmployee}
                departments={departments}
            />

            <ConfirmDialog
                isOpen={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Remove Employee"
                message={`Are you sure you want to remove "${deleteTarget?.name}" from the directory? This action cannot be undone.`}
            />
        </div>
    );
}

export default Employees;