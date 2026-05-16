import { useEffect } from 'react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { useAuthStore } from './store/authStore';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    document.body.classList.add('antialiased');
  }, []);

  return (
    <>
      {isAuthenticated ? <DashboardPage /> : <LoginPage />}
      <Toaster position="top-right" />
    </>
  );
}