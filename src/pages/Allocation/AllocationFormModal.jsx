import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormSelect from "../../components/forms/FormSelect";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import { allocateAsset } from "../../services/allocationService";
import { useAuth } from "../../context/AuthContext";

function AllocationFormModal({ isOpen, onClose, availableAssets, employees }) {
    const { currentUser } = useAuth();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                assetId: "",
                employeeId: "",
                allocatedDate: new Date().toISOString().split("T")[0],
                expectedReturn: "",
            });
        }
    }, [isOpen, reset]);

    const assetOptions = availableAssets.map((a) => ({ value: a.id, label: `${a.assetName} (${a.assetTag})` }));
    const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name }));

    async function onSubmit(data) {
        try {
            await allocateAsset(data, currentUser.uid);
            toast.success("Asset allocated successfully");
            onClose();
        } catch (err) {
            toast.error("Failed to allocate asset");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Allocate Asset">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSelect
                    label="Asset"
                    name="assetId"
                    register={register}
                    error={errors.assetId}
                    options={assetOptions}
                    placeholder={assetOptions.length ? "Select an available asset" : "No assets available"}
                    {...register("assetId", { required: "Please select an asset" })}
                />
                <FormSelect
                    label="Employee"
                    name="employeeId"
                    register={register}
                    error={errors.employeeId}
                    options={employeeOptions}
                    placeholder="Select employee"
                    {...register("employeeId", { required: "Please select an employee" })}
                />
                <FormInput
                    label="Allocation Date"
                    name="allocatedDate"
                    type="date"
                    register={register}
                    error={errors.allocatedDate}
                    {...register("allocatedDate", { required: "Allocation date is required" })}
                />
                <FormInput
                    label="Expected Return (optional)"
                    name="expectedReturn"
                    type="date"
                    register={register}
                    error={errors.expectedReturn}
                    {...register("expectedReturn")}
                />

                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} disabled={!assetOptions.length} className="flex-1">
                        Allocate
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AllocationFormModal;