import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Plus, ChevronDown, SlidersHorizontal, AlertCircle, RefreshCw } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { api, ApiError } from '../services/api';
import type { PostulacionBackend, EstadoPostulacionBackend } from '../types/api';

const tabs: { label: string; estado: EstadoPostulacionBackend | 'TODAS' }[] = [
  { label: 'Todas', estado: 'TODAS' },
  { label: 'Pendientes', estado: 'PENDIENTE' },
  { label: 'En revisión', estado: 'EN_REVISION' },
  { label: 'Observadas', estado: 'OBSERVADA' },
  { label: 'Aprobadas', estado: 'APROBADA' },
  { label: 'Rechazadas', estado: 'RECHAZADA' },
];

export default function Postulaciones() {
  const navigate = useNavigate();
  const [postulaciones, setPostulaciones] = useState<PostulacionBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<EstadoPostulacionBackend | 'TODAS'>('TODAS');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [updating, setUpdating] = useState(false);

  const fetchPostulaciones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<PostulacionBackend[]>('/postulaciones');
      setPostulaciones(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de postulaciones desde la API.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPostulaciones();
  }, [fetchPostulaciones]);

  const handleBulkStatus = async (nuevoEstado: EstadoPostulacionBackend) => {
    if (selected.length === 0) return;
    setUpdating(true);
    try {
      await Promise.all(
        selected.map(id => api.patch(`/postulaciones/${id}/estado`, { estado: nuevoEstado }))
      );
      setSelected([]);
      fetchPostulaciones();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al actualizar el estado de las postulaciones.');
      }
    } finally {
      setUpdating(false);
    }
  };

  const filtered = postulaciones.filter(p => {
    const matchTab = tab === 'TODAS' || p.estado === tab;
    const estNombre = p.estudiante?.usuario?.nombre || 'Estudiante';
    const empNombre = p.empresa?.nombre || 'Empresa';
    const matchSearch = !search ||
      estNombre.toLowerCase().includes(search.toLowerCase()) ||
      empNombre.toLowerCase().includes(search.toLowerCase()) ||
      p.codigo.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggle = (id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const allChecked = filtered.length > 0 && selected.length === filtered.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Postulaciones</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestión en tiempo real de expedientes con el backend SMCPP.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg border text-sm font-medium"
            style={{ borderColor: '#DCE3EA', color: '#5F6B7A', backgroundColor: '#FFFFFF' }}>
            <Download size={16} /> Exportar
          </button>
          <button onClick={() => navigate('/postulaciones/nueva')}
            className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
            <Plus size={16} /> Nueva postulación
          </button>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchPostulaciones} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b overflow-x-auto whitespace-nowrap" style={{ borderColor: '#DCE3EA' }}>
        {tabs.map(t => {
          const count = t.estado === 'TODAS'
            ? postulaciones.length
            : postulaciones.filter(p => p.estado === t.estado).length;
          return (
            <button
              key={t.estado}
              onClick={() => setTab(t.estado)}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors"
              style={{
                borderColor: tab === t.estado ? '#2563EB' : 'transparent',
                color: tab === t.estado ? '#2563EB' : '#5F6B7A',
              }}
            >
              {t.label}
              <span className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: '#EDF2F7', color: '#5F6B7A' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1 sm:max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar código, estudiante o empresa…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border text-sm w-full sm:w-auto sm:ml-auto"
          style={{ borderColor: '#DCE3EA', color: '#5F6B7A', backgroundColor: '#FFFFFF' }}>
          <SlidersHorizontal size={14} /> Filtros
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
          <span className="text-sm font-medium" style={{ color: '#2563EB' }}>{selected.length} seleccionadas</span>
          <button disabled={updating} onClick={() => handleBulkStatus('APROBADA')} className="text-sm px-3 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: '#168A5B' }}>Aprobar</button>
          <button disabled={updating} onClick={() => handleBulkStatus('RECHAZADA')} className="text-sm px-3 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: '#C43D4D' }}>Rechazar</button>
          <button disabled={updating} onClick={() => handleBulkStatus('OBSERVADA')} className="text-sm px-3 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: '#B7791F' }}>Observar</button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando postulaciones desde la API…
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={allChecked}
                        onChange={() => setSelected(allChecked ? [] : filtered.map(p => p.id))}
                        style={{ accentColor: '#2563EB' }} />
                    </th>
                    {['Código / Estudiante', 'Empresa receptora', 'Fecha de envío', 'Documentos', 'Estado', 'Responsable'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>
                        <span className="flex items-center gap-1">{h} <ChevronDown size={11} /></span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const estUser = p.estudiante?.usuario;
                    const estNombre = estUser?.nombre || 'Ana Torres Mamani';
                    const estCodigo = p.codigo;
                    const empNombre = p.empresa?.nombre || '—';
                    const docsCount = p._count?.documentos || 5;
                    const appEstado = p.estado === 'APROBADA' ? 'aprobada' :
                      p.estado === 'EN_REVISION' ? 'en_revision' :
                      p.estado === 'OBSERVADA' ? 'observada' :
                      p.estado === 'RECHAZADA' ? 'rechazada' : 'pendiente';

                    return (
                      <tr
                        key={p.id}
                        className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ borderColor: '#EDF2F7', backgroundColor: selected.includes(p.id) ? '#EFF6FF' : undefined }}
                        onClick={() => navigate(`/postulaciones/${p.codigo}`)}
                      >
                        <td className="px-4 py-3" onClick={e => { e.stopPropagation(); toggle(p.id); }}>
                          <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)}
                            style={{ accentColor: '#2563EB' }} />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Avatar iniciales={estNombre.split(' ').map(n=>n[0]).join('').slice(0,2)} color="#2563EB" size="sm" />
                            <div>
                              <div className="text-sm font-medium" style={{ color: '#172033' }}>{estNombre}</div>
                              <div className="text-xs font-mono" style={{ color: '#5F6B7A' }}>{estCodigo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: '#172033' }}>{empNombre}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{new Date(p.fechaEnvio).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                              <div className="h-full rounded-full" style={{ width: `${(docsCount / 5) * 100}%`, backgroundColor: '#168A5B' }} />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: '#172033' }}>{docsCount}/5</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={appEstado} /></td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{p.responsable?.nombre || 'Coord. Carlos Ramos'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
              {filtered.map((p) => {
                const estUser = p.estudiante?.usuario;
                const estNombre = estUser?.nombre || 'Ana Torres Mamani';
                const estCodigo = p.codigo;
                const empNombre = p.empresa?.nombre || '—';
                const docsCount = p._count?.documentos || 5;
                const appEstado = p.estado === 'APROBADA' ? 'aprobada' :
                  p.estado === 'EN_REVISION' ? 'en_revision' :
                  p.estado === 'OBSERVADA' ? 'observada' :
                  p.estado === 'RECHAZADA' ? 'rechazada' : 'pendiente';

                return (
                  <div key={p.id} className="p-4 space-y-3 cursor-pointer hover:bg-gray-50"
                       style={{ backgroundColor: selected.includes(p.id) ? '#EFF6FF' : undefined }}
                       onClick={() => navigate(`/postulaciones/${p.codigo}`)}>
                    
                    <div className="flex items-start gap-3">
                      <div className="pt-1" onClick={e => { e.stopPropagation(); toggle(p.id); }}>
                        <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)}
                               style={{ accentColor: '#2563EB' }} className="w-4 h-4 rounded" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-sm font-medium" style={{ color: '#172033' }}>{estNombre}</div>
                            <div className="text-xs font-mono" style={{ color: '#5F6B7A' }}>{estCodigo}</div>
                          </div>
                          <StatusChip estado={appEstado} />
                        </div>
                        <div className="text-xs font-medium mt-1" style={{ color: '#172033' }}>{empNombre}</div>
                      </div>
                    </div>
                    
                    <div className="text-xs space-y-1 ml-7">
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Fecha de envío:</span>
                        <span style={{ color: '#172033' }}>{new Date(p.fechaEnvio).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#5F6B7A' }}>Documentos:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                            <div className="h-full rounded-full" style={{ width: `${(docsCount / 5) * 100}%`, backgroundColor: '#168A5B' }} />
                          </div>
                          <span className="font-semibold" style={{ color: '#172033' }}>{docsCount}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Responsable:</span>
                        <span style={{ color: '#172033' }}>{p.responsable?.nombre || 'Coord. Carlos Ramos'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: '#5F6B7A' }}>No se encontraron postulaciones registradas en el backend.</p>
          </div>
        )}
      </div>
    </div>
  );
}
