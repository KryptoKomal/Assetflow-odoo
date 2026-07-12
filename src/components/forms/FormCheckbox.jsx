
function FormCheckbox({ label, register, name }) {
    return (
        <label className="mb-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/30 dark:border-slate-600"
                {...register(name)}
            />
            {label}
        </label>
    );
}

export default FormCheckbox;