import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "../../components/common/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../../context/AuthContext";
import { mapAuthError } from "./Login";

function Signup() {
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    async function onSubmit(data) {
        setSubmitting(true);
        try {
            await signup(data.name, data.email, data.password);
            toast.success("Account created successfully!");
            navigate("/", { replace: true });
        } catch (err) {
            toast.error(mapAuthError(err.code));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Create your account" subtitle="Get started with AssetFlow">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <FormInput
                    label="Full Name"
                    name="name"
                    placeholder="Ankit Kumar Jha"
                    icon={User}
                    register={register}
                    error={errors.name}
                    {...register("name", { required: "Name is required" })}
                />
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
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="At least 6 characters"
                    icon={Lock}
                    register={register}
                    error={errors.password}
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Minimum 6 characters" },
                    })}
                />
                <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    placeholder="Re-enter password"
                    icon={Lock}
                    register={register}
                    error={errors.confirmPassword}
                    {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {submitting ? <Spinner size={18} /> : <UserPlus className="h-4 w-4" />}
                    {submitting ? "Creating account..." : "Create Account"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
}

export default Signup;