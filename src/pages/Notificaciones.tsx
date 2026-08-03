import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, FileText, Clock, Star, Settings, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { PriorityDot } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { NotificacionBackend, CategoriaNotificacionBackend, PrioridadBackend } from '../types/api';

const categorias = [
  { key: 'TODAS', label: 'Todas', icon: Bell },
  { key: 'POSTULACIONES', label: 'Postulaciones', icon: FileText },
  { key: 'DOCUMENTOS', label: 'Documentos', icon: FileText },
  { key: 'HORAS', label: 'Horas', icon: Clock },
  { key: 'EVALUACIONES', label: 'Evaluaciones', icon: Star },
  { key: 'SISTEMA', label: 'Sistema', icon: Settings },
];

const categoriaIcon: Record<string, React.ReactNode> = {
  POSTULACIONES: <FileText size={14} style={{ color: '#2563EB' }} />,
  DOCUMENTOS: <FileText size={14} style={{ color: '#0F9F92' }} />,
  HORAS: <Clock size={14} style={{ color: '#B7791F' }} />,
  EVALUACIONES: <Star size={14} style={{ color: '#168A5B' }} />,
  SISTEMA: <Settings size={14} style={{ color: '#7A8491' }} />,
};

interface NotificacionesProps {
  rol: 'coordinador' | 'estudiante';
}

export default function Notificaciones({ rol }: NotificacionesProps) {
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState<NotificacionBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [catFilter, setCatFilter] = useState('TODAS');
  const [selected, setSelected] = useState<NotificacionBackend | null>(null);

  const fetchNotificaciones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<NotificacionBackend[]>('/notificaciones');
      setNotifs(data);
      if (data.length > 0) {
        setSelected(data[0]);
      } else {
        setSelected(null);
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar notificaciones desde la API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones, rol]);

  const markRead = async (id: string) => {
    try {
      await api.patch(`/notificaciones/${id}/leida`);
      setNotifs(ns => ns.map(n => n.id === id ? { ...n, leida: true } : n));
      if (selected?.id === id) {
        setSelected(prev => prev ? { ...prev, leida: true } : null);
      }
    } catch {
      // Ignore background read status error
    }
  };

  const filtered = catFilter === 'TODAS'
    ? notifs
    : notifs.filter(n => n.categoria === catFilter);

  const mapPrioridad = (p: PrioridadBackend): 'alta' | 'media' | 'baja' => {
    if (p === 'ALTA') return 'alta';
    if (p === 'BAJA') return 'baja';
    return 'media';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Notificaciones</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Centro de avisos del backend SMCPP para tu perfil.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchNotificaciones} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      <div className="grid gap-6" style={{ gridTemplateColumns: '320px 1fr' }}>
        {/* Left: list */}
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {/* Category tabs */}
          <div className="border-b overflow-x-auto" style={{ borderColor: '#EDF2F7' }}>
            <div className="flex">
              {categorias.map(c => (
                <button key={c.key} onClick={() => setCatFilter(c.key)}
                  className="flex-shrink-0 px-3 py-2.5 text-xs font-medium border-b-2 -mb-px transition-colors"
                  style={{ borderColor: catFilter === c.key ? '#2563EB' : 'transparent', color: catFilter === c.key ? '#2563EB' : '#5F6B7A' }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: '#EDF2F7' }}>
            {loading ? (
              <div className="p-8 text-center text-xs" style={{ color: '#5F6B7A' }}>
                Cargando notificaciones…
              </div>
            ) : filtered.map(n => (
              <div
                key={n.id}
                onClick={() => { setSelected(n); if (!n.leida) markRead(n.id); }}
                className="flex items-start gap-3 p-4 cursor-pointer transition-colors"
                style={{ backgroundColor: selected?.id === n.id ? '#EFF6FF' : !n.leida ? '#FAFEFF' : '#FFFFFF' }}
              >
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#F4F7FA' }}>
                  {categoriaIcon[n.categoria]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <div className="text-xs font-semibold truncate" style={{ color: '#172033' }}>{n.titulo}</div>
                    {!n.leida && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: '#2563EB' }} />}
                  </div>
                  <div className="text-xs mt-0.5 line-clamp-2" style={{ color: '#5F6B7A' }}>{n.resumen}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <PriorityDot prioridad={mapPrioridad(n.prioridad)} />
                  </div>
                </div>
              </div>
            ))}
            {!loading && filtered.length === 0 && (
              <div className="py-12 text-center text-xs" style={{ color: '#5F6B7A' }}>
                No hay notificaciones en esta categoría.
              </div>
            )}
          </div>
        </div>

        {/* Right: detail */}
        {selected ? (
          <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4F7FA' }}>
                  {categoriaIcon[selected.categoria]}
                </div>
                <div>
                  <h2 className="font-semibold" style={{ color: '#172033' }}>{selected.titulo}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{new Date(selected.createdAt).toLocaleString()}</span>
                    <PriorityDot prioridad={mapPrioridad(selected.prioridad)} />
                  </div>
                </div>
              </div>
              {!selected.leida && (
                <button onClick={() => markRead(selected.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  <CheckCircle size={12} /> Marcar leída
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: '#F4F7FA' }}>
              <p className="text-sm" style={{ color: '#172033' }}>{selected.resumen}</p>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#5F6B7A' }}>CATEGORÍA</div>
                <div className="text-sm capitalize" style={{ color: '#172033' }}>{selected.categoria.toLowerCase()}</div>
              </div>
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#5F6B7A' }}>PRIORIDAD</div>
                <PriorityDot prioridad={mapPrioridad(selected.prioridad)} />
              </div>
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: '#5F6B7A' }}>ESTADO</div>
                <div className="text-sm" style={{ color: selected.leida ? '#168A5B' : '#B7791F' }}>
                  {selected.leida ? 'Leída' : 'No leída'}
                </div>
              </div>
            </div>

            {selected.accionUrl && (
              <div className="mt-6">
                <button
                  onClick={() => navigate(selected.accionUrl!)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ backgroundColor: '#2563EB' }}>
                  Abrir trámite relacionado
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border flex items-center justify-center" style={{ borderColor: '#DCE3EA', minHeight: 300 }}>
            <div className="text-center">
              <Bell size={32} style={{ color: '#DCE3EA', margin: '0 auto 12px' }} />
              <p className="text-sm" style={{ color: '#5F6B7A' }}>Selecciona una notificación para ver el detalle.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
