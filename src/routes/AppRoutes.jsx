import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";

function ModulePlaceholder({ label }) {
    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                {label}
            </h1>
            <p className="mt-1 text-sm text-slate-500">This module is coming soon.</p>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/departments" element={<ModulePlaceholder label="Departments" />} />
                    <Route path="/employees" element={<ModulePlaceholder label="Employees" />} />
                    <Route path="/categories" element={<ModulePlaceholder label="Categories" />} />
                    <Route path="/assets" element={<ModulePlaceholder label="Assets" />} />
                    <Route path="/allocation" element={<ModulePlaceholder label="Allocation" />} />
                    <Route path="/transfer" element={<ModulePlaceholder label="Transfer" />} />
                    <Route path="/bookings" element={<ModulePlaceholder label="Bookings" />} />
                    <Route path="/maintenance" element={<ModulePlaceholder label="Maintenance" />} />
                    <Route path="/audit" element={<ModulePlaceholder label="Audit" />} />
                    <Route path="/reports" element={<ModulePlaceholder label="Reports" />} />
                    <Route path="/notifications" element={<ModulePlaceholder label="Notifications" />} />
                    <Route path="/logs" element={<ModulePlaceholder label="Logs" />} />
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;