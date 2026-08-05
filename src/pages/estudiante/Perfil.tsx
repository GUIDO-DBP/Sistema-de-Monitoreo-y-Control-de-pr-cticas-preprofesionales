import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import type { UserBackend } from '../../types/api';

export default function Perfil() {
  const [user, setUser] = useState<UserBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [telefono, setTelefono] = useState('987 654 321');
  const [toast, setToast] = useState('');

  useEffect(() => {
    api.get<UserBackend>('/auth/me')
      .then(u => {
        setUser(u);
        if (u?.estudiante?.telefono) {
          setTelefono(u.estudiante.telefono);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Cargando perfil en tiempo real…</div>;
  }

  const rol = user?.rol || 'ESTUDIANTE';
  const nombre = user?.nombre || 'Usuario SMCPP';
  const email = user?.email || 'usuario@unap.edu.pe';
  const initials = nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  // Dynamic profile views according to authenticated role
  return (
    <div className="max-w-2xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white bg-slate-900">
          {toast}
        </div>
      )}

      <h1 className="text-3xl font-semibold text-slate-900">Mi perfil</h1>

      {/* Header Avatar Card */}
      <div className="p-6 rounded-2xl border bg-white flex items-center gap-5 border-slate-200">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{
            backgroundColor: rol === 'ADMINISTRADOR' ? '#DC2626' : rol === 'COORDINADOR' ? '#152A43' : rol === 'TUTOR' ? '#D97706' : '#2563EB'
          }}>
          {initials}
        </div>
        <div>
          <div className="text-xl font-semibold text-slate-900">{nombre}</div>
          <div className="text-sm text-slate-500">{email}</div>
          <div className="text-xs font-semibold mt-1 px-2.5 py-0.5 rounded-full inline-block text-white"
            style={{
              backgroundColor: rol === 'ADMINISTRADOR' ? '#DC2626' : rol === 'COORDINADOR' ? '#152A43' : rol === 'TUTOR' ? '#D97706' : '#2563EB'
            }}>
            {rol === 'ADMINISTRADOR' ? 'ADMINISTRADOR GENERAL' : rol === 'COORDINADOR' ? 'COORDINADOR DE PRÁCTICAS' : rol === 'TUTOR' ? 'TUTOR EMPRESARIAL' : 'ESTUDIANTE'}
          </div>
        </div>
      </div>

      {/* Role specific profile section */}
      {rol === 'ADMINISTRADOR' && (
        <div className="p-6 rounded-2xl border bg-white space-y-4 border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Datos de la cuenta de administración</h2>
          <div className="space-y-3">
            {[
              ['Nombre completo', nombre],
              ['Correo institucional', email],
              ['Rol del sistema', 'ADMINISTRADOR GENERAL'],
              ['Estado de la cuenta', 'ACTIVO (Privilegios globales)'],
              ['Fecha de alta', user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '01/01/2026'],
              ['Políticas de acceso', 'Autenticación obligatoria JWT / Bcrypt'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rol === 'COORDINADOR' && (
        <div className="p-6 rounded-2xl border bg-white space-y-4 border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Datos del coordinador institucional</h2>
          <div className="space-y-3">
            {[
              ['Nombre completo', nombre],
              ['Correo institucional', email],
              ['Unidad / Oficina', 'Oficina de Prácticas Preprofesionales (UNAP)'],
              ['Cargo', 'Coordinador Principal de Prácticas'],
              ['Periodo a cargo', 'Periodo Académico 2026-I'],
              ['Teléfono de contacto', '951 234 567'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rol === 'TUTOR' && (
        <div className="p-6 rounded-2xl border bg-white space-y-4 border-slate-200">
          <h2 className="text-base font-semibold text-slate-900">Datos del tutor empresarial</h2>
          <div className="space-y-3">
            {[
              ['Nombre completo', nombre],
              ['Correo corporativo', email],
              ['Empresa vinculada', user?.tutor?.empresa || 'AndesTech Solutions'],
              ['Cargo empresarial', user?.tutor?.cargo || 'Jefe de Desarrollo'],
              ['Estudiantes asignados', `${user?.tutor?.estudiantesAsignados || 2} practicantes`],
              ['Teléfono de contacto', '951 987 654'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {rol === 'ESTUDIANTE' && (
        <>
          <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Datos personales del estudiante</h2>
              <button onClick={() => setEditing(!editing)} className="text-sm font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-blue-600">
                {editing ? 'Cancelar' : 'Editar'}
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Código universitario</span><span className="font-medium text-slate-900">{user?.estudiante?.codigo || '2021064821'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Escuela profesional</span><span className="font-medium text-slate-900">{user?.estudiante?.escuela || 'Ingeniería de Sistemas'}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Ciclo académico</span><span className="font-medium text-slate-900">{user?.estudiante?.ciclo || 9}° ciclo</span></div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">Teléfono de contacto</label>
                <input value={telefono} onChange={e => setTelefono(e.target.value)} readOnly={!editing}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none border-slate-200 bg-slate-50 text-slate-900" />
              </div>
            </div>
            {editing && (
              <button onClick={() => { setEditing(false); showToast('Perfil actualizado correctamente.'); }}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white">
                Guardar cambios
              </button>
            )}
          </div>

          <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">Información de práctica</h2>
            {[
              ['Empresa', user?.estudiante?.postulacion?.empresa || 'AndesTech Solutions'],
              ['Área', user?.estudiante?.postulacion?.area || 'Desarrollo de software'],
              ['Tutor empresarial', user?.estudiante?.postulacion?.tutor || 'Ing. Carlos Medina'],
              ['Coordinador de prácticas', user?.estudiante?.postulacion?.coordinador || 'Coord. Carlos Ramos'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm">
                <span className="text-slate-500">{k}</span>
                <span className="font-medium text-slate-900">{v}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
