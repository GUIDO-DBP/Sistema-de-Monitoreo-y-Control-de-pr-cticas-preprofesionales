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
// New pages
import Empresas from './pages/Empresas';
import Documentos from './pages/Documentos';
import Seguimiento from './pages/Seguimiento';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion';

import { api } from './services/api';
import type { UserBackend } from './types/api';

const LS_TOKEN = 'smcpp_token';
const LS_ROL = 'smcpp_rol';
const LS_USER = 'smcpp_user';

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean>(() => !!localStorage.getItem(LS_TOKEN));
  const [rol, setRolState] = useState<'coordinador' | 'estudiante'>(() => {
    const r = localStorage.getItem(LS_ROL);
    return r === 'estudiante' ? 'estudiante' : 'coordinador';
  });
  const [user, setUser] = useState<UserBackend | null>(() => {
    const raw = localStorage.getItem(LS_USER);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  });
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Validate session on mount with GET /api/auth/me
  useEffect(() => {
    const token = localStorage.getItem(LS_TOKEN);
    if (!token) {
      setAuthenticated(false);
      setCheckingAuth(false);
      return;
    }

    api.get<UserBackend>('/auth/me')
      .then((userData) => {
        setUser(userData);
        localStorage.setItem(LS_USER, JSON.stringify(userData));

        const appRol: 'coordinador' | 'estudiante' =
          userData.rol === 'COORDINADOR' || userData.rol === 'ADMINISTRADOR'
            ? 'coordinador'
            : 'estudiante';

        setRolState(appRol);
        localStorage.setItem(LS_ROL, appRol);
        setAuthenticated(true);
      })
      .catch(() => {
        // Token invalid or expired
        localStorage.removeItem(LS_TOKEN);
        localStorage.removeItem(LS_USER);
        localStorage.removeItem(LS_ROL);
        setAuthenticated(false);
        setUser(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  const handleLogin = (r: 'coordinador' | 'estudiante', userData?: UserBackend) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem(LS_USER, JSON.stringify(userData));
    }
    setRolState(r);
    localStorage.setItem(LS_ROL, r);
    setAuthenticated(true);
  };

  const handleRolChange = useCallback((r: 'coordinador' | 'estudiante') => {
    localStorage.setItem(LS_ROL, r);
    setRolState(r);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LS_TOKEN);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_ROL);
    setAuthenticated(false);
    setUser(null);
    setRolState('coordinador');
  }, []);

  if (checkingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">Verificando sesión con el backend SMCPP…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            authenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
          } />

          <Route path="/" element={
            authenticated
              ? <Layout rol={rol} onRolChange={handleRolChange} onLogout={handleLogout} />
              : <Navigate to="/login" replace />
          }>
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Shared */}
            <Route path="dashboard" element={<Dashboard rol={rol} />} />
            <Route path="notificaciones" element={<Notificaciones rol={rol} />} />

            {/* Coordinator-only routes */}
            <Route path="bandeja" element={<Bandeja />} />
            <Route path="convenios" element={<Convenios />} />
            <Route path="empresas" element={<Empresas />} />
            <Route path="postulaciones" element={<Postulaciones />} />
            <Route path="postulaciones/nueva" element={<NuevaPostulacion rol={rol} />} />
            <Route path="postulaciones/:codigo" element={<DetallePostulacion />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="control-horas" element={<ControlHoras />} />
            <Route path="evaluaciones" element={<Evaluaciones />} />
            <Route path="reportes" element={<Reportes />} />
            <Route path="seguimiento" element={<Seguimiento />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracion" element={<Configuracion />} />

            {/* Student-only routes */}
            <Route path="mi-postulacion" element={<MiPostulacion />} />
            <Route path="mi-postulacion/nueva" element={<NuevaPostulacion rol={rol} />} />
            <Route path="mis-documentos" element={<MisDocumentos />} />
            <Route path="mis-horas" element={<MisHoras />} />
            <Route path="mi-evaluacion" element={<MiEvaluacion />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="soporte" element={<Soporte />} />
          </Route>

          <Route path="*" element={<Navigate to={authenticated ? '/dashboard' : '/login'} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
