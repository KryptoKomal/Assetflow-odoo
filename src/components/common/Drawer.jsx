import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";


function Drawer({ isOpen, onClose, title, children, width = "max-w-md" }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`fixed inset-y-0 right-0 z-50 w-full ${width} overflow-y-auto bg-white shadow-xl dark:bg-slate-900`}
                    >
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-5">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default Drawer;