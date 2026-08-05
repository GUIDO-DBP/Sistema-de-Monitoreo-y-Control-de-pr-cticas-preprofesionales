import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, FileText, Building2, ClipboardList,
  FolderOpen, Clock, Star, BarChart2, Navigation, Bell,
  Users, Settings, ChevronLeft, ChevronRight, HelpCircle,
  Home, UserCircle, MessageCircle, Shield, Key, Calendar,
  FileCheck, Activity, AlertOctagon, CheckSquare
} from 'lucide-react';
import type { RolBackend } from '../types/api';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  rol: RolBackend;
}

const coordinadorGroups = [
  {
    label: 'GENERAL',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Resumen' },
      { to: '/bandeja', icon: Inbox, label: 'Bandeja de trabajo' },
    ],
  },
  {
    label: 'GESTIÓN',
    items: [
      { to: '/convenios', icon: FileText, label: 'Convenios' },
      { to: '/empresas', icon: Building2, label: 'Empresas receptoras' },
      { to: '/postulaciones', icon: ClipboardList, label: 'Postulaciones' },
      { to: '/documentos', icon: FolderOpen, label: 'Documentos' },
      { to: '/control-horas', icon: Clock, label: 'Control de horas' },
      { to: '/evaluaciones', icon: Star, label: 'Evaluaciones' },
    ],
  },
  {
    label: 'ANÁLISIS',
    items: [
      { to: '/reportes', icon: BarChart2, label: 'Reportes' },
      { to: '/seguimiento', icon: Navigation, label: 'Seguimiento' },
    ],
  },
  {
    label: 'SISTEMA',
    items: [
      { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
      { to: '/usuarios', icon: Users, label: 'Usuarios' },
      { to: '/configuracion', icon: Settings, label: 'Configuración' },
    ],
  },
];

const estudianteGroups = [
  {
    label: 'MI PRÁCTICA',
    items: [
      { to: '/dashboard', icon: Home, label: 'Inicio' },
      { to: '/mi-postulacion', icon: ClipboardList, label: 'Mi postulación' },
      { to: '/mis-documentos', icon: FolderOpen, label: 'Mis documentos' },
      { to: '/mis-horas', icon: Clock, label: 'Mis horas' },
      { to: '/mi-evaluacion', icon: Star, label: 'Mi evaluación' },
    ],
  },
  {
    label: 'COMUNICACIÓN',
    items: [
      { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
      { to: '/soporte', icon: MessageCircle, label: 'Ayuda y soporte' },
    ],
  },
  {
    label: 'CUENTA',
    items: [
      { to: '/perfil', icon: UserCircle, label: 'Mi perfil' },
    ],
  },
];

const tutorGroups = [
  {
    label: 'GESTIÓN DE PRÁCTICAS',
    items: [
      { to: '/dashboard', icon: Home, label: 'Inicio' },
      { to: '/tutor/estudiantes', icon: Users, label: 'Estudiantes asignados' },
      { to: '/tutor/horas', icon: Clock, label: 'Horas por validar' },
      { to: '/tutor/evaluaciones', icon: CheckSquare, label: 'Evaluaciones' },
    ],
  },
  {
    label: 'COMUNICACIÓN',
    items: [
      { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
      { to: '/soporte', icon: MessageCircle, label: 'Ayuda y soporte' },
    ],
  },
  {
    label: 'CUENTA',
    items: [
      { to: '/perfil', icon: UserCircle, label: 'Mi perfil' },
    ],
  },
];

const adminGroups = [
  {
    label: 'ADMINISTRACIÓN',
    items: [
      { to: '/dashboard', icon: Home, label: 'Inicio' },
      { to: '/usuarios', icon: Users, label: 'Usuarios' },
      { to: '/admin/roles', icon: Shield, label: 'Roles y permisos' },
      { to: '/admin/periodos', icon: Calendar, label: 'Periodos académicos' },
      { to: '/admin/requisitos', icon: FileCheck, label: 'Requisitos documentarios' },
      { to: '/configuracion', icon: Settings, label: 'Configuración general' },
    ],
  },
  {
    label: 'CONTROL DEL SISTEMA',
    items: [
      { to: '/admin/auditoria', icon: Key, label: 'Auditoría' },
      { to: '/admin/seguridad', icon: Shield, label: 'Seguridad' },
      { to: '/admin/estado-sistema', icon: Activity, label: 'Estado del sistema' },
      { to: '/notificaciones', icon: Bell, label: 'Notificaciones' },
    ],
  },
  {
    label: 'SOPORTE',
    items: [
      { to: '/admin/incidencias', icon: AlertOctagon, label: 'Incidencias' },
      { to: '/soporte', icon: MessageCircle, label: 'Ayuda y soporte' },
    ],
  },
  {
    label: 'CUENTA',
    items: [
      { to: '/perfil', icon: UserCircle, label: 'Mi perfil' },
    ],
  },
];

function SMCPPLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <circle cx="6" cy="16" r="4" fill="#0F9F92" />
      <circle cx="16" cy="8" r="4" fill="#0F9F92" fillOpacity="0.7" />
      <circle cx="26" cy="16" r="4" fill="#0F9F92" />
      <line x1="10" y1="16" x2="14" y2="10" stroke="#0F9F92" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="18" y1="10" x2="22" y2="14" stroke="#0F9F92" strokeWidth="1.5" strokeOpacity="0.5" />
      <polyline points="22,18 26,22 30,14" stroke="#0F9F92" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function Sidebar({ collapsed, onToggle, rol }: SidebarProps) {
  const location = useLocation();

  let groups = estudianteGroups;
  let roleLabel = '🎓 Estudiante';

  if (rol === 'ADMINISTRADOR') {
    groups = adminGroups;
    roleLabel = '🛡️ Administrador General';
  } else if (rol === 'COORDINADOR') {
    groups = coordinadorGroups;
    roleLabel = '👤 Coordinador de prácticas';
  } else if (rol === 'TUTOR') {
    groups = tutorGroups;
    roleLabel = '👔 Tutor Empresarial';
  }

  return (
    <aside
      className="flex flex-col h-full relative transition-all duration-300"
      style={{ width: collapsed ? 72 : 248, backgroundColor: '#152A43', flexShrink: 0 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="flex-shrink-0"><SMCPPLogo /></div>
        {!collapsed && (
          <div className="overflow-hidden">
            <div className="text-white font-bold text-base leading-tight">SMCPP</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>Prácticas preprofesionales</div>
          </div>
        )}
      </div>

      {/* Role badge */}
      {!collapsed && (
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.50)' }}>
            {roleLabel}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-4">
            {!collapsed && (
              <div className="px-3 py-1 text-xs font-semibold tracking-wider mb-1"
                style={{ color: 'rgba(255,255,255,0.30)' }}>
                {group.label}
              </div>
            )}
            {group.items.map(({ to, icon: Icon, label }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to + '/'));
              return (
                <NavLink key={to} to={to} title={collapsed ? label : undefined}
                  className="flex items-center gap-3 rounded-lg mb-0.5 relative transition-all"
                  style={{
                    padding: collapsed ? '10px 0' : '9px 12px',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    backgroundColor: isActive ? 'rgba(37,99,235,0.22)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.60)',
                  }}>
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r" style={{ backgroundColor: '#0F9F92' }} />
                  )}
                  <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                  {!collapsed && <span className="text-sm font-medium">{label}</span>}
                </NavLink>
              );
            })}
            {!collapsed && <div className="my-2 mx-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        {!collapsed && (
          <div className="mx-2 mb-3 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <div className="text-xs font-semibold text-white">Periodo 2026-I</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0F9F92' }} />
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>Activo</span>
            </div>
          </div>
        )}
        <button className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-xs transition-colors"
          style={{ color: 'rgba(255,255,255,0.45)', justifyContent: collapsed ? 'center' : 'flex-start' }}>
          <HelpCircle size={15} />
          {!collapsed && 'Ayuda y soporte'}
        </button>
      </div>

      {/* Toggle */}
      <button onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md z-10"
        style={{ backgroundColor: '#FFFFFF', border: '1px solid #DCE3EA', color: '#5F6B7A' }}>
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
