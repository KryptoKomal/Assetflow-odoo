import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Mail, Send, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "../../components/common/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../../context/AuthContext";
import { mapAuthError } from "./Login";

function ForgotPassword() {
    const { resetPassword } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
        setSubmitting(true);
        try {
            await resetPassword(data.email);
            setSent(true);
            toast.success("Password reset email sent!");
        } catch (err) {
            toast.error(mapAuthError(err.code));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Reset your password" subtitle="We'll email you a reset link">
            {sent ? (
                <div className="text-center">
                    <p className="mb-4 text-sm text-slate-600">
                        Check your inbox for a link to reset your password.
                    </p>
                    <Link to="/login" className="text-sm font-medium text-primary hover:underline">
                        Back to Sign In
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="you@company.com"
                        icon={Mail}
                        register={register}
                        error={errors.email}
                        {...register("email", {
                            required: "Email is required",
                            pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
                        })}
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                    >
                        {submitting ? <Spinner size={18} /> : <Send className="h-4 w-4" />}
                        {submitting ? "Sending..." : "Send Reset Link"}
                    </button>

                    <Link
                        to="/login"
                        className="mt-4 flex items-center justify-center gap-1 text-sm text-slate-500 hover:text-primary"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
                    </Link>
                </form>
            )}
        </AuthLayout>
    );
}

export default ForgotPassword;