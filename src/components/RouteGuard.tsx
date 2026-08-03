import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Routes only the coordinator can access
const COORD_ONLY_ROUTES = [
  '/bandeja', '/convenios', '/empresas', '/postulaciones', '/documentos',
  '/control-horas', '/evaluaciones', '/reportes', '/seguimiento', '/usuarios', '/configuracion',
];

// Routes only the student can access
const STUDENT_ONLY_ROUTES = [
  '/mi-postulacion', '/mis-documentos', '/mis-horas', '/mi-evaluacion', '/perfil', '/soporte',
];

interface RouteGuardProps {
  children: React.ReactNode;
  rol: 'coordinador' | 'estudiante';
  onAccessDenied: (msg: string) => void;
}

export function RouteGuard({ children, rol, onAccessDenied }: RouteGuardProps) {
  const location = useLocation();
  const path = location.pathname;

  const isCoordOnly = COORD_ONLY_ROUTES.some(r => path.startsWith(r));
  const isStudentOnly = STUDENT_ONLY_ROUTES.some(r => path.startsWith(r));

  useEffect(() => {
    if (rol === 'estudiante' && isCoordOnly) {
      onAccessDenied('No tienes permisos para acceder a esta sección.');
    } else if (rol === 'coordinador' && isStudentOnly) {
      onAccessDenied('No tienes permisos para acceder a esta sección.');
    }
  }, [path, rol, isCoordOnly, isStudentOnly, onAccessDenied]);

  if (rol === 'estudiante' && isCoordOnly) {
    return <Navigate to="/dashboard" replace />;
  }

  if (rol === 'coordinador' && isStudentOnly) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
