function FormInput({ label, type = "text", error, register, name, placeholder, icon: Icon }) {
    return (
        <div className="mb-4">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    className={`w-full rounded-lg border ${
                        error ? "border-danger" : "border-slate-300"
                    } ${Icon ? "pl-9" : "pl-3"} pr-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20`}
                    {...register(name)}
                />
            </div>
            {error && <p className="mt-1 text-xs text-danger">{error.message}</p>}
        </div>
    );
}

export default FormInput;