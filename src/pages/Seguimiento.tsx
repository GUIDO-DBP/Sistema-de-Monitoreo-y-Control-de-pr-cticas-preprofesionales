import { useState } from 'react';
import { Search, Navigation, TrendingUp, TrendingDown, Minus, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { postulaciones, registrosHoras, evaluaciones } from '../data/mockData';
import { Avatar } from '../components/Avatar';

type Riesgo = 'bajo' | 'medio' | 'alto';

function calcularRiesgo(postulacion: typeof postulaciones[0]): Riesgo {
  const horas = registrosHoras.find(r => r.estudiante.id === postulacion.estudiante.id);
  const eval_ = evaluaciones.find(e => e.estudiante.id === postulacion.estudiante.id);
  let score = 0;
  if (postulacion.estado === 'observada') score += 2;
  if (postulacion.progresoDocs < postulacion.totalDocs) score += 1;
  if (horas?.estado === 'observada') score += 1;
  if (eval_?.estado === 'pendiente' || eval_?.estado === 'vencida') score += 2;
  if (score >= 4) return 'alto';
  if (score >= 2) return 'medio';
  return 'bajo';
}

const riesgoConfig: Record<Riesgo, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  bajo: { label: 'Sin riesgo', icon: <TrendingUp size={13} />, bg: '#D1FAE5', text: '#168A5B', border: '#A7F3D0' },
  medio: { label: 'Riesgo medio', icon: <Minus size={13} />, bg: '#FEF3C7', text: '#B7791F', border: '#FDE68A' },
  alto: { label: 'Riesgo alto', icon: <TrendingDown size={13} />, bg: '#FEE2E2', text: '#C43D4D', border: '#FECACA' },
};

export default function Seguimiento() {
  const [query, setQuery] = useState('');
  const [riesgoFilter, setRiesgoFilter] = useState<'todos' | Riesgo>('todos');
  const [selected, setSelected] = useState<string | null>(null);

  const activos = postulaciones.filter(p => p.estado !== 'rechazada' && p.estado !== 'pendiente');

  const rows = activos.map(p => ({
    postulacion: p,
    horas: registrosHoras.find(r => r.estudiante.id === p.estudiante.id),
    eval_: evaluaciones.find(e => e.estudiante.id === p.estudiante.id),
    riesgo: calcularRiesgo(p),
  }));

  const filtered = rows.filter(r => {
    const matchQ = r.postulacion.estudiante.nombre.toLowerCase().includes(query.toLowerCase()) ||
      r.postulacion.empresa.toLowerCase().includes(query.toLowerCase());
    const matchR = riesgoFilter === 'todos' || r.riesgo === riesgoFilter;
    return matchQ && matchR;
  });

  const selRow = rows.find(r => r.postulacion.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Seguimiento</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Monitoreo del avance de estudiantes en prácticas activas.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'En seguimiento', value: activos.length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Sin riesgo', value: rows.filter(r => r.riesgo === 'bajo').length, color: '#168A5B', bg: '#D1FAE5' },
          { label: 'Riesgo medio', value: rows.filter(r => r.riesgo === 'medio').length, color: '#B7791F', bg: '#FEF3C7' },
          { label: 'Riesgo alto', value: rows.filter(r => r.riesgo === 'alto').length, color: '#C43D4D', bg: '#FEE2E2' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#5F6B7A' }}>{s.label}</div>
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
            placeholder="Buscar por estudiante o empresa…" />
        </div>
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {(['todos', 'bajo', 'medio', 'alto'] as const).map(r => (
            <button key={r} onClick={() => setRiesgoFilter(r)}
              className="px-3 py-2 text-sm font-medium transition-colors capitalize"
              style={{ backgroundColor: riesgoFilter === r ? '#152A43' : '#FFFFFF', color: riesgoFilter === r ? '#FFFFFF' : '#5F6B7A' }}>
              {r === 'todos' ? 'Todos' : riesgoConfig[r].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: selected ? '1fr 0.42fr' : '1fr' }}>
        {/* Table */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center">
              <Navigation size={40} style={{ color: '#DCE3EA', marginBottom: 12 }} />
              <p className="text-sm font-medium" style={{ color: '#172033' }}>Sin estudiantes en este filtro</p>
              <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>Ajusta el criterio de búsqueda o nivel de riesgo.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F4F7FA' }}>
                  {['Estudiante', 'Empresa / Área', 'Etapa', 'Horas acum.', 'Docs', 'Evaluación', 'Riesgo'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ postulacion: p, horas, eval_: ev, riesgo }) => {
                  const rCfg = riesgoConfig[riesgo];
                  const etapas = ['Solicitud', 'Revisión', 'Convenio', 'Activo', 'Evaluación'];
                  return (
                    <tr key={p.id}
                      onClick={() => setSelected(p.id === selected ? null : p.id)}
                      className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                      style={{ borderColor: '#EDF2F7', backgroundColor: selected === p.id ? '#EFF6FF' : undefined }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Avatar iniciales={p.estudiante.iniciales} color={p.estudiante.color} size="sm" />
                          <div>
                            <div className="text-sm font-medium" style={{ color: '#172033' }}>{p.estudiante.nombre}</div>
                            <div className="text-xs" style={{ color: '#5F6B7A' }}>{p.estudiante.escuela}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: '#172033' }}>{p.empresa}</div>
                        <div className="text-xs" style={{ color: '#5F6B7A' }}>{p.area}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: '#172033' }}>{etapas[p.etapa - 1] ?? `Etapa ${p.etapa}`}</div>
                        <div className="w-20 h-1.5 rounded-full mt-1" style={{ backgroundColor: '#EDF2F7' }}>
                          <div className="h-full rounded-full" style={{ width: `${(p.etapa / 5) * 100}%`, backgroundColor: '#2563EB' }} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-semibold" style={{ color: '#172033' }}>{horas?.horasAcumuladas ?? 0}</div>
                        <div className="text-xs" style={{ color: '#5F6B7A' }}>sem: {horas?.semana ?? '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs">
                          <span className="font-semibold" style={{ color: '#172033' }}>{p.progresoDocs}</span>
                          <span style={{ color: '#5F6B7A' }}>/{p.totalDocs}</span>
                        </div>
                        <div className="w-12 h-1 rounded-full mt-1" style={{ backgroundColor: '#EDF2F7' }}>
                          <div className="h-full rounded-full" style={{ width: `${(p.progresoDocs / p.totalDocs) * 100}%`, backgroundColor: p.progresoDocs === p.totalDocs ? '#168A5B' : '#B7791F' }} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {ev ? (
                          <div className="flex items-center gap-1 text-xs">
                            {ev.estado === 'completada' ? <CheckCircle size={12} style={{ color: '#168A5B' }} /> :
                              ev.estado === 'vencida' ? <AlertCircle size={12} style={{ color: '#C43D4D' }} /> :
                                <Clock size={12} style={{ color: '#B7791F' }} />}
                            <span style={{ color: '#172033' }}>{ev.avance}%</span>
                          </div>
                        ) : <span className="text-xs" style={{ color: '#5F6B7A' }}>—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: rCfg.bg, color: rCfg.text, border: `1px solid ${rCfg.border}` }}>
                          {rCfg.icon}{rCfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail */}
        {selRow && (
          <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center gap-3">
              <Avatar iniciales={selRow.postulacion.estudiante.iniciales} color={selRow.postulacion.estudiante.color} size="lg" />
              <div>
                <div className="font-semibold" style={{ color: '#172033' }}>{selRow.postulacion.estudiante.nombre}</div>
                <div className="text-xs" style={{ color: '#5F6B7A' }}>{selRow.postulacion.estudiante.codigo}</div>
              </div>
            </div>

            {/* Progress bars */}
            <div className="space-y-3">
              {[
                { label: 'Avance de etapas', value: (selRow.postulacion.etapa / 5) * 100, color: '#2563EB' },
                { label: 'Documentación', value: (selRow.postulacion.progresoDocs / selRow.postulacion.totalDocs) * 100, color: '#0F9F92' },
                { label: 'Evaluación', value: selRow.eval_?.avance ?? 0, color: '#168A5B' },
              ].map(bar => (
                <div key={bar.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#5F6B7A' }}>{bar.label}</span>
                    <span className="font-medium" style={{ color: '#172033' }}>{Math.round(bar.value)}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ backgroundColor: '#EDF2F7' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${bar.value}%`, backgroundColor: bar.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3" style={{ borderColor: '#EDF2F7' }}>
              <div className="space-y-1.5">
                {[
                  ['Empresa', selRow.postulacion.empresa],
                  ['Área', selRow.postulacion.area],
                  ['Tutor', selRow.postulacion.tutor || 'No asignado'],
                  ['Modalidad', selRow.postulacion.modalidad],
                  ['Horas acumuladas', selRow.horas?.horasAcumuladas ?? 0],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between">
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{k}</span>
                    <span className="text-xs font-medium" style={{ color: '#172033' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl" style={{
              backgroundColor: riesgoConfig[selRow.riesgo].bg,
              border: `1px solid ${riesgoConfig[selRow.riesgo].border}`,
            }}>
              <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: riesgoConfig[selRow.riesgo].text }}>
                {riesgoConfig[selRow.riesgo].icon}
                {riesgoConfig[selRow.riesgo].label}
              </div>
            </div>

            <button className="w-full py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
              Ver expediente completo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
