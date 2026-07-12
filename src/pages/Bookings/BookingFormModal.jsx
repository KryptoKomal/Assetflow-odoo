import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import FormSelect from "../../components/forms/FormSelect";
import FormInput from "../../components/forms/FormInput";
import Button from "../../components/common/Button";
import { createBooking } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";

function BookingFormModal({ isOpen, onClose, sharedAssets, employees, initialSlot }) {
    const { currentUser } = useAuth();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({
                resourceId: "",
                employeeId: "",
                title: "",
                startTime: initialSlot?.start ? toLocalInput(initialSlot.start) : "",
                endTime: initialSlot?.end ? toLocalInput(initialSlot.end) : "",
            });
        }
    }, [isOpen, initialSlot, reset]);

    function toLocalInput(date) {
        const d = new Date(date);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }

    const resourceOptions = sharedAssets.map((a) => ({ value: a.id, label: `${a.assetName} (${a.assetTag})` }));
    const employeeOptions = employees.map((e) => ({ value: e.id, label: e.name }));

    async function onSubmit(data) {
        try {
            if (new Date(data.endTime) <= new Date(data.startTime)) {
                toast.error("End time must be after start time");
                return;
            }
            await createBooking(data, currentUser.uid);
            toast.success("Booking confirmed");
            onClose();
        } catch (err) {
            if (err.message === "OVERLAP") {
                toast.error("This resource is already booked for the selected time range");
            } else {
                toast.error("Failed to create booking");
            }
            console.error(err);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Booking">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormSelect
                    label="Resource"
                    name="resourceId"
                    register={register}
                    error={errors.resourceId}
                    options={resourceOptions}
                    placeholder={resourceOptions.length ? "Select a shared resource" : "No shared resources — mark an asset as 'shared'"}
                    {...register("resourceId", { required: "Please select a resource" })}
                />
                <FormSelect
                    label="Booked By"
                    name="employeeId"
                    register={register}
                    error={errors.employeeId}
                    options={employeeOptions}
                    placeholder="Select employee"
                    {...register("employeeId", { required: "Please select an employee" })}
                />
                <FormInput
                    label="Purpose (optional)"
                    name="title"
                    placeholder="e.g. Client demo"
                    register={register}
                    error={errors.title}
                    {...register("title")}
                />
                <FormInput
                    label="Start Time"
                    name="startTime"
                    type="datetime-local"
                    register={register}
                    error={errors.startTime}
                    {...register("startTime", { required: "Start time is required" })}
                />
                <FormInput
                    label="End Time"
                    name="endTime"
                    type="datetime-local"
                    register={register}
                    error={errors.endTime}
                    {...register("endTime", { required: "End time is required" })}
                />

                <div className="mt-2 flex gap-3">
                    <Button type="button" variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button type="submit" loading={isSubmitting} disabled={!resourceOptions.length} className="flex-1">Book</Button>
                </div>
            </form>
        </Modal>
    );
}

export default BookingFormModal;