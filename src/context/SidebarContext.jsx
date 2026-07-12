<<<<<<< HEAD
import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
=======
import { createContext, useContext, useState } from "react";
>>>>>>> 559e4e1e201a01cb829072e1cccc5704ca02e9a4

const SidebarContext = createContext();

export function useSidebar() {
<<<<<<< HEAD
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
=======
  return useContext(SidebarContext);
}

// Controls collapsed/expanded state of the sidebar, shared across layout components
export function SidebarProvider({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleCollapsed() {
    setCollapsed((prev) => !prev);
  }

  function toggleMobile() {
    setMobileOpen((prev) => !prev);
  }

  function closeMobile() {
    setMobileOpen(false);
  }

  return (
    <SidebarContext.Provider
      value={{ collapsed, toggleCollapsed, mobileOpen, toggleMobile, closeMobile }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
>>>>>>> 559e4e1e201a01cb829072e1cccc5704ca02e9a4
