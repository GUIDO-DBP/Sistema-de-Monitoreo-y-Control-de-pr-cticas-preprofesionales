import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, UserCheck, UserX, KeyRound, AlertCircle, RefreshCw, X, Shield, Mail } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { UsuarioBackend, RolBackend } from '../types/api';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [rolFilter, setRolFilter] = useState<'TODOS' | RolBackend>('TODOS');

  // Modal Nuevo Usuario
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'ESTUDIANTE' as RolBackend,
    codigo: '',
    escuela: 'Ingeniería de Sistemas',
  });

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<UsuarioBackend[]>('/usuarios');
      setUsuarios(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar la lista de usuarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await api.post('/usuarios', formData);
      setShowModal(false);
      setFormData({
        nombre: '',
        email: '',
        password: '',
        rol: 'ESTUDIANTE',
        codigo: '',
        escuela: 'Ingeniería de Sistemas',
      });
      fetchUsuarios();
    } catch (err) {
      if (err instanceof ApiError) setFormError(err.message);
      else setFormError('Error al crear usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleEstado = async (u: UsuarioBackend) => {
    try {
      await api.patch(`/usuarios/${u.id}/estado`, { activo: !u.activo });
      fetchUsuarios();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al cambiar estado.');
    }
  };

  const handleResetPassword = async (u: UsuarioBackend) => {
    if (!confirm(`¿Restablecer contraseña para ${u.nombre}?`)) return;
    try {
      const res = await api.patch<{ message: string; defaultPassword?: string }>(`/usuarios/${u.id}/reset-password`, {});
      alert(`Contraseña restablecida correctamente. Nueva clave: ${res.defaultPassword || 'Smcpp2026*'}`);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al restablecer contraseña.');
    }
  };

  const filtered = usuarios.filter(u => {
    const matchRol = rolFilter === 'TODOS' || u.rol === rolFilter;
    const matchSearch = !search || u.nombre.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRol && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Gestión de Usuarios</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Administra roles, accesos y credenciales del sistema SMCPP.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          style={{ backgroundColor: '#2563EB' }}>
          <Plus size={16} /> Crear usuario
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchUsuarios} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar usuario o correo…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={rolFilter}
          onChange={e => setRolFilter(e.target.value as any)}
          className="px-3 py-2 rounded-lg border text-sm"
          style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}
        >
          <option value="TODOS">Todos los roles</option>
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="COORDINADOR">Coordinador</option>
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="TUTOR">Tutor</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando usuarios desde PostgreSQL…
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Usuario', 'Correo', 'Rol', 'Estado', 'Registro', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium" style={{ color: '#172033' }}>{u.nombre}</div>
                    {u.estudiante && <div className="text-xs text-gray-400 font-mono">{u.estudiante.codigo}</div>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: u.rol === 'ADMINISTRADOR' ? '#FEE2E2' : u.rol === 'COORDINADOR' ? '#EFF6FF' : '#F4F7FA', color: '#172033' }}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusChip estado={u.activo ? 'activo' : 'suspendido'} />
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleEstado(u)}
                        title={u.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        className={`p-1.5 rounded-lg border text-white ${u.activo ? 'bg-amber-600' : 'bg-green-600'}`}
                      >
                        {u.activo ? <UserX size={14} /> : <UserCheck size={14} />}
                      </button>
                      <button
                        onClick={() => handleResetPassword(u)}
                        title="Restablecer Contraseña"
                        className="p-1.5 rounded-lg border text-white bg-blue-600"
                      >
                        <KeyRound size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            No se encontraron usuarios.
          </div>
        )}
      </div>

      {/* Modal Nuevo Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 border shadow-xl" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: '#172033' }}>Crear Nuevo Usuario</h3>
              <button onClick={() => setShowModal(false)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#C43D4D' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Nombre Completo</label>
                <input required value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="ej. Mario Flores Catacora" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Correo Electrónico</label>
                <input type="email" required value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="mario.flores@unap.edu.pe" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Contraseña Inicial</label>
                <input type="password" required value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Rol del Usuario</label>
                <select value={formData.rol} onChange={e => setFormData(p => ({ ...p, rol: e.target.value as RolBackend }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }}>
                  <option value="ESTUDIANTE">Estudiante</option>
                  <option value="COORDINADOR">Coordinador</option>
                  <option value="TUTOR">Tutor Empresarial</option>
                  <option value="ADMINISTRADOR">Administrador</option>
                </select>
              </div>

              {formData.rol === 'ESTUDIANTE' && (
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Código Universitario</label>
                  <input value={formData.codigo} onChange={e => setFormData(p => ({ ...p, codigo: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none font-mono" style={{ borderColor: '#DCE3EA' }} placeholder="2021064822" />
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB' }}>
                  {saving ? 'Creando…' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
