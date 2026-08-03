import { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';

const registros = [
  { semana: '14–20 jul 2026', horas: 30, estado: 'aprobada', tutor: 'Ing. Carlos Medina', actividad: 'Desarrollo de módulo de autenticación y pruebas unitarias.' },
  { semana: '7–13 jul 2026', horas: 28, estado: 'aprobada', tutor: 'Ing. Carlos Medina', actividad: 'Revisión de requerimientos y diseño de base de datos.' },
  { semana: '30 jun–6 jul 2026', horas: 30, estado: 'aprobada', tutor: 'Ing. Carlos Medina', actividad: 'Implementación de API REST para el módulo de reportes.' },
  { semana: '23–29 jun 2026', horas: 25, estado: 'observada', tutor: 'Ing. Carlos Medina', actividad: 'Configuración del entorno de desarrollo.' },
  { semana: '16–22 jun 2026', horas: 30, estado: 'aprobada', tutor: 'Ing. Carlos Medina', actividad: 'Integración con servicio de notificaciones.' },
  { semana: '21–27 jul 2026', horas: 0, estado: 'pendiente', tutor: '', actividad: '' },
];

const horasAprobadas = 186;
const horasPendientes = 28;
const horasObservadas = 25;
const totalMeta = 320;

export default function MisHoras() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fecha: '', entrada: '', salida: '', actividad: '', pausa: '0' });
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const pct = Math.round((horasAprobadas / totalMeta) * 100);
  const horasTotales = form.entrada && form.salida
    ? Math.max(0, (parseInt(form.salida.split(':')[0]) * 60 + parseInt(form.salida.split(':')[1] || '0'))
      - (parseInt(form.entrada.split(':')[0]) * 60 + parseInt(form.entrada.split(':')[1] || '0'))
      - parseInt(form.pausa)) / 60
    : 0;

  return (
    <div className="max-w-4xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white flex items-center gap-2"
          style={{ backgroundColor: '#172033' }}>
          <CheckCircle size={15} style={{ color: '#0F9F92' }} /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mis horas</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Registro y seguimiento de tus horas de práctica.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
          <Clock size={14} /> Registrar horas
        </button>
      </div>

      {/* Summary */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-4xl font-bold" style={{ color: '#172033', fontVariantNumeric: 'tabular-nums' }}>{horasAprobadas}</span>
          <span className="text-lg mb-1" style={{ color: '#5F6B7A' }}>/ {totalMeta} horas</span>
          <span className="ml-auto text-sm font-semibold" style={{ color: '#168A5B' }}>{pct}% completado</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden mb-4" style={{ backgroundColor: '#EDF2F7' }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: '#2563EB' }} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Aprobadas', value: `${horasAprobadas} h`, color: '#168A5B', bg: '#D1FAE5' },
            { label: 'Pendientes', value: `${horasPendientes} h`, color: '#B7791F', bg: '#FEF3C7' },
            { label: 'Observadas', value: `${horasObservadas} h`, color: '#D65A31', bg: '#FEE9E0' },
            { label: 'Restantes', value: `${totalMeta - horasAprobadas} h`, color: '#5F6B7A', bg: '#EDF2F7' },
          ].map(s => (
            <div key={s.label} className="p-3 rounded-xl text-center" style={{ backgroundColor: s.bg }}>
              <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: s.color }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
          <strong>Proyección:</strong> A este ritmo, completarás las 320 horas el <strong>25 de julio de 2026</strong>.
          Promedio semanal: <strong>28 h</strong>.
        </div>
      </div>

      {/* Weekly records */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: '#EDF2F7' }}>
          <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Registros semanales</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F4F7FA' }}>
              {['Semana', 'Horas', 'Actividad', 'Tutor', 'Estado', 'Evidencia'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registros.map((r, i) => (
              <tr key={i} className="border-t" style={{ borderColor: '#EDF2F7' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: '#172033' }}>{r.semana}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold" style={{ color: r.horas > 0 ? '#172033' : '#5F6B7A', fontVariantNumeric: 'tabular-nums' }}>
                    {r.horas > 0 ? `${r.horas} h` : '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: '#5F6B7A' }}>
                  {r.actividad || 'Pendiente de registro'}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{r.tutor || '—'}</td>
                <td className="px-4 py-3"><StatusChip estado={r.estado as any} /></td>
                <td className="px-4 py-3">
                  {r.estado !== 'pendiente' ? (
                    <CheckCircle size={14} style={{ color: '#168A5B' }} />
                  ) : (
                    <label className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg cursor-pointer"
                      style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                      <Upload size={11} /> Subir
                      <input type="file" className="hidden" onChange={() => showToast('Evidencia subida correctamente.')} />
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Register form modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#172033' }}>Registrar horas</h3>
              <button onClick={() => setShowForm(false)} style={{ color: '#5F6B7A' }}>✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Fecha</label>
                <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.fecha} onChange={e => setForm(v => ({ ...v, fecha: e.target.value }))} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Hora de entrada', key: 'entrada' },
                  { label: 'Hora de salida', key: 'salida' },
                  { label: 'Pausa (min)', key: 'pausa' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>{f.label}</label>
                    <input type={f.key === 'pausa' ? 'number' : 'time'} min={0}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }}
                      value={form[f.key as keyof typeof form]}
                      onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                  </div>
                ))}
              </div>
              {horasTotales > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                  <Clock size={14} style={{ color: '#2563EB' }} />
                  <span className="text-sm font-medium" style={{ color: '#2563EB' }}>
                    Total calculado: {horasTotales.toFixed(1)} horas
                  </span>
                  {horasTotales > 12 && (
                    <span className="text-xs ml-auto" style={{ color: '#C43D4D' }}>⚠ Más de 12 horas</span>
                  )}
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Actividad realizada</label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }} placeholder="Describe brevemente las actividades…"
                  value={form.actividad} onChange={e => setForm(v => ({ ...v, actividad: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
              <button onClick={() => { setShowForm(false); showToast('Horas registradas correctamente. Pendiente de validación.'); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
