import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import Button from "../../components/common/Button";
import { createDepartment, updateDepartment } from "../../services/departmentService";
import { useAuth } from "../../context/AuthContext";

const STATUS_OPTIONS = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

function DepartmentFormModal({ isOpen, onClose, editingDepartment, departments }) {
    const { currentUser } = useAuth();
    const isEditMode = Boolean(editingDepartment);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                name: editingDepartment?.name || "",
                parentDepartment: editingDepartment?.parentDepartment || "",
                status: editingDepartment?.status || "active",
            });
        }
    }, [isOpen, editingDepartment, reset]);

    
    const parentOptions = departments
        .filter((d) => d.id !== editingDepartment?.id)
        .map((d) => ({ value: d.id, label: d.name }));

    async function onSubmit(data) {
        try {
            if (isEditMode) {
                await updateDepartment(editingDepartment.id, data, currentUser.uid);
                toast.success("Department updated successfully");
            } else {
                await createDepartment(data, currentUser.uid);
                toast.success("Department created successfully");
            }
            onClose();
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Department" : "Add Department"}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                    label="Department Name"
                    name="name"
                    placeholder="e.g. Computer Science & Engineering"
                    register={register}
                    error={errors.name}
                    {...register("name", { required: "Department name is required" })}
                />

                <FormSelect
                    label="Parent Department (optional)"
                    name="parentDepartment"
                    register={register}
                    error={errors.parentDepartment}
                    options={parentOptions}
                    placeholder="None"
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
                        {isEditMode ? "Save Changes" : "Create Department"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default DepartmentFormModal;