import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SidebarContext = createContext();

export function useSidebar() {
    return useContext(SidebarContext);
}

export function SidebarProvider({ children }) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    // Close mobile sidebar when route changes
    useEffect(() => {
        setMobileOpen(false);
    }, [location]);

    const toggleCollapsed = () => setCollapsed((prev) => !prev);
    const toggleMobile = () => setMobileOpen((prev) => !prev);
    const closeMobile = () => setMobileOpen(false);

    return (
        <SidebarContext.Provider
            value={{
                collapsed,
                toggleCollapsed,
                mobileOpen,
                toggleMobile,
                closeMobile,
            }}
        >
            {children}
        </SidebarContext.Provider>
    );
}
