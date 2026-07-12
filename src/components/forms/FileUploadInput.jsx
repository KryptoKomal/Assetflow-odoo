import { useRef, useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";


function FileUploadInput({ label, existingUrl, onFileSelect }) {
    const inputRef = useRef(null);
    const [preview, setPreview] = useState(existingUrl || null);

    useEffect(() => {
        setPreview(existingUrl || null);
    }, [existingUrl]);

    function handleChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreview(URL.createObjectURL(file));
        onFileSelect(file);
    }

    function handleRemove() {
        setPreview(null);
        onFileSelect(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    return (
        <div className="mb-4">
            {label && (
                <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            {preview ? (
                <div className="relative w-fit">
                    <img
                        src={preview}
                        alt="Preview"
                        className="h-28 w-28 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-danger text-white shadow"
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="flex h-28 w-28 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-primary hover:text-primary dark:border-slate-700"
                >
                    <ImagePlus className="h-6 w-6" />
                    <span className="text-xs">Upload</span>
                </button>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
            />
        </div>
    );
}

export default FileUploadInput;