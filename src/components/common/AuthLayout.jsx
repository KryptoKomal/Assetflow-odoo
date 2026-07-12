import { motion } from "framer-motion";
import { Boxes } from "lucide-react";

function AuthLayout({ title, subtitle, children }) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
            >
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Boxes className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
                    {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                    )}
                </div>
                {children}
            </motion.div>
        </div>
    );
}

export default AuthLayout;