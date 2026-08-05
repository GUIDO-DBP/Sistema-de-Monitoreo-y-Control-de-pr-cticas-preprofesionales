import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import type { RolBackend } from '../types/api';

// Route matrices for each role
const COORD_ONLY_ROUTES = [
  '/bandeja', '/convenios', '/empresas', '/postulaciones', '/documentos',
  '/control-horas', '/evaluaciones', '/reportes', '/seguimiento', '/usuarios', '/configuracion',
];

const STUDENT_ONLY_ROUTES = [
  '/mi-postulacion', '/mis-documentos', '/mis-horas', '/mi-evaluacion',
];

const TUTOR_ONLY_ROUTES = [
  '/tutor/dashboard', '/tutor/estudiantes', '/tutor/horas', '/tutor/evaluaciones',
];

const ADMIN_ONLY_ROUTES = [
  '/admin/dashboard', '/usuarios', '/admin/roles', '/admin/periodos',
  '/admin/requisitos', '/configuracion', '/admin/auditoria', '/admin/seguridad',
  '/admin/estado-sistema', '/admin/incidencias',
];

interface RouteGuardProps {
  children: React.ReactNode;
  rol: RolBackend;
  onAccessDenied: (msg: string) => void;
}

export function RouteGuard({ children, rol, onAccessDenied }: RouteGuardProps) {
  const location = useLocation();
  const path = location.pathname;

  let isAllowed = true;
  let fallbackRedirect = '/dashboard';

  if (rol === 'TUTOR') {
    // Tutor can only access TUTOR_ONLY_ROUTES, /notificaciones, /perfil, /soporte, /dashboard
    const allowedTutor = TUTOR_ONLY_ROUTES.some(r => path.startsWith(r)) || ['/dashboard', '/notificaciones', '/perfil', '/soporte'].includes(path);
    if (!allowedTutor) {
      isAllowed = false;
      fallbackRedirect = '/tutor/dashboard';
    }
  } else if (rol === 'ESTUDIANTE') {
    // Student can only access STUDENT_ONLY_ROUTES, /dashboard, /notificaciones, /perfil, /soporte
    const allowedStudent = STUDENT_ONLY_ROUTES.some(r => path.startsWith(r)) || ['/dashboard', '/notificaciones', '/perfil', '/soporte'].includes(path);
    if (!allowedStudent) {
      isAllowed = false;
      fallbackRedirect = '/dashboard';
    }
  } else if (rol === 'ADMINISTRADOR') {
    // Admin cannot access student personal routes or tutor routes
    const isStudentPersonal = STUDENT_ONLY_ROUTES.some(r => path.startsWith(r));
    const isTutorPersonal = TUTOR_ONLY_ROUTES.some(r => path.startsWith(r));
    if (isStudentPersonal || isTutorPersonal) {
      isAllowed = false;
      fallbackRedirect = '/admin/dashboard';
    }
  } else if (rol === 'COORDINADOR') {
    // Coordinator cannot access student personal routes or tutor routes or admin system control
    const isStudentPersonal = STUDENT_ONLY_ROUTES.some(r => path.startsWith(r));
    const isTutorPersonal = TUTOR_ONLY_ROUTES.some(r => path.startsWith(r));
    const isAdminOnly = ['/admin/roles', '/admin/periodos', '/admin/requisitos', '/admin/auditoria', '/admin/seguridad', '/admin/estado-sistema', '/admin/incidencias'].some(r => path.startsWith(r));
    if (isStudentPersonal || isTutorPersonal || isAdminOnly) {
      isAllowed = false;
      fallbackRedirect = '/dashboard';
    }
  }

  useEffect(() => {
    if (!isAllowed) {
      onAccessDenied('No tienes permisos para acceder a esta sección.');
    }
  }, [path, isAllowed, onAccessDenied]);

  if (!isAllowed) {
    return <Navigate to={fallbackRedirect} replace />;
  }

  return <>{children}</>;
}
