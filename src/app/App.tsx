import { useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuthStore } from './store/authStore';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/theme-provider';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    document.body.classList.add('antialiased');
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme" attribute="class">
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}