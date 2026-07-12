import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormInput from "../../components/forms/FormInput";
import FormTextarea from "../../components/forms/FormTextarea";
import Button from "../../components/common/Button";
import { createCategory, updateCategory } from "../../services/categoryService";
import { useAuth } from "../../context/AuthContext";
import { Tag, Clock } from "lucide-react";

function CategoryFormModal({ isOpen, onClose, editingCategory }) {
    const { currentUser } = useAuth();
    const isEditMode = Boolean(editingCategory);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                name: editingCategory?.name || "",
                description: editingCategory?.description || "",
                warranty: editingCategory?.warranty ?? "",
            });
        }
    }, [isOpen, editingCategory, reset]);

    async function onSubmit(data) {
        try {
            if (isEditMode) {
                await updateCategory(editingCategory.id, data, currentUser.uid);
                toast.success("Category updated successfully");
            } else {
                await createCategory(data, currentUser.uid);
                toast.success("Category created successfully");
            }
            onClose();
        } catch (err) {
            toast.error("Something went wrong. Please try again.");
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Category" : "Add Category"}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                    label="Category Name"
                    name="name"
                    icon={Tag}
                    placeholder="e.g. Laptops, Projectors, Furniture"
                    register={register}
                    error={errors.name}
                    {...register("name", { required: "Category name is required" })}
                />

                <FormInput
                    label="Warranty Period (months)"
                    name="warranty"
                    type="number"
                    icon={Clock}
                    placeholder="e.g. 12"
                    register={register}
                    error={errors.warranty}
                    {...register("warranty", {
                        required: "Warranty period is required",
                        min: { value: 0, message: "Must be 0 or greater" },
                    })}
                />

                <FormTextarea
                    label="Description (optional)"
                    name="description"
                    placeholder="Brief description of this asset category"
                    register={register}
                    error={errors.description}
                />

                <div className="mt-5 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button type="submit" loading={isSubmitting} className="flex-1">
                        {isEditMode ? "Save Changes" : "Create Category"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default CategoryFormModal;