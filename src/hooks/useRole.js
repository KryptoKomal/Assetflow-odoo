import { useAuth } from "../context/AuthContext";

export function useRole() {
    const { userProfile } = useAuth();
    const role = (userProfile?.role || "employee").toLowerCase();

    return {
        role,
        isAdmin: role === "admin",
        isManager: role === "manager",
        canManage: role === "admin",
    };
}
