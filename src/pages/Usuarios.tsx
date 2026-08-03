import { useState } from 'react';
import { Search, Users, UserCheck, ShieldCheck, GraduationCap, MoreHorizontal, Plus } from 'lucide-react';
import { estudiantes } from '../data/mockData';
import { Avatar } from '../components/Avatar';

type RolUsuario = 'coordinador' | 'estudiante' | 'tutor';
type EstadoUsuario = 'activo' | 'inactivo';

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: RolUsuario;
  escuela?: string;
  estado: EstadoUsuario;
  ultimoAcceso: string;
  iniciales: string;
  color: string;
}

const usuariosMock: Usuario[] = [
  { id: 'u1', nombre: 'Coord. Carlos Ramos', email: 'c.ramos@univ.edu.pe', rol: 'coordinador', escuela: 'Facultad de Ingeniería', estado: 'activo', ultimoAcceso: 'Hace 15 min', iniciales: 'CR', color: '#152A43' },
  { id: 'u2', nombre: 'Coord. Sandra Quispe', email: 's.quispe@univ.edu.pe', rol: 'coordinador', escuela: 'Facultad de Administración', estado: 'activo', ultimoAcceso: 'Hace 2 horas', iniciales: 'SQ', color: '#152A43' },
  { id: 'u3', nombre: 'Ing. Carlos Medina', email: 'c.medina@andestech.pe', rol: 'tutor', escuela: 'AndesTech Solutions', estado: 'activo', ultimoAcceso: 'Ayer', iniciales: 'CM', color: '#0F9F92' },
  { id: 'u4', nombre: 'Lic. Sandra Vega', email: 's.vega@datasur.pe', rol: 'tutor', escuela: 'DataSur Consultores', estado: 'activo', ultimoAcceso: 'Hace 3 días', iniciales: 'SV', color: '#0F9F92' },
  { id: 'u5', nombre: 'Dr. Pedro Huanca', email: 'p.huanca@muni-puno.gob.pe', rol: 'tutor', escuela: 'Municipalidad Provincial', estado: 'inactivo', ultimoAcceso: 'Hace 1 semana', iniciales: 'PH', color: '#7A8491' },
  { id: 'u6', nombre: 'Lic. Diana Flores', email: 'd.flores@altiplanodigital.pe', rol: 'tutor', escuela: 'Altiplano Digital', estado: 'activo', ultimoAcceso: 'Hace 2 días', iniciales: 'DF', color: '#0F9F92' },
  ...estudiantes.map(e => ({
    id: `ue-${e.id}`,
    nombre: e.nombre,
    email: e.email,
    rol: 'estudiante' as RolUsuario,
    escuela: e.escuela,
    estado: 'activo' as EstadoUsuario,
    ultimoAcceso: 'Hoy',
    iniciales: e.iniciales,
    color: e.color,
  })),
];

const rolConfig: Record<RolUsuario, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  coordinador: { label: 'Coordinador', icon: <ShieldCheck size={12} />, bg: '#EFF6FF', text: '#2563EB' },
  estudiante: { label: 'Estudiante', icon: <GraduationCap size={12} />, bg: '#D1FAE5', text: '#168A5B' },
  tutor: { label: 'Tutor empresarial', icon: <UserCheck size={12} />, bg: '#CCFBF1', text: '#0F9F92' },
};

const roles: Array<'todos' | RolUsuario> = ['todos', 'coordinador', 'estudiante', 'tutor'];

export default function Usuarios() {
  const [query, setQuery] = useState('');
  const [rolFilter, setRolFilter] = useState<'todos' | RolUsuario>('todos');
  const [estadoFilter, setEstadoFilter] = useState<'todos' | EstadoUsuario>('todos');

  const filtered = usuariosMock.filter(u => {
    const matchQ = u.nombre.toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchR = rolFilter === 'todos' || u.rol === rolFilter;
    const matchE = estadoFilter === 'todos' || u.estado === estadoFilter;
    return matchQ && matchR && matchE;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Usuarios</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestión de coordinadores, estudiantes y tutores empresariales.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
          <Plus size={14} /> Nuevo usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Coordinadores', value: usuariosMock.filter(u => u.rol === 'coordinador').length, color: '#2563EB', bg: '#EFF6FF', icon: <ShieldCheck size={18} style={{ color: '#2563EB' }} /> },
          { label: 'Estudiantes', value: usuariosMock.filter(u => u.rol === 'estudiante').length, color: '#168A5B', bg: '#D1FAE5', icon: <GraduationCap size={18} style={{ color: '#168A5B' }} /> },
          { label: 'Tutores', value: usuariosMock.filter(u => u.rol === 'tutor').length, color: '#0F9F92', bg: '#CCFBF1', icon: <UserCheck size={18} style={{ color: '#0F9F92' }} /> },
          { label: 'Usuarios activos', value: usuariosMock.filter(u => u.estado === 'activo').length, color: '#B7791F', bg: '#FEF3C7', icon: <Users size={18} style={{ color: '#B7791F' }} /> },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#5F6B7A' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por nombre o correo electrónico…" />
        </div>
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {roles.map(r => (
            <button key={r} onClick={() => setRolFilter(r)}
              className="px-3 py-2 text-xs font-medium capitalize transition-colors"
              style={{ backgroundColor: rolFilter === r ? '#152A43' : '#FFFFFF', color: rolFilter === r ? '#FFFFFF' : '#5F6B7A' }}>
              {r === 'todos' ? 'Todos' : rolConfig[r].label}
            </button>
          ))}
        </div>
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {(['todos', 'activo', 'inactivo'] as const).map(e => (
            <button key={e} onClick={() => setEstadoFilter(e)}
              className="px-3 py-2 text-xs font-medium capitalize transition-colors"
              style={{ backgroundColor: estadoFilter === e ? '#152A43' : '#FFFFFF', color: estadoFilter === e ? '#FFFFFF' : '#5F6B7A' }}>
              {e === 'todos' ? 'Todos' : e.charAt(0).toUpperCase() + e.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center">
            <Users size={40} style={{ color: '#DCE3EA', marginBottom: 12 }} />
            <p className="text-sm font-medium" style={{ color: '#172033' }}>Sin usuarios</p>
            <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>No se encontraron usuarios con ese criterio.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Usuario', 'Correo', 'Rol', 'Área / Escuela', 'Estado', 'Último acceso', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const rCfg = rolConfig[u.rol];
                return (
                  <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar iniciales={u.iniciales} color={u.color} size="sm" />
                        <span className="text-sm font-medium" style={{ color: '#172033' }}>{u.nombre}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: rCfg.bg, color: rCfg.text }}>
                        {rCfg.icon}{rCfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{u.escuela ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium"
                        style={{ color: u.estado === 'activo' ? '#168A5B' : '#7A8491' }}>
                        <span className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: u.estado === 'activo' ? '#168A5B' : '#7A8491' }} />
                        {u.estado === 'activo' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{u.ultimoAcceso}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded hover:bg-gray-100" style={{ color: '#5F6B7A' }}>
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
