import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import Button from "../../components/common/Button";
import { createEmployee, updateEmployee } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { User, Mail } from "lucide-react";

const ROLE_OPTIONS = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
];

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

function EmployeeFormModal({ isOpen, onClose, editingEmployee, departments }) {
    const { currentUser } = useAuth();
    const isEditMode = Boolean(editingEmployee);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                name: editingEmployee?.name || "",
                email: editingEmployee?.email || "",
                role: editingEmployee?.role || "employee",
                departmentId: editingEmployee?.departmentId || "",
                status: editingEmployee?.status || "active",
            });
        }
    }, [isOpen, editingEmployee, reset]);

    const departmentOptions = departments.map((d) => ({ value: d.id, label: d.name }));

    async function onSubmit(data) {
        try {
            if (isEditMode) {
                await updateEmployee(editingEmployee.id, data, currentUser.uid);
                toast.success("Employee updated successfully");
            } else {
                await createEmployee(data, currentUser.uid);
                toast.success("Employee added successfully");
            }
            onClose();
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Employee" : "Add Employee"}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                    label="Full Name"
                    name="name"
                    icon={User}
                    placeholder="e.g. Naman Yadav"
                    register={register}
                    error={errors.name}
                    {...register("name", { required: "Name is required" })}
                />

                <FormInput
                    label="Email"
                    name="email"
                    type="email"
                    icon={Mail}
                    placeholder="employee@company.com"
                    register={register}
                    error={errors.email}
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                    })}
                />

                <FormSelect
                    label="Department"
                    name="departmentId"
                    register={register}
                    error={errors.departmentId}
                    options={departmentOptions}
                    placeholder="Select department"
                />

                <FormSelect
                    label="Role"
                    name="role"
                    register={register}
                    error={errors.role}
                    options={ROLE_OPTIONS}
                />

                {isEditMode && (
                    <FormSelect
                        label="Status"
                        name="status"
                        register={register}
                        error={errors.status}
                        options={STATUS_OPTIONS}
                    />
                )}

                <div className="mt-5 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                        {isEditMode ? "Save Changes" : "Add Employee"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default EmployeeFormModal;