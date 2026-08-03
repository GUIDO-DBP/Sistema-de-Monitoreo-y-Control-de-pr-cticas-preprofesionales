import { useState } from 'react';
import { Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { registrosHoras } from '../data/mockData';

const totalValidadas = 9840;
const totalPendientes = 2160;
const meta = 15000;

export default function ControlHoras() {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ fecha: '', entrada: '', salida: '', actividad: '', observacion: '' });

  const totalHours = totalValidadas + totalPendientes;
  const pctTotal = Math.round((totalHours / meta) * 100);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{ backgroundColor: '#172033', color: '#FFFFFF' }}>
          <CheckCircle size={15} style={{ color: '#0F9F92' }} /> {toast}
        </div>
      )}

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Control de horas</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Monitorea el cumplimiento y valida los registros enviados.</p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
          Registrar horas
        </button>
      </div>

      {/* Global progress */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Progreso global del periodo</h2>
        <p className="text-xs mb-5" style={{ color: '#5F6B7A' }}>Acumulado del periodo 2026-I</p>
        <div className="grid grid-cols-3 gap-6 mb-5">
          {[
            { label: 'Horas validadas', value: '9,840 h', color: '#168A5B', bg: '#D1FAE5' },
            { label: 'Horas pendientes', value: '2,160 h', color: '#B7791F', bg: '#FEF3C7' },
            { label: 'Meta del periodo', value: '15,000 h', color: '#2563EB', bg: '#EFF6FF' },
          ].map(s => (
            <div key={s.label} className="p-4 rounded-xl" style={{ backgroundColor: s.bg }}>
              <div className="text-xs font-medium mb-1" style={{ color: s.color }}>{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: s.color, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
          <div className="h-full rounded-full flex overflow-hidden">
            <div className="h-full transition-all" style={{ width: `${(totalValidadas / meta) * 100}%`, backgroundColor: '#168A5B' }} />
            <div className="h-full transition-all" style={{ width: `${(totalPendientes / meta) * 100}%`, backgroundColor: '#B7791F' }} />
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs" style={{ color: '#5F6B7A' }}>
          <span>{pctTotal}% de la meta alcanzada</span>
          <span>Faltan {(meta - totalHours).toLocaleString()} horas</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input className="pl-9 pr-4 py-2 text-sm rounded-lg border" style={{ borderColor: '#DCE3EA' }} placeholder="Buscar estudiante…" />
        </div>
        {['Empresa', 'Estado', 'Semana', 'Tutor'].map(f => (
          <select key={f} className="px-3 py-2 rounded-lg border text-sm" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
            <option>{f}</option>
          </select>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F4F7FA' }}>
              {['Estudiante', 'Empresa', 'Semana', 'Horas registradas', 'Horas acumuladas', 'Evidencia', 'Estado', 'Tutor', 'Acción'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {registrosHoras.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar iniciales={r.estudiante.iniciales} color={r.estudiante.color} size="sm" />
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#172033' }}>{r.estudiante.nombre}</div>
                      <div className="text-xs" style={{ color: '#5F6B7A' }}>{r.estudiante.codigo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{r.empresa}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{r.semana}</td>
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold" style={{ color: '#172033', fontVariantNumeric: 'tabular-nums' }}>{r.horasRegistradas} h</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                      <div className="h-full rounded-full" style={{ width: `${(r.horasAcumuladas / 320) * 100}%`, backgroundColor: '#2563EB' }} />
                    </div>
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{r.horasAcumuladas} h</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  {r.evidencia
                    ? <CheckCircle size={15} style={{ color: '#168A5B' }} />
                    : <AlertCircle size={15} style={{ color: '#D65A31' }} />}
                </td>
                <td className="px-4 py-3"><StatusChip estado={r.estado} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{r.tutor || '—'}</td>
                <td className="px-4 py-3">
                  <button onClick={() => showToast('Las horas fueron validadas.')}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg"
                    style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                    Validar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student progress cards */}
      <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Perfil de avance por estudiante</h2>
      <div className="grid grid-cols-2 gap-4">
        {registrosHoras.slice(0, 4).map(r => {
          const pct = Math.round((r.horasAcumuladas / 320) * 100);
          const semXSem = Math.round(r.horasAcumuladas / 6);
          return (
            <div key={r.id} className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
              <div className="flex items-center gap-3 mb-4">
                <Avatar iniciales={r.estudiante.iniciales} color={r.estudiante.color} size="md" />
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#172033' }}>{r.estudiante.nombre}</div>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>{r.empresa}</div>
                </div>
                <StatusChip estado={r.estado} />
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1" style={{ color: '#5F6B7A' }}>
                  <span>{r.horasAcumuladas} h aprobadas</span>
                  <span>{pct}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: r.estado === 'observada' ? '#D65A31' : '#2563EB' }} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Aprobadas', value: `${r.horasAcumuladas} h`, color: '#168A5B' },
                  { label: 'Pendientes', value: '28 h', color: '#B7791F' },
                  { label: 'Prom. semanal', value: `${semXSem} h`, color: '#2563EB' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 rounded-lg" style={{ backgroundColor: '#F4F7FA' }}>
                    <div className="text-xs font-semibold" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-xs" style={{ color: '#5F6B7A' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-xs" style={{ color: '#5F6B7A' }}>
                Proyección de finalización: <span className="font-medium" style={{ color: '#172033' }}>25 jul 2026</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#172033' }}>Registrar horas</h3>
              <button onClick={() => setShowForm(false)} style={{ color: '#5F6B7A' }}>✕</button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Fecha', key: 'fecha', type: 'date' },
                { label: 'Hora de entrada', key: 'entrada', type: 'time' },
                { label: 'Hora de salida', key: 'salida', type: 'time' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>{f.label}</label>
                  <input type={f.type} className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }}
                    value={form[f.key as keyof typeof form]}
                    onChange={e => setForm(v => ({ ...v, [f.key]: e.target.value }))} />
                </div>
              ))}
              {form.entrada && form.salida && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: '#EFF6FF' }}>
                  <Clock size={14} style={{ color: '#2563EB' }} />
                  <span className="text-sm font-medium" style={{ color: '#2563EB' }}>
                    Total: {Math.max(0, (parseInt(form.salida.split(':')[0]) - parseInt(form.entrada.split(':')[0])))} horas aproximadas
                  </span>
                </div>
              )}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Actividad realizada</label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }} placeholder="Describe las actividades realizadas…"
                  value={form.actividad} onChange={e => setForm(v => ({ ...v, actividad: e.target.value }))} />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowForm(false)}
                className="flex-1 py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
              <button onClick={() => { setShowForm(false); showToast('Las horas fueron registradas.'); }}
                className="flex-1 py-2 rounded-lg text-sm font-semibold"
                style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
