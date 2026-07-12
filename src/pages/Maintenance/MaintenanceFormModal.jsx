import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormSelect from "../../components/forms/FormSelect";
import FormTextarea from "../../components/forms/FormTextarea";
import Button from "../../components/common/Button";
import { createMaintenanceRequest } from "../../services/maintenanceService";
import { useAuth } from "../../context/AuthContext";

const PRIORITY_OPTIONS = [
    { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" },
];

function MaintenanceFormModal({ isOpen, onClose, assets }) {
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (isOpen) reset({ assetId: "", priority: "medium", issue: "" });
    }, [isOpen, reset]);

    const assetOptions = assets.map((a) => ({ value: a.id, label: `${a.assetName} (${a.assetTag})` }));

    async function onSubmit(data) {
        try {
            await createMaintenanceRequest(data, currentUser.uid);
            toast.success("Maintenance request raised");
            onClose();
        } catch (err) { toast.error("Failed to raise request"); console.error(err); }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Raise Maintenance Request">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSelect label="Asset" name="assetId" register={register} error={errors.assetId}
                            options={assetOptions} placeholder="Select asset"
                            {...register("assetId", { required: "Please select an asset" })} />
                <FormSelect label="Priority" name="priority" register={register} error={errors.priority} options={PRIORITY_OPTIONS} />
                <FormTextarea label="Issue Description" name="issue" placeholder="Describe the problem"
                              register={register} error={errors.issue}
                              {...register("issue", { required: "Please describe the issue" })} />
                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">Submit</Button>
                </div>
            </form>
        </Modal>
    );
}

export default MaintenanceFormModal;