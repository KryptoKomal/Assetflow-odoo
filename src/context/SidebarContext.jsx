import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function useSidebar() {
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