import Spinner from "./Spinner";

const VARIANTS = {
  primary: "bg-primary text-white hover:bg-blue-700",
  outline: "border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-danger text-white hover:bg-red-600",
  ghost: "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800",
};

// Reusable button used across the app for consistent styling + loading state
function Button({ children, variant = "primary", loading, icon: Icon, className = "", ...props }) {
  return (
    <button
      className={`flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 ${VARIANTS[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <Spinner size={16} /> : Icon && <Icon className="h-4 w-4" />}
      {children}
    </button>
  );
}

export default Button;