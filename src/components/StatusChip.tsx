import { CheckCircle, Clock, AlertCircle, XCircle, Eye, RotateCcw, Minus } from 'lucide-react';

type EstadoPostulacion = 'pendiente' | 'en_revision' | 'observada' | 'aprobada' | 'rechazada' | 'completado' | 'inactivo' | 'activo' | 'por_vencer' | 'vencido' | 'suspendido' | 'en_proceso' | 'vencida';

const configs: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  pendiente: { label: 'Pendiente', icon: <Clock size={11} />, bg: '#FEF3C7', text: '#B7791F', border: '#FDE68A' },
  en_revision: { label: 'En revisión', icon: <Eye size={11} />, bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
  observada: { label: 'Observada', icon: <AlertCircle size={11} />, bg: '#FEE9E0', text: '#D65A31', border: '#FDCDB9' },
  aprobada: { label: 'Aprobada', icon: <CheckCircle size={11} />, bg: '#D1FAE5', text: '#168A5B', border: '#A7F3D0' },
  rechazada: { label: 'Rechazada', icon: <XCircle size={11} />, bg: '#FEE2E2', text: '#C43D4D', border: '#FECACA' },
  completado: { label: 'Completado', icon: <CheckCircle size={11} />, bg: '#CCFBF1', text: '#0F9F92', border: '#99F6E4' },
  inactivo: { label: 'Inactivo', icon: <Minus size={11} />, bg: '#F3F4F6', text: '#7A8491', border: '#E5E7EB' },
  activo: { label: 'Activo', icon: <CheckCircle size={11} />, bg: '#D1FAE5', text: '#168A5B', border: '#A7F3D0' },
  por_vencer: { label: 'Por vencer', icon: <AlertCircle size={11} />, bg: '#FEF3C7', text: '#B7791F', border: '#FDE68A' },
  vencido: { label: 'Vencido', icon: <XCircle size={11} />, bg: '#FEE2E2', text: '#C43D4D', border: '#FECACA' },
  suspendido: { label: 'Suspendido', icon: <Minus size={11} />, bg: '#F3F4F6', text: '#7A8491', border: '#E5E7EB' },
  en_proceso: { label: 'En proceso', icon: <RotateCcw size={11} />, bg: '#DBEAFE', text: '#2563EB', border: '#BFDBFE' },
  vencida: { label: 'Vencida', icon: <XCircle size={11} />, bg: '#FEE2E2', text: '#C43D4D', border: '#FECACA' },
};

export function StatusChip({ estado }: { estado: EstadoPostulacion }) {
  const cfg = configs[estado] ?? configs.inactivo;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

export function PriorityDot({ prioridad }: { prioridad: 'alta' | 'media' | 'baja' }) {
  const map = {
    alta: { color: '#C43D4D', label: 'Alta' },
    media: { color: '#B7791F', label: 'Media' },
    baja: { color: '#168A5B', label: 'Baja' },
  };
  const { color, label } = map[prioridad];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color }}>
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
