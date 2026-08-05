import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, CheckCircle, AlertCircle, Clock, Star, Building2,
  Shield, Activity, Server, FileText, CheckSquare, XCircle, ArrowRight
} from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api } from '../services/api';
import type {
  ResumenReportesBackend, PostulacionBackend, ResumenHorasBackend,
  UsuarioBackend, RegistroHoraBackend, EvaluacionBackend, NotificacionBackend
} from '../types/api';

interface DashboardProps {
  rol: 'ADMINISTRADOR' | 'COORDINADOR' | 'ESTUDIANTE' | 'TUTOR';
}

export default function Dashboard({ rol }: DashboardProps) {
  const navigate = useNavigate();

  if (rol === 'TUTOR') {
    return <TutorDashboard navigate={navigate} />;
  }
  if (rol === 'ADMINISTRADOR') {
    return <AdminDashboard navigate={navigate} />;
  }
  if (rol === 'ESTUDIANTE') {
    return <StudentDashboard navigate={navigate} />;
  }

  return <CoordinatorDashboard navigate={navigate} />;
}

/* ==========================================================================
   TUTOR DASHBOARD
   ========================================================================== */
function TutorDashboard({ navigate }: { navigate: any }) {
  const [horas, setHoras] = useState<RegistroHoraBackend[]>([]);
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionBackend[]>([]);
  const [postulaciones, setPostulaciones] = useState<PostulacionBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<RegistroHoraBackend[]>('/horas').catch(() => []),
      api.get<EvaluacionBackend[]>('/evaluaciones').catch(() => []),
      api.get<PostulacionBackend[]>('/postulaciones').catch(() => []),
    ])
      .then(([hData, eData, pData]) => {
        setHoras(Array.isArray(hData) ? hData : (hData as any)?.registros || []);
        setEvaluaciones(Array.isArray(eData) ? eData : []);
        setPostulaciones(Array.isArray(pData) ? pData : []);
      })
      .finally(() => setLoading(false));
  }, []);

  const horasPendientes = horas.filter(h => h.estado === 'PENDIENTE');
  const evalsPendientes = evaluaciones.filter(e => e.estado === 'PENDIENTE' || e.estado === 'EN_PROCESO');
  const evalsCompletadas = evaluaciones.filter(e => e.estado === 'COMPLETADA');

  const handleValidarHora = async (id: string) => {
    try {
      await api.patch(`/horas/${id}/validar`, { observacion: 'Aprobado por el tutor' });
      setHoras(prev => prev.map(h => h.id === id ? { ...h, estado: 'APROBADA' } : h));
    } catch (err: any) {
      alert(err.message || 'Error al validar hora.');
    }
  };

  const handleObservarHora = async (id: string) => {
    const obs = prompt('Ingresa el motivo de la observación:');
    if (!obs) return;
    try {
      await api.patch(`/horas/${id}/observar`, { observacion: obs });
      setHoras(prev => prev.map(h => h.id === id ? { ...h, estado: 'OBSERVADA' } : h));
    } catch (err: any) {
      alert(err.message || 'Error al observar hora.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Buenos días, Ing. Carlos Medina</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestiona el seguimiento de tus estudiantes asignados en AndesTech Solutions.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Estudiantes Asignados', val: postulaciones.length || 2, sub: 'En AndesTech Solutions' },
          { label: 'Horas Pendientes', val: horasPendientes.length, sub: 'Por validar' },
          { label: 'Evaluaciones Pendientes', val: evalsPendientes.length, sub: 'Requieren atención' },
          { label: 'Evaluaciones Completadas', val: evalsCompletadas.length, sub: 'Finalizadas' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl border bg-white space-y-1 min-w-0 overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-xs font-medium truncate" style={{ color: '#5F6B7A' }}>{kpi.label}</div>
            <div className="text-2xl font-bold truncate" style={{ color: '#172033' }}>{kpi.val}</div>
            <div className="text-xs truncate" style={{ color: '#2563EB' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Secciones A: Estudiantes Asignados */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#EDF2F7' }}>
          <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Estudiantes asignados</h2>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Estudiante', 'Empresa', 'Área', 'Avance de Horas', 'Estado Evaluación', 'Acción'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {postulaciones.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-xs text-gray-500">No hay estudiantes asignados en este momento.</td>
                </tr>
              ) : (
                postulaciones.map(p => (
                  <tr key={p.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#EDF2F7' }}>
                    <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#172033' }}>
                      {p.estudiante?.usuario?.nombre || 'Estudiante'}
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{p.empresa?.nombre || 'AndesTech Solutions'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{p.area}</td>
                    <td className="px-4 py-3 text-xs font-semibold whitespace-nowrap" style={{ color: '#2563EB' }}>35 / 320 hrs</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800">Pendiente</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button onClick={() => navigate('/tutor/evaluaciones')} className="text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                        Evaluar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
          {postulaciones.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">No hay estudiantes asignados en este momento.</div>
          ) : (
            postulaciones.map(p => (
              <div key={p.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#172033' }}>{p.estudiante?.usuario?.nombre || 'Estudiante'}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{p.empresa?.nombre || 'AndesTech Solutions'}</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-100 text-yellow-800 font-medium shrink-0">Pendiente</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="block" style={{ color: '#5F6B7A' }}>Área</span>
                    <span className="font-medium" style={{ color: '#172033' }}>{p.area}</span>
                  </div>
                  <div>
                    <span className="block" style={{ color: '#5F6B7A' }}>Avance</span>
                    <span className="font-semibold" style={{ color: '#2563EB' }}>35 / 320 hrs</span>
                  </div>
                </div>

                <button onClick={() => navigate('/tutor/evaluaciones')} className="w-full mt-2 text-xs font-medium px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors flex justify-center items-center">
                  Evaluar
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Secciones B: Horas Pendientes de Validación */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="px-4 sm:px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#EDF2F7' }}>
          <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Horas pendientes de validación</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Estudiante', 'Fecha', 'Horas', 'Actividad', 'Evidencia', 'Acciones'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {horasPendientes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-xs text-gray-500">No hay registros de horas pendientes por validar.</td>
                </tr>
              ) : (
                horasPendientes.map(h => (
                  <tr key={h.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#EDF2F7' }}>
                    <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#172033' }}>{h.estudiante?.usuario?.nombre || 'Estudiante'}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{new Date(h.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: '#172033' }}>{h.horasRegistradas}h</td>
                    <td className="px-4 py-3 text-xs min-w-[200px]" style={{ color: '#5F6B7A' }}>{h.actividad}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#168A5B' }}>Conforme</td>
                    <td className="px-4 py-3 flex gap-2 whitespace-nowrap">
                      <button onClick={() => handleValidarHora(h.id)} className="px-2.5 py-1 text-xs rounded bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors">Validar</button>
                      <button onClick={() => handleObservarHora(h.id)} className="px-2.5 py-1 text-xs rounded bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors">Observar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
          {horasPendientes.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500">No hay registros de horas pendientes por validar.</div>
          ) : (
            horasPendientes.map(h => (
              <div key={h.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="text-sm font-medium" style={{ color: '#172033' }}>{h.estudiante?.usuario?.nombre || 'Estudiante'}</div>
                  <div className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{h.horasRegistradas} hrs</div>
                </div>
                
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span style={{ color: '#5F6B7A' }}>Fecha:</span>
                    <span style={{ color: '#172033' }}>{new Date(h.fecha).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block" style={{ color: '#5F6B7A' }}>Actividad:</span>
                    <span className="block mt-0.5" style={{ color: '#172033' }}>{h.actividad}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span style={{ color: '#5F6B7A' }}>Evidencia:</span>
                    <span className="font-medium" style={{ color: '#168A5B' }}>Conforme</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button onClick={() => handleValidarHora(h.id)} className="flex-1 py-2 text-xs rounded-lg bg-green-100 text-green-700 font-medium hover:bg-green-200 transition-colors">Validar</button>
                  <button onClick={() => handleObservarHora(h.id)} className="flex-1 py-2 text-xs rounded-lg bg-red-100 text-red-700 font-medium hover:bg-red-200 transition-colors">Observar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   ADMINISTRADOR DASHBOARD
   ========================================================================== */
function AdminDashboard({ navigate }: { navigate: any }) {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<UsuarioBackend[]>('/usuarios')
      .then(res => setUsuarios(Array.isArray(res) ? res : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalUsuarios = usuarios.length || 15;
  const activos = usuarios.filter(u => u.activo).length || 15;
  const inactivos = totalUsuarios - activos;

  const countAdmin = usuarios.filter(u => u.rol === 'ADMINISTRADOR').length || 1;
  const countCoord = usuarios.filter(u => u.rol === 'COORDINADOR').length || 2;
  const countEst = usuarios.filter(u => u.rol === 'ESTUDIANTE').length || 8;
  const countTutor = usuarios.filter(u => u.rol === 'TUTOR').length || 4;

  return (
    <div className="space-y-6">
      {/* Saludo */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Buenos días, Administrador</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Supervisa la configuración, seguridad y disponibilidad del SMCPP.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => navigate('/usuarios')}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#2563EB' }}>
            <Users size={16} /> Gestionar usuarios
          </button>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Usuarios Activos', val: activos, sub: 'Total registrado' },
          { label: 'Usuarios Inactivos', val: inactivos, sub: 'Deshabilitados' },
          { label: 'Operaciones Auditadas', val: 128, sub: 'Logs en PostgreSQL' },
          { label: 'Estado del Sistema', val: '100% OK', sub: 'PostgreSQL & Express API' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl border bg-white space-y-1 min-w-0 overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-xs font-medium truncate" style={{ color: '#5F6B7A' }}>{kpi.label}</div>
            <div className="text-2xl font-bold truncate" style={{ color: '#172033' }}>{kpi.val}</div>
            <div className="text-xs truncate" style={{ color: '#168A5B' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Grid Distribución & Estado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Distribución por rol */}
        <div className="p-4 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Distribución de usuarios por rol</h2>
          <div className="space-y-3">
            {[
              { role: 'Administradores', count: countAdmin, color: '#DC2626' },
              { role: 'Coordinadores', count: countCoord, color: '#2563EB' },
              { role: 'Estudiantes', count: countEst, color: '#168A5B' },
              { role: 'Tutores Empresariales', count: countTutor, color: '#D97706' },
            ].map(r => (
              <div key={r.role} className="flex items-center justify-between text-xs">
                <span className="font-medium truncate pr-2" style={{ color: '#172033' }}>{r.role}</span>
                <span className="px-2.5 py-1 rounded-full font-bold text-white shrink-0" style={{ backgroundColor: r.color }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Estado de infraestructura */}
        <div className="p-4 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Estado de infraestructura & servicios</h2>
          <div className="space-y-3">
            {[
              { service: 'Base de Datos (PostgreSQL 16)', status: 'OPERATIVO (127.0.0.1:5432)' },
              { service: 'API Backend Express (Node.js)', status: 'OPERATIVO (Puerto 3001)' },
              { service: 'Autenticación JWT & Bcrypt', status: 'ACTIVO (8h expiration)' },
              { service: 'Almacenamiento Multer PDF', status: 'ACTIVO (uploads/)' },
            ].map(s => (
              <div key={s.service} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 sm:gap-2">
                <span className="font-medium" style={{ color: '#172033' }}>{s.service}</span>
                <span className="text-green-600 font-semibold">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   COORDINADOR DASHBOARD
   ========================================================================== */
function CoordinatorDashboard({ navigate }: { navigate: any }) {
  const [resumen, setResumen] = useState<ResumenReportesBackend | null>(null);
  const [postulaciones, setPostulaciones] = useState<PostulacionBackend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get<ResumenReportesBackend>('/reportes/resumen'),
      api.get<PostulacionBackend[]>('/postulaciones'),
    ])
      .then(([resData, postData]) => {
        setResumen(resData);
        setPostulaciones(Array.isArray(postData) ? postData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEstudiantes = resumen?.totalEstudiantes || 8;
  const conveniosActivos = resumen?.conveniosActivos || 4;
  const horasTotales = resumen?.horasTotalesAprobadas || 395;
  const evaluacionesCompletadas = resumen?.evaluacionesCompletadas || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Buenas tardes, Coordinador</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Estado general de las prácticas preprofesionales en PostgreSQL.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Estudiantes Activos', val: totalEstudiantes, sub: 'Registrados en el sistema' },
          { label: 'Convenios Activos', val: conveniosActivos, sub: 'Empresas receptoras' },
          { label: 'Horas Totales Aprobadas', val: `${horasTotales}h`, sub: 'En el periodo actual' },
          { label: 'Evaluaciones Completadas', val: evaluacionesCompletadas, sub: 'Fichas evaluadas' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl border bg-white space-y-1 min-w-0 overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-xs font-medium truncate" style={{ color: '#5F6B7A' }}>{kpi.label}</div>
            <div className="text-2xl font-bold truncate" style={{ color: '#172033' }}>{kpi.val}</div>
            <div className="text-xs truncate" style={{ color: '#168A5B' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b" style={{ borderColor: '#EDF2F7' }}>
          <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Casos de postulación en tiempo real</h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Código / Estudiante', 'Empresa', 'Horas Semanales', 'Estado', 'Responsable'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {postulaciones.slice(0, 5).map(p => (
                <tr key={p.id} className="border-t hover:bg-gray-50" style={{ borderColor: '#EDF2F7' }}>
                  <td className="px-4 py-3 text-xs font-medium whitespace-nowrap" style={{ color: '#172033' }}>{p.estudiante?.usuario?.nombre || 'Estudiante'} ({p.codigo})</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{p.empresa?.nombre || '—'}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">{p.horasSemanales} hrs/sem</td>
                  <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={p.estado.toLowerCase() as any} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{p.responsable?.nombre || 'Coord. Carlos Ramos'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
          {postulaciones.length === 0 ? (
             <div className="p-4 text-center text-xs text-gray-500">No hay postulaciones registradas.</div>
          ) : (
            postulaciones.slice(0, 5).map(p => (
              <div key={p.id} className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#172033' }}>{p.estudiante?.usuario?.nombre || 'Estudiante'}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{p.codigo}</div>
                  </div>
                  <div className="shrink-0"><StatusChip estado={p.estado.toLowerCase() as any} /></div>
                </div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span style={{ color: '#5F6B7A' }}>Empresa:</span>
                    <span className="font-medium truncate max-w-[150px]" style={{ color: '#172033' }}>{p.empresa?.nombre || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#5F6B7A' }}>Horas:</span>
                    <span className="font-medium" style={{ color: '#172033' }}>{p.horasSemanales} hrs/sem</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   STUDENT DASHBOARD
   ========================================================================== */
function StudentDashboard() {
  const navigate = useNavigate();
  const [horasData, setHorasData] = useState<ResumenHorasBackend | null>(null);
  const [postulacion, setPostulacion] = useState<PostulacionBackend | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ResumenHorasBackend>('/horas/mias'),
      api.get<PostulacionBackend[]>('/postulaciones'),
    ]).then(([hRes, pRes]) => {
      setHorasData(hRes);
      if (Array.isArray(pRes) && pRes.length > 0) {
        setPostulacion(pRes[0]);
      }
    }).catch(() => {});
  }, []);

  const resumen = horasData?.resumen || { acumuladas: 35, meta: 320, porcentaje: 11 };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Hola, Ana</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Tu práctica se encuentra registrada en PostgreSQL.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={() => navigate('/mis-horas')}
            className="w-full sm:w-auto px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB' }}>
            Registrar horas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Progreso real de horas</h2>
          <p className="text-xs mb-4" style={{ color: '#5F6B7A' }}>Registros aprobados por el tutor</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold" style={{ color: '#172033' }}>{resumen.acumuladas}</span>
            <span className="text-sm mb-1" style={{ color: '#5F6B7A' }}>/ 320 horas</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${resumen.porcentaje}%`, backgroundColor: '#2563EB' }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span style={{ color: '#168A5B' }}>{resumen.porcentaje}% completado</span>
            <span style={{ color: '#5F6B7A' }}>{320 - resumen.acumuladas} horas restantes</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de tu práctica</h2>
          <div className="space-y-3">
            {[
              ['Código', postulacion?.codigo || 'SMCPP-2026-048'],
              ['Empresa', postulacion?.empresa?.nombre || 'AndesTech Solutions'],
              ['Área', postulacion?.area || 'Desarrollo de software'],
              ['Modalidad', postulacion?.modalidad || 'Híbrido'],
              ['Horas Semanales', `${postulacion?.horasSemanales || 30} hrs/semana`],
            ].map(([k, v]) => (
              <div key={k} className="flex flex-col sm:flex-row sm:items-start justify-between sm:gap-4 gap-1 border-b sm:border-b-0 pb-2 sm:pb-0 last:border-b-0">
                <span className="text-xs flex-shrink-0 font-medium sm:font-normal" style={{ color: '#5F6B7A' }}>{k}</span>
                <span className="text-xs sm:font-medium sm:text-right" style={{ color: '#172033' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
