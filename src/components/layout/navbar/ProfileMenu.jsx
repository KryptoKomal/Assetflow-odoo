import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

function ProfileMenu() {
    const { currentUser, userProfile, logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function handleLogout() {
        try {
            await logout();
            toast.info("Logged out successfully");
            navigate("/login", { replace: true });
        } catch {
            toast.error("Failed to log out");
        }
    }

    const displayName = userProfile?.name || currentUser?.displayName || "User";
    const initials = displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {initials}
                </div>
                <div className="hidden text-left sm:block">
                    <p className="text-sm font-medium leading-tight text-slate-700 dark:text-slate-200">
                        {displayName}
                    </p>
                    <p className="text-xs capitalize leading-tight text-slate-400">
                        {userProfile?.role || "employee"}
                    </p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-slate-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <button
                        onClick={() => setOpen(false)}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <User className="h-4 w-4" /> My Profile
                    </button>
                    <hr className="my-1 border-slate-100 dark:border-slate-700" />
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3.5 py-2 text-sm text-danger hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                        <LogOut className="h-4 w-4" /> Log Out
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;