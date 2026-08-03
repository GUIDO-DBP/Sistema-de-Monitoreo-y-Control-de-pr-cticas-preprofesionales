import { useState } from 'react';
import { Download, FileText, BarChart2, Clock, Star, AlertTriangle, RefreshCw } from 'lucide-react';

const quickReports = [
  { label: 'Estado de postulaciones', icon: FileText, color: '#2563EB' },
  { label: 'Cumplimiento de horas', icon: Clock, color: '#0F9F92' },
  { label: 'Rendimiento por empresa', icon: BarChart2, color: '#B7791F' },
  { label: 'Evaluaciones finales', icon: Star, color: '#168A5B' },
  { label: 'Convenios por vencer', icon: AlertTriangle, color: '#D65A31' },
  { label: 'Casos con incidencias', icon: RefreshCw, color: '#C43D4D' },
];

const metricas = [
  { label: 'Total postulaciones', value: 119, delta: '+12 vs mes anterior' },
  { label: 'Tasa de aprobación', value: '56%', delta: '+4% vs mes anterior' },
  { label: 'Horas registradas', value: '9,840 h', delta: '+486 h esta semana' },
  { label: 'Evaluaciones completas', value: '54/76', delta: '71% completadas' },
];

const barData = [
  { label: 'Ing. Sistemas', aprobadas: 24, pendientes: 10 },
  { label: 'Ing. Industrial', aprobadas: 18, pendientes: 8 },
  { label: 'Administración', aprobadas: 14, pendientes: 9 },
  { label: 'Contabilidad', aprobadas: 10, pendientes: 4 },
];

export default function Reportes() {
  const [activeReport, setActiveReport] = useState('Estado de postulaciones');
  const [periodo, setPeriodo] = useState('2026-I');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Reportes</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Constructor de reportes para análisis del periodo.</p>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '260px 1fr' }}>
        {/* Filter panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#DCE3EA' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Reportes rápidos</h3>
            <div className="space-y-1">
              {quickReports.map(r => (
                <button key={r.label}
                  onClick={() => setActiveReport(r.label)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors"
                  style={{
                    backgroundColor: activeReport === r.label ? '#EFF6FF' : 'transparent',
                    color: activeReport === r.label ? '#2563EB' : '#5F6B7A',
                    fontWeight: activeReport === r.label ? 600 : 400,
                  }}>
                  <r.icon size={14} style={{ color: r.color }} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: '#DCE3EA' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Filtros</h3>
            <div className="space-y-3">
              {[
                { label: 'Periodo académico', options: ['2026-I', '2025-II', '2025-I'] },
                { label: 'Empresa', options: ['Todas', 'AndesTech', 'DataSur'] },
                { label: 'Estado', options: ['Todos', 'Aprobada', 'Pendiente'] },
                { label: 'Escuela profesional', options: ['Todas', 'Ing. Sistemas', 'Administración'] },
                { label: 'Modalidad', options: ['Todas', 'Presencial', 'Híbrido', 'Remoto'] },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>{f.label}</label>
                  <select className="w-full px-3 py-2 text-xs rounded-lg border" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Rango de fechas</label>
                <input type="date" className="w-full px-3 py-2 text-xs rounded-lg border mb-1" style={{ borderColor: '#DCE3EA' }} defaultValue="2026-03-18" />
                <input type="date" className="w-full px-3 py-2 text-xs rounded-lg border" style={{ borderColor: '#DCE3EA' }} defaultValue="2026-07-25" />
              </div>
            </div>
          </div>
        </div>

        {/* Main report */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold" style={{ color: '#172033' }}>{activeReport}</h2>
                <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>Periodo {periodo} · Generado el 22 de julio 2026</p>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  <Download size={13} /> Exportar PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium"
                  style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  <Download size={13} /> Exportar Excel
                </button>
              </div>
            </div>

            {/* Resumen ejecutivo */}
            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F4F7FA' }}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5F6B7A' }}>Resumen ejecutivo</h3>
              <p className="text-sm" style={{ color: '#172033' }}>
                Durante el periodo 2026-I, se registraron 119 postulaciones. El 56% fueron aprobadas, con una tasa de observación del 9%. Las escuelas de Ingeniería de Sistemas y Administración concentran el mayor volumen de postulaciones.
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              {metricas.map(m => (
                <div key={m.label} className="p-4 rounded-xl border" style={{ borderColor: '#DCE3EA' }}>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>{m.label}</div>
                  <div className="text-xl font-bold mt-1" style={{ color: '#172033', fontVariantNumeric: 'tabular-nums' }}>{m.value}</div>
                  <div className="text-xs mt-1" style={{ color: '#168A5B' }}>{m.delta}</div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: '#DCE3EA' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: '#172033' }}>Postulaciones por escuela profesional</h3>
              <div className="space-y-3">
                {barData.map(d => {
                  const total = d.aprobadas + d.pendientes;
                  const max = 36;
                  return (
                    <div key={d.label} className="flex items-center gap-3">
                      <div className="text-xs w-28 flex-shrink-0 text-right" style={{ color: '#5F6B7A' }}>{d.label}</div>
                      <div className="flex-1 h-7 rounded-lg overflow-hidden flex" style={{ backgroundColor: '#F4F7FA' }}>
                        <div className="h-full rounded-l-lg flex items-center px-2" style={{ width: `${(d.aprobadas / max) * 100}%`, backgroundColor: '#168A5B' }}>
                          <span className="text-white text-xs font-medium">{d.aprobadas}</span>
                        </div>
                        <div className="h-full flex items-center px-2" style={{ width: `${(d.pendientes / max) * 100}%`, backgroundColor: '#B7791F' }}>
                          <span className="text-white text-xs font-medium">{d.pendientes}</span>
                        </div>
                      </div>
                      <div className="text-xs w-8 text-right font-semibold" style={{ color: '#172033' }}>{total}</div>
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3">
                {[['#168A5B', 'Aprobadas'], ['#B7791F', 'Pendientes/En revisión']].map(([color, label]) => (
                  <div key={label} className="flex items-center gap-1.5 text-xs" style={{ color: '#5F6B7A' }}>
                    <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusiones */}
            <div className="p-4 rounded-xl" style={{ backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#2563EB' }}>Conclusiones automáticas</h3>
              <ul className="space-y-1">
                {[
                  'La escuela de Ingeniería de Sistemas lidera el volumen de postulaciones con 34 registros.',
                  'El 71% de las evaluaciones están en curso o completadas, por encima del objetivo del 65%.',
                  '2 convenios vencen antes del término del periodo. Se recomienda priorizar su renovación.',
                ].map((c, i) => (
                  <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#172033' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#2563EB' }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
