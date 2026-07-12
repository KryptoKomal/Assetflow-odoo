import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import { SidebarProvider } from "../../context/SidebarContext";

function DashboardLayoutContent() {
    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default function DashboardLayout() {
    return (
        <SidebarProvider>
            <DashboardLayoutContent />
        </SidebarProvider>
    );
}
