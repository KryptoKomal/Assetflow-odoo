import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

// Temporary placeholder for the dashboard until that module is built
function DashboardPlaceholder() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <h1 className="text-2xl font-semibold text-slate-600">
                Dashboard — Coming Soon (you're logged in ✅)
            </h1>
        </div>
    );
}

function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<DashboardPlaceholder />} />
            </Route>
        </Routes>
    );
}

export default AppRoutes;