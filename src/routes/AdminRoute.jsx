import { Navigate, Outlet } from "react-router-dom";
import { useRole } from "../hooks/useRole";

function AdminRoute() {
    const { isAdmin } = useRole();
    if (!isAdmin) return <Navigate to="/" replace />;
    return <Outlet />;
}

export default AdminRoute;
