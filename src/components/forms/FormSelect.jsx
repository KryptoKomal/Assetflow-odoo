// Reusable select dropdown wired to react-hook-form's register()
function FormSelect({ label, error, register, name, options, placeholder = "Select an option" }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <select
                className={`w-full rounded-lg border ${
                    error ? "border-danger" : "border-slate-300 dark:border-slate-700"
                } bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-slate-200`}
                {...register(name)}
                defaultValue=""
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-xs text-danger">{error.message}</p>}
        </div>
    );
}

export default FormSelect;