import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Plus, AlertTriangle, ArrowRight, TrendingUp, Clock, FileText, CheckCircle, ChevronRight } from 'lucide-react';
import { StatusChip, PriorityDot } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { postulaciones, actividadReciente, estudiantes } from '../data/mockData';

interface DashboardProps {
  rol: 'coordinador' | 'estudiante';
}

function MilestoneBar() {
  const milestones = [
    { label: 'Postulación', count: 128, pct: 100, delta: '+6' },
    { label: 'Documentación', count: 101, pct: 79, delta: '+4' },
    { label: 'En práctica', count: 87, pct: 68, delta: '+3' },
    { label: 'Evaluación', count: 54, pct: 42, delta: '+8' },
  ];

  return (
    <div className="relative pt-8 pb-4">
      {/* Track line */}
      <div className="absolute top-[42px] left-8 right-8 h-0.5" style={{ backgroundColor: '#DCE3EA' }} />
      <div
        className="absolute top-[42px] left-8 h-0.5 transition-all"
        style={{ width: '75%', background: 'linear-gradient(90deg, #2563EB, #0F9F92)' }}
      />

      <div className="flex justify-between relative">
        {milestones.map((m, i) => (
          <div key={m.label} className="flex flex-col items-center gap-2" style={{ width: '25%' }}>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm z-10"
              style={{ backgroundColor: i < 3 ? '#2563EB' : i === 3 ? '#0F9F92' : '#DCE3EA' }}
            >
              {i + 1}
            </div>
            <div className="text-center">
              <div className="text-xs font-medium" style={{ color: '#5F6B7A' }}>{m.label}</div>
              <div className="text-xl font-bold mt-1" style={{ color: '#172033' }}>{m.count}</div>
              <div className="text-xs" style={{ color: '#5F6B7A' }}>{m.pct}%</div>
              <div className="text-xs font-medium mt-0.5" style={{ color: '#168A5B' }}>{m.delta} esta semana</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SparkLine({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 60, h = 24;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} className="opacity-70">
      <polyline points={pts} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Dashboard({ rol }: DashboardProps) {
  const navigate = useNavigate();
  const [barView, setBarView] = useState<'estado' | 'escuela'>('estado');

  if (rol === 'estudiante') {
    return <StudentDashboard />;
  }

  const alertItems = [
    { icon: <FileText size={14} />, label: '12 documentos observados', count: 12, prioridad: 'alta' as const, url: '/documentos' },
    { icon: <AlertTriangle size={14} />, label: '8 convenios próximos a vencer', count: 8, prioridad: 'alta' as const, url: '/convenios' },
    { icon: <Clock size={14} />, label: '6 estudiantes con horas retrasadas', count: 6, prioridad: 'media' as const, url: '/control-horas' },
    { icon: <CheckCircle size={14} />, label: '4 evaluaciones pendientes', count: 4, prioridad: 'media' as const, url: '/evaluaciones' },
  ];

  const barData = barView === 'estado'
    ? [
        { label: 'Pendientes', count: 14, color: '#B7791F' },
        { label: 'En revisión', count: 22, color: '#2563EB' },
        { label: 'Observadas', count: 11, color: '#D65A31' },
        { label: 'Aprobadas', count: 67, color: '#168A5B' },
        { label: 'Rechazadas', count: 5, color: '#C43D4D' },
      ]
    : [
        { label: 'Ing. Sistemas', count: 42, color: '#2563EB' },
        { label: 'Ing. Industrial', count: 31, color: '#0F9F92' },
        { label: 'Administración', count: 27, color: '#B7791F' },
        { label: 'Contabilidad', count: 19, color: '#168A5B' },
        { label: 'Otras', count: 14, color: '#7A8491' },
      ];
  const maxBar = Math.max(...barData.map(d => d.count));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Buenas tardes, Coordinador</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Este es el estado de las prácticas durante el periodo 2026-I.</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-sm font-medium px-3 py-1 rounded-lg border" style={{ color: '#5F6B7A', borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}>
              Periodo 2026-I · Del 18 de marzo al 25 de julio
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: '#DCE3EA', color: '#5F6B7A', backgroundColor: '#FFFFFF' }}>
            <Download size={14} /> Descargar resumen
          </button>
          <button onClick={() => navigate('/postulaciones/nueva')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
            <Plus size={14} /> Nueva postulación
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 0.52fr' }}>
        {/* Avance del periodo */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Avance del periodo</h2>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: '#D1FAE5', color: '#168A5B' }}>
              128 estudiantes activos
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: '#5F6B7A' }}>Seguimiento de la trayectoria por etapas</p>
          <MilestoneBar />
        </div>

        {/* Atención requerida */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Atención requerida</h2>
          <p className="text-xs mb-4" style={{ color: '#5F6B7A' }}>Casos que requieren acción inmediata</p>
          <div className="space-y-2">
            {alertItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors" style={{ backgroundColor: '#F4F7FA' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', color: '#5F6B7A' }}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: '#172033' }}>{item.label}</div>
                  <PriorityDot prioridad={item.prioridad} />
                </div>
                <button onClick={() => navigate(item.url)} className="text-xs font-medium" style={{ color: '#2563EB' }}>
                  Revisar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Convenios activos', value: '24', sub: '+3 respecto al mes anterior', spark: [18, 20, 21, 22, 23, 24], unit: '' },
          { label: 'Horas registradas esta semana', value: '486', sub: '+12% esta semana', spark: [320, 380, 410, 445, 462, 486], unit: ' h' },
          { label: 'Evaluaciones completadas', value: '54/76', sub: '71% completadas', spark: [30, 38, 44, 48, 52, 54], unit: '' },
        ].map(kpi => (
          <div key={kpi.label} className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: '#5F6B7A' }}>{kpi.label}</div>
                <div className="text-2xl font-bold" style={{ color: '#172033', fontVariantNumeric: 'tabular-nums' }}>{kpi.value}{kpi.unit}</div>
              </div>
              <SparkLine data={kpi.spark} />
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: '#168A5B' }}>
              <TrendingUp size={11} /> {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 0.7fr' }}>
        {/* Flujo de postulaciones */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Flujo de postulaciones</h2>
              <p className="text-xs" style={{ color: '#5F6B7A' }}>Distribución por categoría</p>
            </div>
            <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
              {(['estado', 'escuela'] as const).map(v => (
                <button key={v} onClick={() => setBarView(v)}
                  className="px-3 py-1.5 text-xs font-medium transition-colors capitalize"
                  style={{
                    backgroundColor: barView === v ? '#2563EB' : '#FFFFFF',
                    color: barView === v ? '#FFFFFF' : '#5F6B7A',
                  }}>
                  {v === 'estado' ? 'Estado' : 'Escuela'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2.5">
            {barData.map(d => (
              <div key={d.label} className="flex items-center gap-3">
                <div className="text-xs w-24 text-right flex-shrink-0" style={{ color: '#5F6B7A' }}>{d.label}</div>
                <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ backgroundColor: '#F4F7FA' }}>
                  <div
                    className="h-full rounded-lg transition-all"
                    style={{ width: `${(d.count / maxBar) * 100}%`, backgroundColor: d.color, opacity: 0.85 }}
                  />
                </div>
                <div className="text-xs font-semibold w-6 text-right" style={{ color: '#172033' }}>{d.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Actividad reciente</h2>
          <div className="space-y-3">
            {actividadReciente.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <Avatar iniciales={a.avatar} color={a.color} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed" style={{ color: '#172033' }}>{a.texto}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{a.hora}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EDF2F7', color: '#5F6B7A' }}>{a.tipo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Casos de seguimiento */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#EDF2F7' }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Casos que necesitan seguimiento</h2>
            <p className="text-xs" style={{ color: '#5F6B7A' }}>Revisión prioritaria de esta semana</p>
          </div>
          <button onClick={() => navigate('/bandeja')}
            className="flex items-center gap-1 text-sm font-medium" style={{ color: '#2563EB' }}>
            Ver bandeja completa <ChevronRight size={14} />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: '#F4F7FA' }}>
              {['Estudiante', 'Empresa', 'Etapa actual', 'Incidencia', 'Última actualización', 'Responsable', 'Acción'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {postulaciones.slice(0, 5).map((p, i) => (
              <tr key={p.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar iniciales={p.estudiante.iniciales} color={p.estudiante.color} size="sm" />
                    <div>
                      <div className="text-xs font-medium" style={{ color: '#172033' }}>{p.estudiante.nombre}</div>
                      <div className="text-xs" style={{ color: '#5F6B7A' }}>{p.estudiante.codigo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{p.empresa}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ['#2563EB','#0F9F92','#B7791F','#168A5B','#C43D4D'][p.etapa - 1] }} />
                    <span className="text-xs" style={{ color: '#172033' }}>
                      {['Postulación','Documentación','En práctica','Evaluación','Completado'][p.etapa - 1]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3"><StatusChip estado={p.estado} /></td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{p.ultimaActualizacion}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{p.responsable}</td>
                <td className="px-4 py-3">
                  <button onClick={() => navigate(`/postulaciones/${p.codigo}`)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                    style={{ color: '#2563EB', backgroundColor: '#EFF6FF' }}>
                    Revisar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StudentDashboard() {
  const navigate = useNavigate();
  const est = estudiantes[0];
  const horas = 186;
  const totalHoras = 320;
  const pct = Math.round((horas / totalHoras) * 100);

  const stages = [
    { label: 'Postulación', done: true },
    { label: 'Documentos', done: true },
    { label: 'Aprobación', done: true },
    { label: 'Registro de horas', done: false, active: true },
    { label: 'Evaluación', done: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Hola, Ana</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Tu práctica se encuentra en etapa de ejecución.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/control-horas')}
            className="px-4 py-2 rounded-lg text-sm font-semibold" style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
            Registrar horas
          </button>
        </div>
      </div>

      {/* Trayectoria */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-6" style={{ color: '#172033' }}>Tu trayectoria de prácticas</h2>
        <div className="flex items-center relative">
          <div className="absolute top-5 left-5 right-5 h-0.5" style={{ backgroundColor: '#DCE3EA' }} />
          <div className="absolute top-5 left-5 h-0.5 transition-all" style={{ width: '55%', backgroundColor: '#2563EB' }} />
          {stages.map((s, i) => (
            <div key={s.label} className="flex-1 flex flex-col items-center relative z-10">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm border-2"
                style={{
                  backgroundColor: s.done ? '#2563EB' : s.active ? '#FFFFFF' : '#F4F7FA',
                  borderColor: s.done ? '#2563EB' : s.active ? '#2563EB' : '#DCE3EA',
                  color: s.done ? '#FFFFFF' : s.active ? '#2563EB' : '#5F6B7A',
                }}
              >
                {s.done ? '✓' : i + 1}
              </div>
              <div className="mt-2 text-center text-xs font-medium" style={{ color: s.done || s.active ? '#172033' : '#5F6B7A' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Progreso de horas */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Progreso de horas</h2>
          <p className="text-xs mb-4" style={{ color: '#5F6B7A' }}>Periodo 2026-I</p>
          <div className="flex items-end gap-2 mb-3">
            <span className="text-3xl font-bold" style={{ color: '#172033' }}>{horas}</span>
            <span className="text-sm mb-1" style={{ color: '#5F6B7A' }}>/ {totalHoras} horas</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: '#2563EB' }} />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span style={{ color: '#168A5B' }}>{pct}% completado</span>
            <span style={{ color: '#5F6B7A' }}>{totalHoras - horas} horas restantes</span>
          </div>
          <div className="mt-4 p-3 rounded-xl text-xs" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
            <strong>Próxima acción:</strong> Registrar las horas de esta semana
          </div>
        </div>

        {/* Datos empresa */}
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de tu práctica</h2>
          <div className="space-y-3">
            {[
              ['Empresa', 'AndesTech Solutions'],
              ['Área', 'Desarrollo de software'],
              ['Modalidad', 'Presencial'],
              ['Tutor', 'Ing. Carlos Medina'],
              ['Coordinador', 'Coord. Ramos'],
              ['Finalización estimada', '31 de julio 2026'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4">
                <span className="text-xs flex-shrink-0" style={{ color: '#5F6B7A' }}>{k}</span>
                <span className="text-xs font-medium text-right" style={{ color: '#172033' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Registrar horas', icon: Clock, url: '/mis-horas', color: '#2563EB' },
          { label: 'Subir documento', icon: FileText, url: '/mis-documentos', color: '#0F9F92' },
          { label: 'Ver mi postulación', icon: FolderOpen, url: '/mi-postulacion', color: '#B7791F' },
          { label: 'Contactar al coordinador', icon: MessageIcon, url: '/notificaciones', color: '#168A5B' },
        ].map(({ label, icon: Icon, url, color }) => (
          <button key={label} onClick={() => navigate(url)}
            className="p-4 rounded-2xl border bg-white flex flex-col items-center gap-2 hover:shadow-sm transition-all"
            style={{ borderColor: '#DCE3EA' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15', color }}>
              <Icon size={18} />
            </div>
            <span className="text-xs font-medium text-center" style={{ color: '#172033' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function FolderOpen({ size }: { size: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" /></svg>;
}
function MessageIcon({ size }: { size: number }) {
  return <svg width={size} height={size} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
}
