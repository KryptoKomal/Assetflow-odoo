import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import DashboardLayout from "../components/layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Departments from "../pages/Departments/Departments";
import Employees from "../pages/Employees/Employees";
import Categories from "../pages/Categories/Categories";
import Assets from "../pages/Assets/Assets";
import Allocation from "../pages/Allocation/Allocation";
import Transfer from "../pages/Transfer/Transfer";
import Bookings from "../pages/Bookings/Bookings";
import Maintenance from "../pages/Maintenance/Maintenance";
import Audit from "../pages/Audit/Audit";
import Reports from "../pages/Reports/Reports";
import Notifications from "../pages/Notifications/Notifications";
import Logs from "../pages/Logs/Logs";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/assets" element={<Assets />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/maintenance" element={<Maintenance />} />

                    <Route element={<AdminRoute />}>
                        <Route path="/departments" element={<Departments />} />
                        <Route path="/employees" element={<Employees />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/allocation" element={<Allocation />} />
                        <Route path="/transfer" element={<Transfer />} />
                        <Route path="/audit" element={<Audit />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/logs" element={<Logs />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    );
}

export default AppRoutes;