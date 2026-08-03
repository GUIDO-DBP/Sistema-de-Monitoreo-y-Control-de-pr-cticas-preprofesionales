import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, AlertTriangle, TrendingUp, Clock, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import { StatusChip, PriorityDot } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { api } from '../services/api';
import type { ResumenReportesBackend, PostulacionBackend, ResumenHorasBackend } from '../types/api';

interface DashboardProps {
  rol: 'coordinador' | 'estudiante';
}

export default function Dashboard({ rol }: DashboardProps) {
  const navigate = useNavigate();

  if (rol === 'estudiante') {
    return <StudentDashboard />;
  }

  return <CoordinatorDashboard navigate={navigate} />;
}

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
        setPostulaciones(postData);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalEstudiantes = resumen?.totalEstudiantes || 1;
  const postulacionesAprobadas = resumen?.postulacionesAprobadas || 0;
  const conveniosActivos = resumen?.conveniosActivos || 0;
  const horasTotales = resumen?.horasTotalesAprobadas || 0;
  const evaluacionesCompletadas = resumen?.evaluacionesCompletadas || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Buenas tardes, Coordinador</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Estado general de las prácticas preprofesionales en PostgreSQL.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/postulaciones/nueva')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ backgroundColor: '#2563EB' }}>
            <Plus size={14} /> Nueva postulación
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Estudiantes Activos', val: totalEstudiantes, sub: 'Registrados en el sistema' },
          { label: 'Convenios Activos', val: conveniosActivos, sub: 'Empresas receptoras' },
          { label: 'Horas Totales Aprobadas', val: `${horasTotales}h`, sub: 'En el periodo actual' },
          { label: 'Evaluaciones Completadas', val: evaluacionesCompletadas, sub: 'Fichas evaluadas' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl border bg-white space-y-1" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-xs font-medium" style={{ color: '#5F6B7A' }}>{kpi.label}</div>
            <div className="text-2xl font-bold" style={{ color: '#172033' }}>{kpi.val}</div>
            <div className="text-xs" style={{ color: '#168A5B' }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Casos que necesitan seguimiento */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#EDF2F7' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Casos de postulación en tiempo real</h2>
            <p className="text-xs" style={{ color: '#5F6B7A' }}>Registros recuperados directamente desde PostgreSQL</p>
          </div>
          <button onClick={() => navigate('/postulaciones')}
            className="flex items-center gap-1 text-sm font-medium" style={{ color: '#2563EB' }}>
            Ver todas <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: '#5F6B7A' }}>Cargando datos del dashboard…</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Código / Estudiante', 'Empresa', 'Horas Semanales', 'Estado', 'Responsable', 'Acción'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {postulaciones.slice(0, 5).map(p => {
                const estNombre = p.estudiante?.usuario?.nombre || 'Estudiante';
                const appEstado = p.estado === 'APROBADA' ? 'aprobada' : p.estado === 'EN_REVISION' ? 'en_revision' : p.estado === 'OBSERVADA' ? 'observada' : 'pendiente';

                return (
                  <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: '#172033' }}>{estNombre}</div>
                      <div className="text-xs font-mono" style={{ color: '#5F6B7A' }}>{p.codigo}</div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium" style={{ color: '#5F6B7A' }}>{p.empresa?.nombre || '—'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#172033' }}>{p.horasSemanales} hrs/sem</td>
                    <td className="px-4 py-3"><StatusChip estado={appEstado} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{p.responsable?.nombre || 'Coord. Carlos Ramos'}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate('/postulaciones')}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors text-blue-600 bg-blue-50">
                        Revisar
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

  const resumen = horasData?.resumen || { acumuladas: 186, meta: 320, porcentaje: 58 };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Hola, Ana</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Tu práctica se encuentra registrada en PostgreSQL.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/mis-horas')}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB' }}>
            Registrar horas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Progreso de horas */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
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

        {/* Datos empresa */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de tu práctica</h2>
          <div className="space-y-3">
            {[
              ['Código', postulacion?.codigo || 'SMCPP-2026-048'],
              ['Empresa', postulacion?.empresa?.nombre || 'AndesTech Solutions'],
              ['Área', postulacion?.area || 'Desarrollo de software'],
              ['Modalidad', postulacion?.modalidad || 'Híbrido'],
              ['Horas Semanales', `${postulacion?.horasSemanales || 30} hrs/semana`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4">
                <span className="text-xs flex-shrink-0" style={{ color: '#5F6B7A' }}>{k}</span>
                <span className="text-xs font-medium text-right" style={{ color: '#172033' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
