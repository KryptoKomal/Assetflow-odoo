import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "../../../context/ThemeContext";
import { useSidebar } from "../../../context/SidebarContext";
import ProfileMenu from "./ProfileMenu";

function Navbar() {
    const { darkMode, toggleTheme } = useTheme();
    const { toggleMobile } = useSidebar();

    return (
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 sm:px-6">
            <div className="flex flex-1 items-center gap-3">
                <button
                    onClick={toggleMobile}
                    className="text-slate-500 hover:text-slate-700 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                <div className="relative hidden max-w-sm flex-1 sm:block">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search assets, employees, bookings..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    onClick={toggleTheme}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                    {darkMode ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                </button>

                <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                    <Bell className="h-[18px] w-[18px]" />
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger" />
                </button>

                <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

                <ProfileMenu />
            </div>
        </header>
    );
}

export default Navbar;