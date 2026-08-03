import { useState } from 'react';
import { List, LayoutGrid, Calendar, Filter } from 'lucide-react';
import { StatusChip, PriorityDot } from '../components/StatusChip';
import { tareasBandeja } from '../data/mockData';
import type { TareasBandeja } from '../data/mockData';

const estadoColors: Record<string, { bg: string; label: string }> = {
  pendiente: { bg: '#FEF3C7', label: 'Pendiente' },
  en_revision: { bg: '#DBEAFE', label: 'En revisión' },
  esperando: { bg: '#EDE9FE', label: 'Esperando respuesta' },
  resuelto: { bg: '#D1FAE5', label: 'Resuelto' },
};

function TaskCard({ t, compact }: { t: TareasBandeja; compact?: boolean }) {
  return (
    <div className={`bg-white border rounded-xl p-4 ${compact ? '' : 'hover:shadow-sm'} transition-all`} style={{ borderColor: '#DCE3EA' }}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium mr-2"
            style={{ backgroundColor: '#EDF2F7', color: '#5F6B7A' }}>{t.tipo}</span>
          <span className="text-sm font-medium" style={{ color: '#172033' }}>{t.titulo}</span>
        </div>
        <PriorityDot prioridad={t.prioridad} />
      </div>
      <p className="text-xs mb-3" style={{ color: '#5F6B7A' }}>{t.descripcion}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {t.estudiante && <span className="text-xs" style={{ color: '#5F6B7A' }}>👤 {t.estudiante.split(' ').slice(0, 2).join(' ')}</span>}
          {t.convenio && <span className="text-xs" style={{ color: '#5F6B7A' }}>📄 {t.convenio}</span>}
          <span className="text-xs" style={{ color: '#5F6B7A' }}>📅 {t.fechaLimite}</span>
        </div>
        <button className="text-xs font-medium px-3 py-1.5 rounded-lg" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
          Atender
        </button>
      </div>
      {t.responsable && (
        <div className="mt-2 text-xs" style={{ color: '#5F6B7A' }}>
          Responsable: <span style={{ color: '#172033' }}>{t.responsable}</span>
        </div>
      )}
    </div>
  );
}

export default function Bandeja() {
  const [view, setView] = useState<'lista' | 'kanban' | 'calendario'>('lista');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const stats = [
    { label: 'Todo', count: tareasBandeja.length, filter: 'todos' },
    { label: 'Alta prioridad', count: tareasBandeja.filter(t => t.prioridad === 'alta').length, filter: 'alta' },
    { label: 'Por vencer', count: 9, filter: 'por_vencer' },
    { label: 'Sin responsable', count: tareasBandeja.filter(t => !t.responsable).length, filter: 'sin_resp' },
  ];

  const filtered = filtroEstado === 'todos' ? tareasBandeja
    : filtroEstado === 'alta' ? tareasBandeja.filter(t => t.prioridad === 'alta')
    : filtroEstado === 'sin_resp' ? tareasBandeja.filter(t => !t.responsable)
    : tareasBandeja;

  const kanbanCols = ['pendiente', 'en_revision', 'esperando', 'resuelto'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Bandeja de trabajo</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Prioriza revisiones, observaciones y vencimientos desde un solo lugar.</p>
      </div>

      {/* Stats */}
      <div className="flex gap-3 flex-wrap">
        {stats.map(s => (
          <button
            key={s.filter}
            onClick={() => setFiltroEstado(s.filter)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
            style={{
              backgroundColor: filtroEstado === s.filter ? '#152A43' : '#FFFFFF',
              color: filtroEstado === s.filter ? '#FFFFFF' : '#172033',
              borderColor: filtroEstado === s.filter ? '#152A43' : '#DCE3EA',
            }}
          >
            {s.label}
            <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: filtroEstado === s.filter ? 'rgba(255,255,255,0.2)' : '#EDF2F7', color: filtroEstado === s.filter ? '#FFFFFF' : '#5F6B7A' }}>
              {s.count}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium"
            style={{ borderColor: '#DCE3EA', color: '#5F6B7A', backgroundColor: '#FFFFFF' }}>
            <Filter size={13} /> Filtros
          </button>
          <select className="px-3 py-2 rounded-lg border text-xs" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
            <option>Tipo de tarea</option>
            <option>Documento</option>
            <option>Horas</option>
            <option>Convenio</option>
            <option>Evaluación</option>
          </select>
          <select className="px-3 py-2 rounded-lg border text-xs" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
            <option>Prioridad</option>
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {[
            { v: 'lista', icon: <List size={14} />, label: 'Lista' },
            { v: 'kanban', icon: <LayoutGrid size={14} />, label: 'Kanban' },
            { v: 'calendario', icon: <Calendar size={14} />, label: 'Calendario' },
          ].map(({ v, icon, label }) => (
            <button
              key={v}
              onClick={() => setView(v as 'lista' | 'kanban' | 'calendario')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors"
              style={{
                backgroundColor: view === v ? '#152A43' : '#FFFFFF',
                color: view === v ? '#FFFFFF' : '#5F6B7A',
              }}
            >
              {icon} {label}
            </button>
          ))}
        </div>
      </div>

      {/* Vista Lista */}
      {view === 'lista' && (
        <div className="space-y-3">
          {filtered.map(t => <TaskCard key={t.id} t={t} />)}
        </div>
      )}

      {/* Vista Kanban */}
      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {kanbanCols.map(col => {
            const colTasks = tareasBandeja.filter(t => t.estado === col);
            const { bg, label } = estadoColors[col];
            return (
              <div key={col}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col === 'pendiente' ? '#B7791F' : col === 'en_revision' ? '#2563EB' : col === 'esperando' ? '#7A3DB8' : '#168A5B' }} />
                  <span className="text-sm font-semibold" style={{ color: '#172033' }}>{label}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: '#EDF2F7', color: '#5F6B7A' }}>{colTasks.length}</span>
                </div>
                <div className="space-y-3 p-3 rounded-2xl min-h-48" style={{ backgroundColor: bg + '60' }}>
                  {colTasks.map(t => <TaskCard key={t.id} t={t} compact />)}
                  {colTasks.length === 0 && (
                    <div className="text-center py-8 text-xs" style={{ color: '#5F6B7A' }}>Sin tareas</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista Calendario (simplificada) */}
      {view === 'calendario' && (
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
              <div key={d} className="text-center text-xs font-semibold py-2" style={{ color: '#5F6B7A' }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }, (_, i) => {
              const day = i - 1;
              const isToday = day === 21;
              const hasTasks = [22, 23, 24, 25, 26].includes(day);
              return (
                <div key={i} className={`min-h-16 p-1.5 rounded-lg border transition-colors ${isToday ? 'border-blue-400' : ''}`}
                  style={{ borderColor: isToday ? '#2563EB' : '#EDF2F7', backgroundColor: isToday ? '#EFF6FF' : '#FAFAFA' }}>
                  {day > 0 && day <= 31 && (
                    <>
                      <div className="text-xs font-medium mb-1" style={{ color: isToday ? '#2563EB' : '#172033' }}>{day}</div>
                      {hasTasks && tareasBandeja.filter(t => t.fechaLimite.endsWith(`-${String(day).padStart(2, '0')}`)).map(t => (
                        <div key={t.id} className="text-xs truncate px-1 py-0.5 rounded mb-0.5"
                          style={{ backgroundColor: t.prioridad === 'alta' ? '#FEE2E2' : '#EFF6FF', color: t.prioridad === 'alta' ? '#C43D4D' : '#2563EB', fontSize: 10 }}>
                          {t.titulo.slice(0, 18)}…
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
