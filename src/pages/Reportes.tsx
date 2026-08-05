import { useState, useEffect, useCallback } from 'react';
import { Download, AlertCircle, RefreshCw, BarChart2, CheckCircle2, Building2, Users } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { ResumenReportesBackend, ConvenioBackend } from '../types/api';

export default function Reportes() {
  const [resumen, setResumen] = useState<ResumenReportesBackend | null>(null);
  const [convenios, setConvenios] = useState<ConvenioBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchReportes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [resData, convData] = await Promise.all([
        api.get<ResumenReportesBackend>('/reportes/resumen'),
        api.get<ConvenioBackend[]>('/reportes/convenios'),
      ]);
      setResumen(resData);
      setConvenios(convData);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al obtener reporte estadístico.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportes();
  }, [fetchReportes]);

  const handleExportCSV = () => {
    if (!resumen) return;
    const csvRows = [
      ['Métrica', 'Valor'],
      ['Total Estudiantes', resumen.totalEstudiantes],
      ['Empresas Registradas', resumen.totalEmpresas],
      ['Convenios Activos', resumen.conveniosActivos],
      ['Convenios por Vencer', resumen.conveniosPorVencer],
      ['Postulaciones Aprobadas', resumen.postulacionesAprobadas],
      ['Postulaciones Pendientes', resumen.postulacionesPendientes],
      ['Horas Totales Aprobadas', resumen.horasTotalesAprobadas],
      ['Promedio General Evaluaciones', resumen.promedioEvaluaciones],
      ['Evaluaciones Completadas', resumen.evaluacionesCompletadas],
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_smcpp_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
        Generando indicadores ejecutivos desde PostgreSQL…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Reportes e Indicadores de Gestión</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Consolidado estadístico del programa de prácticas preprofesionales.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg border text-sm font-medium hover:bg-gray-50 transition-colors"
          style={{ borderColor: '#DCE3EA', color: '#172033', backgroundColor: '#FFFFFF' }}
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchReportes} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Total Estudiantes', val: resumen?.totalEstudiantes || 0, icon: Users, color: '#2563EB' },
          { label: 'Convenios Activos', val: resumen?.conveniosActivos || 0, icon: Building2, color: '#168A5B' },
          { label: 'Horas Aprobadas', val: `${resumen?.horasTotalesAprobadas || 0}h`, icon: CheckCircle2, color: '#0F9F92' },
          { label: 'Promedio Evaluación', val: `${resumen?.promedioEvaluaciones || 0} / 5.0`, icon: BarChart2, color: '#B7791F' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-4 sm:p-5 rounded-2xl border space-y-2" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium" style={{ color: '#5F6B7A' }}>{kpi.label}</span>
              <kpi.icon size={18} style={{ color: kpi.color }} />
            </div>
            <div className="text-2xl font-bold" style={{ color: '#172033' }}>{kpi.val}</div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border space-y-4" style={{ borderColor: '#DCE3EA' }}>
          <h3 className="font-semibold text-base" style={{ color: '#172033' }}>Resumen de Postulaciones</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: '#5F6B7A' }}>Postulaciones Aprobadas</span>
              <span className="font-semibold text-green-600">{resumen?.postulacionesAprobadas || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: '#5F6B7A' }}>Postulaciones Pendientes</span>
              <span className="font-semibold text-blue-600">{resumen?.postulacionesPendientes || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border space-y-4" style={{ borderColor: '#DCE3EA' }}>
          <h3 className="font-semibold text-base" style={{ color: '#172033' }}>Estado de Convenios Institucionales</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: '#5F6B7A' }}>Convenios Activos</span>
              <span className="font-semibold text-green-600">{resumen?.conveniosActivos || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span style={{ color: '#5F6B7A' }}>Convenios por Vencer (Próximos 30 días)</span>
              <span className="font-semibold text-amber-600">{resumen?.conveniosPorVencer || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Convenios */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="p-4 border-b font-semibold text-sm" style={{ borderColor: '#EDF2F7', color: '#172033' }}>
          Detalle de Convenios Institucionales Vigentes
        </div>
        
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Código', 'Empresa', 'Rubro', 'Vencimiento', 'Vacantes Totales', 'Estudiantes Activos'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {convenios.map(c => (
                <tr key={c.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                  <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: '#5F6B7A' }}>{c.codigo}</td>
                  <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: '#172033' }}>{c.empresa?.nombre || '—'}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{c.rubro}</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{new Date(c.vencimiento).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: '#172033' }}>{c.vacantes}</td>
                  <td className="px-4 py-3 text-xs font-bold text-blue-600 whitespace-nowrap">{c.estudiantesActivos}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
          {convenios.map(c => (
            <div key={c.id} className="p-4 space-y-3">
              <div>
                <div className="text-sm font-medium" style={{ color: '#172033' }}>{c.empresa?.nombre || '—'}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: '#5F6B7A' }}>{c.codigo}</div>
              </div>
              
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span style={{ color: '#5F6B7A' }}>Rubro:</span>
                  <span style={{ color: '#172033' }}>{c.rubro}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5F6B7A' }}>Vencimiento:</span>
                  <span style={{ color: '#172033' }}>{new Date(c.vencimiento).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5F6B7A' }}>Vacantes Totales:</span>
                  <span className="font-bold" style={{ color: '#172033' }}>{c.vacantes}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#5F6B7A' }}>Estudiantes Activos:</span>
                  <span className="font-bold text-blue-600">{c.estudiantesActivos}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
