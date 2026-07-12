import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormSelect from "../../components/forms/FormSelect";
import FormTextarea from "../../components/forms/FormTextarea";
import Button from "../../components/common/Button";
import { createTransferRequest } from "../../services/transferService";
import { useAuth } from "../../context/AuthContext";

function TransferFormModal({ isOpen, onClose, allocatedAssets, employees }) {
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (isOpen) reset({ assetId: "", fromEmployeeId: "", toEmployeeId: "", reason: "" });
    }, [isOpen, reset]);

    const assetOptions = allocatedAssets.map((a) => ({ value: a.id, label: `${a.assetName} (${a.assetTag})` }));
    const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name }));
    const selectedAssetId = watch("assetId");
    const currentHolder = allocatedAssets.find((a) => a.id === selectedAssetId)?.allocatedTo;

    async function onSubmit(data) {
        try {
            await createTransferRequest({ ...data, fromEmployeeId: currentHolder }, currentUser.uid);
            toast.success("Transfer request created");
            onClose();
        } catch (err) {
            toast.error("Failed to create transfer request");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Request Asset Transfer">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSelect label="Asset" name="assetId" register={register} error={errors.assetId}
                            options={assetOptions} placeholder="Select an allocated asset"
                            {...register("assetId", { required: "Please select an asset" })} />
                <FormSelect label="Transfer To" name="toEmployeeId" register={register} error={errors.toEmployeeId}
                            options={employeeOptions} placeholder="Select employee"
                            {...register("toEmployeeId", { required: "Please select an employee" })} />
                <FormTextarea label="Reason (optional)" name="reason" placeholder="Why is this transfer needed?"
                              register={register} error={errors.reason} />
                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button type="submit" loading={isSubmitting} disabled={!assetOptions.length} className="flex-1">Submit Request</Button>
                </div>
            </form>
        </Modal>
    );
}

export default TransferFormModal;