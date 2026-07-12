import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormSelect from "../../components/forms/FormSelect";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import { createAudit } from "../../services/auditService";
import { useAuth } from "../../context/AuthContext";

function AuditFormModal({ isOpen, onClose, departments }) {
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (isOpen) reset({ department: "", auditors: currentUser?.displayName || "", startDate: "", endDate: "" });
    }, [isOpen, reset, currentUser]);

    const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }));

    async function onSubmit(data) {
        try {
            await createAudit(data, currentUser.uid);
            toast.success("Audit cycle started");
            onClose();
        } catch (err) { toast.error("Failed to start audit"); console.error(err); }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Start Audit Cycle">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSelect label="Department" name="department" register={register} error={errors.department}
                            options={deptOptions} placeholder="Select department"
                            {...register("department", { required: "Please select a department" })} />
                <FormInput label="Auditor(s)" name="auditors" register={register} error={errors.auditors}
                           {...register("auditors", { required: "Auditor name is required" })} />
                <FormInput label="Start Date" name="startDate" type="date" register={register} error={errors.startDate}
                           {...register("startDate", { required: "Start date is required" })} />
                <FormInput label="End Date" name="endDate" type="date" register={register} error={errors.endDate}
                           {...register("endDate", { required: "End date is required" })} />
                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">Start Audit</Button>
                </div>
            </form>
        </Modal>
    );
}

export default AuditFormModal;