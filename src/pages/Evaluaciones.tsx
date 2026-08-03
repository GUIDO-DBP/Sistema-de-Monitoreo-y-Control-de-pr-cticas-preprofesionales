import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { evaluaciones } from '../data/mockData';

const categorias = [
  {
    nombre: 'A. Desempeño profesional',
    criterios: ['Calidad del trabajo', 'Cumplimiento de tareas', 'Capacidad técnica'],
  },
  {
    nombre: 'B. Habilidades interpersonales',
    criterios: ['Comunicación', 'Trabajo en equipo', 'Adaptabilidad'],
  },
  {
    nombre: 'C. Responsabilidad',
    criterios: ['Puntualidad', 'Iniciativa', 'Ética profesional'],
  },
];

const escala = [
  { valor: 1, label: 'Deficiente' },
  { valor: 2, label: 'En desarrollo' },
  { valor: 3, label: 'Adecuado' },
  { valor: 4, label: 'Destacado' },
  { valor: 5, label: 'Excelente' },
];

const stats = [
  { label: 'Pendientes', count: 18, color: '#B7791F', bg: '#FEF3C7' },
  { label: 'En proceso', count: 9, color: '#2563EB', bg: '#DBEAFE' },
  { label: 'Completadas', count: 54, color: '#168A5B', bg: '#D1FAE5' },
  { label: 'Vencidas', count: 4, color: '#C43D4D', bg: '#FEE2E2' },
];

export default function Evaluaciones() {
  const [evalSelected, setEvalSelected] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comentario, setComentario] = useState('');
  const [fortalezas, setFortalezas] = useState('');
  const [mejoras, setMejoras] = useState('');
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const evalActiva = evaluaciones.find(e => e.id === evalSelected);

  const allCriterios = categorias.flatMap(c => c.criterios);
  const avgScore = allCriterios.length > 0
    ? (Object.values(scores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(scores).length, 1)).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{ backgroundColor: '#172033', color: '#FFFFFF' }}>
          <CheckCircle size={15} style={{ color: '#0F9F92' }} /> {toast}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Evaluaciones de desempeño</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestiona las evaluaciones remitidas por los tutores empresariales.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="p-4 rounded-2xl border" style={{ backgroundColor: s.bg, borderColor: s.bg }}>
            <div className="text-2xl font-bold" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.count}</div>
            <div className="text-xs font-medium mt-0.5" style={{ color: s.color }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: evalSelected ? '1fr 1.2fr' : '1fr' }}>
        {/* Table */}
        <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Estudiante', 'Empresa', 'Tutor', 'Fecha límite', 'Avance', 'Resultado', 'Estado', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evaluaciones.map(ev => (
                <tr key={ev.id}
                  onClick={() => setEvalSelected(ev.id === evalSelected ? null : ev.id)}
                  className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: '#EDF2F7', backgroundColor: evalSelected === ev.id ? '#EFF6FF' : undefined }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar iniciales={ev.estudiante.iniciales} color={ev.estudiante.color} size="sm" />
                      <span className="text-sm font-medium" style={{ color: '#172033' }}>{ev.estudiante.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{ev.empresa}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{ev.tutor || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{ev.fechaLimite}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                        <div className="h-full rounded-full" style={{ width: `${ev.avance}%`, backgroundColor: '#2563EB' }} />
                      </div>
                      <span className="text-xs" style={{ color: '#5F6B7A' }}>{ev.avance}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: ev.resultado ? '#168A5B' : '#5F6B7A' }}>
                    {ev.resultado ? `${ev.resultado}/5.0` : '—'}
                  </td>
                  <td className="px-4 py-3"><StatusChip estado={ev.estado} /></td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                      {ev.estado === 'completada' ? 'Ver' : 'Evaluar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Evaluation form */}
        {evalActiva && (
          <div className="bg-white rounded-2xl border overflow-y-auto" style={{ borderColor: '#DCE3EA', maxHeight: 600 }}>
            <div className="p-5 border-b" style={{ borderColor: '#EDF2F7' }}>
              <div className="flex items-center gap-3">
                <Avatar iniciales={evalActiva.estudiante.iniciales} color={evalActiva.estudiante.color} size="md" />
                <div>
                  <div className="font-semibold text-sm" style={{ color: '#172033' }}>{evalActiva.estudiante.nombre}</div>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>{evalActiva.empresa}</div>
                </div>
                <div className="ml-auto text-center px-3 py-1.5 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                  <div className="text-lg font-bold" style={{ color: '#172033' }}>{avgScore}</div>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>Promedio</div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">
              {categorias.map(cat => (
                <div key={cat.nombre}>
                  <h3 className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: '#5F6B7A' }}>{cat.nombre}</h3>
                  <div className="space-y-3">
                    {cat.criterios.map(cr => (
                      <div key={cr}>
                        <div className="text-sm mb-2" style={{ color: '#172033' }}>{cr}</div>
                        <div className="flex gap-2">
                          {escala.map(e => (
                            <button
                              key={e.valor}
                              onClick={() => setScores(s => ({ ...s, [cr]: e.valor }))}
                              className="flex-1 py-2 rounded-lg text-xs font-medium border transition-all"
                              style={{
                                backgroundColor: scores[cr] === e.valor ? '#2563EB' : '#F4F7FA',
                                color: scores[cr] === e.valor ? '#FFFFFF' : '#5F6B7A',
                                borderColor: scores[cr] === e.valor ? '#2563EB' : '#EDF2F7',
                              }}
                            >
                              <div className="font-bold">{e.valor}</div>
                              <div style={{ fontSize: 10, opacity: 0.85 }}>{e.label}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {[
                { label: 'Fortalezas identificadas', val: fortalezas, set: setFortalezas, ph: 'Aspectos destacados del desempeño…' },
                { label: 'Aspectos por mejorar', val: mejoras, set: setMejoras, ph: 'Áreas de mejora sugeridas…' },
                { label: 'Comentarios del tutor', val: comentario, set: setComentario, ph: 'Observaciones generales…' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: '#172033' }}>{f.label}</label>
                  <textarea rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                    style={{ borderColor: '#DCE3EA' }} placeholder={f.ph}
                    value={f.val} onChange={e => f.set(e.target.value)} />
                </div>
              ))}

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 rounded-lg border text-sm font-medium"
                  style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  Guardar borrador
                </button>
                <button onClick={() => { showToast('Evaluación enviada correctamente.'); setEvalSelected(null); }}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                  Enviar evaluación
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
