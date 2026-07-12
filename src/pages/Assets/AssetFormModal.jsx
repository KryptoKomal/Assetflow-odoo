import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/forms/FormInput";
import FormSelect from "../../components/forms/FormSelect";
import FormCheckbox from "../../components/forms/FormCheckbox";
import FileUploadInput from "../../components/forms/FileUploadInput";
import Button from "../../components/common/Button";
import { createAsset, updateAsset, generateAssetTag } from "../../services/assetService";
import { useAuth } from "../../context/AuthContext";
import { Package, Hash, MapPin } from "lucide-react";

const STATUS_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "allocated", label: "Allocated" },
    { value: "maintenance", label: "In Maintenance" },
    { value: "retired", label: "Retired" },
];

const CONDITION_OPTIONS = [
    { value: "new", label: "New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "damaged", label: "Damaged" },
];

function AssetFormModal({ isOpen, onClose, editingAsset, categories }) {
    const { currentUser } = useAuth();
    const isEditMode = Boolean(editingAsset);
    const [photoFile, setPhotoFile] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            setPhotoFile(null);
            reset({
                assetTag: editingAsset?.assetTag || generateAssetTag(),
                assetName: editingAsset?.assetName || "",
                categoryId: editingAsset?.categoryId || "",
                serialNumber: editingAsset?.serialNumber || "",
                status: editingAsset?.status || "available",
                condition: editingAsset?.condition || "good",
                location: editingAsset?.location || "",
                shared: editingAsset?.shared || false,
            });
        }
    }, [isOpen, editingAsset, reset]);

    const categoryOptions = categories.map((c) => ({ value: c.id, label: c.name }));

    async function onSubmit(data) {
        try {
            if (isEditMode) {
                await updateAsset(editingAsset.id, data, photoFile, editingAsset.photoPath, currentUser.uid);
                toast.success("Asset updated successfully");
            } else {
                await createAsset(data, photoFile, currentUser.uid);
                toast.success("Asset registered successfully");
            }
            onClose();
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Asset" : "Register Asset"} maxWidth="max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FileUploadInput
                    label="Asset Photo"
                    existingUrl={editingAsset?.photo}
                    onFileSelect={setPhotoFile}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormInput
                        label="Asset Tag"
                        name="assetTag"
                        icon={Hash}
                        register={register}
                        error={errors.assetTag}
                        {...register("assetTag", { required: "Asset tag is required" })}
                    />
                    <FormInput
                        label="Serial Number"
                        name="serialNumber"
                        register={register}
                        error={errors.serialNumber}
                        {...register("serialNumber")}
                    />
                </div>

                <FormInput
                    label="Asset Name"
                    name="assetName"
                    icon={Package}
                    placeholder="e.g. Dell Latitude 5420"
                    register={register}
                    error={errors.assetName}
                    {...register("assetName", { required: "Asset name is required" })}
                />

                <FormSelect
                    label="Category"
                    name="categoryId"
                    register={register}
                    error={errors.categoryId}
                    options={categoryOptions}
                    placeholder="Select category"
                    {...register("categoryId", { required: "Category is required" })}
                />

                <div className="grid grid-cols-2 gap-3">
                    <FormSelect
                        label="Status"
                        name="status"
                        register={register}
                        error={errors.status}
                        options={STATUS_OPTIONS}
                    />
                    <FormSelect
                        label="Condition"
                        name="condition"
                        register={register}
                        error={errors.condition}
                        options={CONDITION_OPTIONS}
                    />
                </div>

                <FormInput
                    label="Location"
                    name="location"
                    icon={MapPin}
                    placeholder="e.g. IT Store Room, Block A"
                    register={register}
                    error={errors.location}
                    {...register("location")}
                />

                <FormCheckbox label="This is a shared resource (bookable)" register={register} name="shared" />

                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                        {isEditMode ? "Save Changes" : "Register Asset"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default AssetFormModal;