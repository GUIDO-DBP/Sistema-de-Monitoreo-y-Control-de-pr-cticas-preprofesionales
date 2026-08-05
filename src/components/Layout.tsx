import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { RouteGuard } from './RouteGuard';
import { Toast } from './Toast';
import type { RolBackend } from '../types/api';

interface LayoutProps {
  rol: RolBackend;
  onLogout: () => void;
}

export function Layout({ rol, onLogout }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'error') => {
    setToast(msg);
    setToastType(type);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(c => !c)} 
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        rol={rol} 
      />
      <div className="flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        <Topbar 
          rol={rol} 
          onLogout={onLogout} 
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0">
          <RouteGuard rol={rol} onAccessDenied={msg => showToast(msg, 'error')}>
            <Outlet />
          </RouteGuard>
        </main>
      </div>
      {toast && <Toast message={toast} type={toastType} onDismiss={() => setToast('')} />}
    </div>
  );
}
