import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Bell, ChevronDown, ChevronRight, Clock, FileUp,
  ClipboardList, BarChart2, FileText, CheckSquare, Users, Shield, Key, Menu
} from 'lucide-react';
import { api } from '../services/api';
import type { NotificacionBackend, UserBackend, RolBackend } from '../types/api';

const breadcrumbMap: Record<string, string> = {
  '/dashboard': 'Inicio',
  '/bandeja': 'Bandeja de trabajo',
  '/convenios': 'Convenios',
  '/empresas': 'Empresas receptoras',
  '/postulaciones': 'Postulaciones',
  '/documentos': 'Documentos',
  '/control-horas': 'Control de horas',
  '/evaluaciones': 'Evaluaciones',
  '/reportes': 'Reportes',
  '/seguimiento': 'Seguimiento',
  '/notificaciones': 'Notificaciones',
  '/usuarios': 'Usuarios',
  '/configuracion': 'Configuración',
  '/mi-postulacion': 'Mi postulación',
  '/mis-documentos': 'Mis documentos',
  '/mis-horas': 'Mis horas',
  '/mi-evaluacion': 'Mi evaluación',
  '/perfil': 'Mi perfil',
  '/soporte': 'Ayuda y soporte',
  '/tutor/estudiantes': 'Estudiantes asignados',
  '/tutor/horas': 'Horas por validar',
  '/tutor/evaluaciones': 'Evaluaciones pendientes',
  '/admin/roles': 'Roles y permisos',
  '/admin/periodos': 'Periodos académicos',
  '/admin/requisitos': 'Requisitos documentarios',
  '/admin/auditoria': 'Auditoría del sistema',
  '/admin/seguridad': 'Seguridad y accesos',
  '/admin/estado-sistema': 'Estado del sistema',
  '/admin/incidencias': 'Incidencias',
};

interface TopbarProps {
  rol: RolBackend;
  onLogout: () => void;
  onToggleMobileMenu?: () => void;
}

export function Topbar({ rol, onLogout, onToggleMobileMenu }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Read stored user details
  const storedUserRaw = localStorage.getItem('smcpp_user');
  let userObj: UserBackend | null = null;
  if (storedUserRaw) {
    try { userObj = JSON.parse(storedUserRaw); } catch { userObj = null; }
  }

  // Fetch unread count from API
  useEffect(() => {
    let isMounted = true;
    api.get<NotificacionBackend[]>('/notificaciones')
      .then((notifs) => {
        if (isMounted && Array.isArray(notifs)) {
          setUnreadCount(notifs.filter(n => !n.leida).length);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [location.pathname, rol]);

  const path = location.pathname;
  const breadLabel = Object.entries(breadcrumbMap).find(([k]) => path.startsWith(k))?.[1] ?? 'SMCPP';

  // Role differentiated actions and search placeholders
  let actions = [
    { label: 'Registrar horas', icon: Clock, url: '/mis-horas' },
    { label: 'Subir documento', icon: FileUp, url: '/mis-documentos' },
    { label: 'Ver mi postulación', icon: ClipboardList, url: '/mi-postulacion' },
  ];
  let searchPlaceholder = 'Buscar en mi postulación, documentos u horas…';

  if (rol === 'ADMINISTRADOR') {
    actions = [
      { label: 'Crear usuario', icon: Users, url: '/usuarios' },
      { label: 'Gestionar roles', icon: Shield, url: '/admin/roles' },
      { label: 'Revisar auditoría', icon: Key, url: '/admin/auditoria' },
    ];
    searchPlaceholder = 'Buscar usuario, rol o configuración…';
  } else if (rol === 'COORDINADOR') {
    actions = [
      { label: 'Nueva postulación', icon: ClipboardList, url: '/postulaciones/nueva' },
      { label: 'Nuevo convenio', icon: FileText, url: '/convenios' },
      { label: 'Generar reporte', icon: BarChart2, url: '/reportes' },
    ];
    searchPlaceholder = 'Buscar estudiante, convenio o empresa…';
  } else if (rol === 'TUTOR') {
    actions = [
      { label: 'Validar horas', icon: Clock, url: '/tutor/horas' },
      { label: 'Completar evaluación', icon: CheckSquare, url: '/tutor/evaluaciones' },
      { label: 'Ver estudiantes', icon: Users, url: '/tutor/estudiantes' },
    ];
    searchPlaceholder = 'Buscar estudiante asignado o evaluación…';
  }

  const userName = userObj?.nombre || (
    rol === 'ADMINISTRADOR' ? 'Administrador General' :
    rol === 'COORDINADOR' ? 'Coord. Carlos Ramos' :
    rol === 'TUTOR' ? 'Ing. Carlos Medina' : 'Ana Torres Mamani'
  );

  const userInitials = userName
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const userSubtitle = userObj?.rol
    ? (userObj.rol === 'ADMINISTRADOR' ? 'Administrador' : userObj.rol === 'COORDINADOR' ? 'Coordinador' : userObj.rol === 'TUTOR' ? 'Tutor Empresarial' : 'Estudiante')
    : (rol === 'ADMINISTRADOR' ? 'Administrador' : rol === 'COORDINADOR' ? 'Coordinador' : rol === 'TUTOR' ? 'Tutor' : 'Estudiante');

  const handleLogout = () => {
    setShowProfile(false);
    setShowActions(false);
    onLogout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="flex items-center gap-2 sm:gap-4 px-4 sm:px-6 h-14 border-b shrink-0 transition-all w-full"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3EA' }}>
      
      {/* Mobile Menu Toggle */}
      {onToggleMobileMenu && (
        <button 
          onClick={onToggleMobileMenu}
          className="md:hidden flex items-center justify-center p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 shrink-0 mr-1"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        <span className="hidden sm:inline" style={{ color: '#5F6B7A' }}>SMCPP</span>
        <ChevronRight size={13} className="hidden sm:block" style={{ color: '#DCE3EA' }} />
        <span className="font-medium truncate" style={{ color: '#172033' }}>{breadLabel}</span>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center w-full max-w-[280px]">
        <Search size={14} className="absolute left-3" style={{ color: '#5F6B7A' }} />
        <input
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none focus:border-blue-400 transition-colors"
          style={{ borderColor: '#DCE3EA', backgroundColor: '#F4F7FA', color: '#172033' }}
          placeholder={searchPlaceholder}
        />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Quick actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="flex items-center justify-center gap-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
            <Plus size={16} className="sm:w-[14px] sm:h-[14px]" />
            <span className="hidden sm:inline">Acción rápida</span>
            <ChevronDown size={12} className="hidden sm:inline" />
          </button>
          {showActions && (
            <div className="absolute right-0 top-10 rounded-xl shadow-lg border z-50 py-1"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3EA', width: 210 }}>
              {(!actions || actions.length === 0) ? (
                <div className="px-4 py-2 text-xs text-gray-500">No hay acciones disponibles para este perfil.</div>
              ) : (
                actions.map(a => {
                  const IconComp = typeof a.icon === 'function' || (typeof a.icon === 'object' && a.icon !== null) ? a.icon : null;
                  return (
                    <button key={a.label}
                      onClick={() => {
                        setShowActions(false);
                        if (a.url) navigate(a.url);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors text-left"
                      style={{ color: '#172033' }}>
                      {IconComp ? <IconComp size={14} style={{ color: '#5F6B7A' }} /> : <Plus size={14} style={{ color: '#5F6B7A' }} />}
                      {a.label}
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>


        {/* Bell Notification */}
        <button onClick={() => navigate('/notificaciones')}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          style={{ color: '#5F6B7A' }}>
          <Bell size={18} className="sm:w-4 sm:h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full text-white flex items-center justify-center"
              style={{ backgroundColor: '#C43D4D', fontSize: 10 }}>{unreadCount}</span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 pl-1.5 pr-1.5 sm:pr-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-7 h-7 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold"
              style={{ backgroundColor: rol === 'ADMINISTRADOR' ? '#DC2626' : rol === 'COORDINADOR' ? '#152A43' : rol === 'TUTOR' ? '#D97706' : '#2563EB' }}>
              {userInitials}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-medium truncate max-w-[120px]" style={{ color: '#172033' }}>{userName}</div>
              <div className="text-xs capitalize truncate max-w-[120px]" style={{ color: '#5F6B7A' }}>{userSubtitle}</div>
            </div>
            <ChevronDown size={12} className="hidden sm:block" style={{ color: '#5F6B7A' }} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-10 rounded-xl shadow-lg border z-50 py-1"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#DCE3EA', width: 220 }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: '#EDF2F7' }}>
                <div className="text-sm font-semibold truncate" style={{ color: '#172033' }}>{userName}</div>
                <div className="text-xs mt-0.5 capitalize truncate" style={{ color: '#5F6B7A' }}>{userSubtitle} · Periodo 2026-I</div>
              </div>

              <div className="py-1">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                  style={{ color: '#C43D4D' }}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Close dropdowns on outside click */}
      {(showProfile || showActions) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowProfile(false); setShowActions(false); }} />
      )}
    </header>
  );
}
