import { create } from 'zustand';

type DashboardMode = 'website' | 'application';

interface DashboardState {
  mode: DashboardMode;
  sidebarCollapsed: boolean;
  setMode: (mode: DashboardMode) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  mode: 'website',
  sidebarCollapsed: false,
  setMode: (mode) => set({ mode }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
}));
