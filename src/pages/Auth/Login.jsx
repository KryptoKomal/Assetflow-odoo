import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import AuthLayout from "../../components/common/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import Spinner from "../../components/common/Spinner";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [submitting, setSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const redirectTo = location.state?.from?.pathname || "/";

    async function onSubmit(data) {
        setSubmitting(true);
        try {
            await login(data.email, data.password);
            toast.success("Welcome back!");
            navigate(redirectTo, { replace: true });
        } catch (err) {
            toast.error(mapAuthError(err.code));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <AuthLayout title="Sign in to AssetFlow" subtitle="Manage your assets and resources">
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
                <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={Lock}
                    register={register}
                    error={errors.password}
                    {...register("password", { required: "Password is required" })}
                />

                <div className="mb-4 flex justify-end">
                    <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
                >
                    {submitting ? <Spinner size={18} /> : <LogIn className="h-4 w-4" />}
                    {submitting ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                    Sign up
                </Link>
            </p>
        </AuthLayout>
    );
}


export function mapAuthError(code) {
    switch (code) {
        case "auth/invalid-email":
            return "Invalid email address.";
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password.";
        case "auth/email-already-in-use":
            return "An account with this email already exists.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/too-many-requests":
            return "Too many attempts. Please try again later.";
        default:
            return "Something went wrong. Please try again.";
    }
}

export default Login;