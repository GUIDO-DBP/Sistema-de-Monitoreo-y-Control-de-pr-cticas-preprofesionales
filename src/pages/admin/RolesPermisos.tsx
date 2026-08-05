import { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle, AlertTriangle, Key, Users } from 'lucide-react';
import { api } from '../../services/api';
import type { UsuarioBackend } from '../../types/api';


export default function RolesPermisos() {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);

  useEffect(() => {
    api.get<UsuarioBackend[]>('/usuarios')
      .then(res => setUsuarios(Array.isArray(res) ? res : []))
      .catch(() => {});
  }, []);

  const roles = [
    {
      name: 'ADMINISTRADOR',
      desc: 'Acceso total a la configuración del sistema, gestión de usuarios, roles, auditoría e infraestructura.',
      badgeColor: '#DC2626',
      usersCount: usuarios.filter(u => u.rol === 'ADMINISTRADOR').length || 1,
      modules: ['Usuarios & Permisos', 'Configuración General', 'Auditoría & Seguridad', 'Estado del Sistema', 'Periodos Academicos'],
    },
    {
      name: 'COORDINADOR',
      desc: 'Gestión académica global de convenios, empresas, postulaciones, control de horas y reportes institucionales.',
      badgeColor: '#152A43',
      usersCount: usuarios.filter(u => u.rol === 'COORDINADOR').length || 2,
      modules: ['Convenios & Empresas', 'Postulaciones & Etapas', 'Documentos & Horas', 'Evaluaciones', 'Reportes & Seguimiento'],
    },
    {
      name: 'TUTOR',
      desc: 'Supervisión directa en la empresa: validación diaria de horas y evaluación de desempeño de practicantes asignados.',
      badgeColor: '#D97706',
      usersCount: usuarios.filter(u => u.rol === 'TUTOR').length || 4,
      modules: ['Estudiantes Asignados', 'Validación de Horas', 'Evaluaciones de Desempeño'],
    },
    {
      name: 'ESTUDIANTE',
      desc: 'Acceso a expediente propio: registro de postulaciones, carga de documentos PDF y reporte diario de horas.',
      badgeColor: '#2563EB',
      usersCount: usuarios.filter(u => u.rol === 'ESTUDIANTE').length || 8,
      modules: ['Mi Postulación', 'Mis Documentos', 'Mis Horas', 'Mi Evaluación'],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Roles y permisos</h1>
        <p className="mt-1 text-sm text-slate-500">Matriz de roles y asignación de privilegios por módulo en el SMCPP.</p>
      </div>

      {/* Tarjetas de Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {roles.map(r => (
          <div key={r.name} className="p-5 sm:p-6 rounded-2xl border bg-white border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={20} style={{ color: r.badgeColor }} />
                <h3 className="font-bold text-base text-slate-900">{r.name}</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ backgroundColor: r.badgeColor }}>
                {r.usersCount} usuarios
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
            <div className="border-t pt-3 border-slate-100">
              <div className="text-xs font-semibold mb-2 text-slate-700">Módulos permitidos:</div>
              <div className="flex flex-wrap gap-1.5">
                {r.modules.map(m => (
                  <span key={m} className="px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-700 font-medium">
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
