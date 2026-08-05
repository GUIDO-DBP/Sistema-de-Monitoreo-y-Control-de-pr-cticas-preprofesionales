import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bandeja from './pages/Bandeja';
import Postulaciones from './pages/Postulaciones';
import DetallePostulacion from './pages/DetallePostulacion';
import NuevaPostulacion from './pages/NuevaPostulacion';
import ControlHoras from './pages/ControlHoras';
import Evaluaciones from './pages/Evaluaciones';
import Convenios from './pages/Convenios';
import Reportes from './pages/Reportes';
import Notificaciones from './pages/Notificaciones';

// Student pages
import MiPostulacion from './pages/estudiante/MiPostulacion';
import MisDocumentos from './pages/estudiante/MisDocumentos';
import MisHoras from './pages/estudiante/MisHoras';
import MiEvaluacion from './pages/estudiante/MiEvaluacion';
import Perfil from './pages/estudiante/Perfil';
import Soporte from './pages/estudiante/Soporte';

// Shared & Admin pages
import Empresas from './pages/Empresas';
import Documentos from './pages/Documentos';
import Seguimiento from './pages/Seguimiento';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';

// Dedicated Admin pages
import RolesPermisos from './pages/admin/RolesPermisos';
import PeriodosAcademicos from './pages/admin/PeriodosAcademicos';
import RequisitosDocumentarios from './pages/admin/RequisitosDocumentarios';
import AuditoriaSistema from './pages/admin/AuditoriaSistema';
import SeguridadAccesos from './pages/admin/SeguridadAccesos';
import EstadoSistema from './pages/admin/EstadoSistema';
import Incidencias from './pages/admin/Incidencias';

import { api } from './services/api';
import type { UserBackend, RolBackend } from './types/api';

const LS_TOKEN = 'smcpp_token';
const LS_USER = 'smcpp_user';
const LS_ROL = 'smcpp_rol';

// Helper to get item from sessionStorage first, then localStorage
function getStoredItem(key: string): string | null {
  return sessionStorage.getItem(key) || localStorage.getItem(key);
}

// Helper to remove SMCPP session keys safely from both storages
function clearSmcppStorage() {
  const keys = [LS_TOKEN, LS_USER, LS_ROL];
  keys.forEach(k => {
    sessionStorage.removeItem(k);
    localStorage.removeItem(k);
  });
}

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [rol, setRolState] = useState<RolBackend>('COORDINADOR');
  const [user, setUser] = useState<UserBackend | null>(null);
  const [authChecking, setAuthChecking] = useState<boolean>(true);

  // Validate session on mount with GET /api/auth/me
  useEffect(() => {
    const restoreSession = async () => {
      setAuthChecking(true);
      
      const token = getStoredItem(LS_TOKEN);
      const savedRol = getStoredItem(LS_ROL) as RolBackend;
      const savedUserRaw = getStoredItem(LS_USER);

      if (!token) {
        clearSmcppStorage();
        setAuthenticated(false);
        setUser(null);
        setAuthChecking(false);
        return;
      }

      if (savedRol) {
        setRolState(savedRol);
      }
      if (savedUserRaw) {
        try { setUser(JSON.parse(savedUserRaw)); } catch {}
      }

      try {
        const userData = await api.get<UserBackend>('/auth/me');
        setUser(userData);

        // Update active storage
        const activeStorage = sessionStorage.getItem(LS_TOKEN) ? sessionStorage : localStorage;
        activeStorage.setItem(LS_USER, JSON.stringify(userData));

        const appRol: RolBackend = userData.rol;
        setRolState(appRol);
        activeStorage.setItem(LS_ROL, appRol);
        setAuthenticated(true);
      } catch (error) {
        clearSmcppStorage();
        setAuthenticated(false);
        setUser(null);
      } finally {
        setAuthChecking(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogin = (r: RolBackend, userData?: UserBackend) => {
    const activeStorage = sessionStorage.getItem(LS_TOKEN) ? sessionStorage : localStorage;
    if (userData) {
      setUser(userData);
      activeStorage.setItem(LS_USER, JSON.stringify(userData));
      setRolState(userData.rol);
      activeStorage.setItem(LS_ROL, userData.rol);
    } else {
      setRolState(r);
      activeStorage.setItem(LS_ROL, r);
    }
    setAuthenticated(true);
  };

  const handleLogout = useCallback(() => {
    clearSmcppStorage();
    setAuthenticated(false);
    setUser(null);
    setRolState('COORDINADOR');
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="spinner"></div>
        <p className="mt-4 text-gray-500 font-medium">Restaurando sesión...</p>
      </div>
    );
  }

  // Redirect target based on role
  let initialDashboardTarget = '/dashboard';
  if (rol === 'TUTOR') initialDashboardTarget = '/tutor/dashboard';
  else if (rol === 'ADMINISTRADOR') initialDashboardTarget = '/admin/dashboard';

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            authenticated ? <Navigate to={initialDashboardTarget} replace /> : <Login onLogin={(r, u) => handleLogin(u?.rol || r, u)} />
          } />

          <Route path="/" element={
            authenticated
              ? <Layout rol={rol} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }>
            <Route index element={<Navigate to={initialDashboardTarget} replace />} />

            {/* Dashboards */}
            <Route path="dashboard" element={<Dashboard rol={rol} />} />
            <Route path="tutor/dashboard" element={<Dashboard rol="TUTOR" />} />
            <Route path="admin/dashboard" element={<Dashboard rol="ADMINISTRADOR" />} />

            {/* Shared routes */}
            <Route path="notificaciones" element={<Notificaciones rol={rol === 'COORDINADOR' || rol === 'ADMINISTRADOR' ? 'coordinador' : 'estudiante'} />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="soporte" element={<Soporte />} />

            {/* Coordinator routes */}
            <Route path="bandeja" element={<Bandeja />} />
            <Route path="convenios" element={<Convenios />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="postulaciones" element={<Postulaciones />} />
            <Route path="postulaciones/nueva" element={<NuevaPostulacion rol={rol === 'COORDINADOR' ? 'coordinador' : 'estudiante'} />} />
            <Route path="postulaciones/:codigo" element={<DetallePostulacion />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="control-horas" element={<ControlHoras />} />
            <Route path="evaluaciones" element={<Evaluaciones />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="seguimiento" element={<Seguimiento />} />

            {/* Tutor routes */}
            <Route path="tutor/estudiantes" element={<Postulaciones />} />
            <Route path="tutor/horas" element={<ControlHoras />} />
            <Route path="tutor/evaluaciones" element={<Evaluaciones />} />

            {/* Admin routes with dedicated components */}
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracion" element={<Configuracion />} />
            <Route path="admin/roles" element={<RolesPermisos />} />
            <Route path="admin/periodos" element={<PeriodosAcademicos />} />
            <Route path="admin/requisitos" element={<RequisitosDocumentarios />} />
            <Route path="admin/auditoria" element={<AuditoriaSistema />} />
            <Route path="admin/seguridad" element={<SeguridadAccesos />} />
            <Route path="admin/estado-sistema" element={<EstadoSistema />} />
            <Route path="admin/incidencias" element={<Incidencias />} />

            {/* Student routes */}
            <Route path="mi-postulacion" element={<MiPostulacion />} />
            <Route path="mi-postulacion/nueva" element={<NuevaPostulacion rol="estudiante" />} />
            <Route path="mis-documentos" element={<MisDocumentos />} />
            <Route path="mis-horas" element={<MisHoras />} />
            <Route path="mi-evaluacion" element={<MiEvaluacion />} />
          </Route>

          <Route path="*" element={<Navigate to={authenticated ? initialDashboardTarget : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
