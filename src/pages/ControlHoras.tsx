import { useState, useEffect, useCallback } from 'react';
import { Search, CheckCircle, AlertCircle, RefreshCw, X, MessageSquare, Clock } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { RegistroHoraBackend, ResumenHorasBackend } from '../types/api';

export default function ControlHoras() {
  const [data, setData] = useState<ResumenHorasBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Observation modal
  const [selectedHora, setSelectedHora] = useState<RegistroHoraBackend | null>(null);
  const [observacionTxt, setObservacionTxt] = useState('');
  const [submittingObs, setSubmittingObs] = useState(false);

  const fetchHoras = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<ResumenHorasBackend>('/horas');
      setData(res);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar los registros de horas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHoras();
  }, [fetchHoras]);

  const handleValidar = async (id: string) => {
    try {
      await api.patch(`/horas/${id}/validar`);
      fetchHoras();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al validar horas.');
    }
  };

  const handleObservar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHora || !observacionTxt.trim()) return;
    setSubmittingObs(true);
    try {
      await api.patch(`/horas/${selectedHora.id}/observar`, { observacion: observacionTxt });
      setSelectedHora(null);
      setObservacionTxt('');
      fetchHoras();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al observar horas.');
    } finally {
      setSubmittingObs(false);
    }
  };

  const registros = data?.registros || [];
  const resumen = data?.resumen || { acumuladas: 0, meta: 320, aprobadas: 0, pendientes: 0, observadas: 0, porcentaje: 0 };

  const filtered = registros.filter(r => {
    const estNombre = r.estudiante?.usuario?.nombre || 'Estudiante';
    return !search || estNombre.toLowerCase().includes(search.toLowerCase()) || r.actividad.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Control de Horas de Práctica</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Monitoreo y validación de jornadas acumuladas en tiempo real.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchHoras} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Metrics Header */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Horas Aprobadas', val: `${resumen.aprobadas}h`, color: '#168A5B' },
          { label: 'Horas Pendientes', val: `${resumen.pendientes}h`, color: '#2563EB' },
          { label: 'Horas Observadas', val: `${resumen.observadas}h`, color: '#B7791F' },
          { label: 'Meta Global (320h)', val: `${resumen.porcentaje}%`, color: '#152A43' },
        ].map(m => (
          <div key={m.label} className="bg-white p-3 sm:p-4 rounded-2xl border" style={{ borderColor: '#DCE3EA' }}>
            <span className="text-xs font-medium" style={{ color: '#5F6B7A' }}>{m.label}</span>
            <div className="text-xl sm:text-2xl font-bold mt-1" style={{ color: m.color }}>{m.val}</div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por estudiante o actividad…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando registros de horas desde la API…
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    {['Estudiante', 'Fecha', 'Horario', 'Pausa', 'Horas Netas', 'Actividad', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(r => {
                    const estNombre = r.estudiante?.usuario?.nombre || '—';
                    const appEstado = r.estado === 'APROBADA' ? 'aprobada' : r.estado === 'OBSERVADA' ? 'observada' : 'pendiente';

                    return (
                      <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: '#172033' }}>{estNombre}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{new Date(r.fecha).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: '#172033' }}>{r.horaEntrada} - {r.horaSalida}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{r.minutosPausa} min</td>
                        <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: '#2563EB' }}>{r.horasRegistradas}h</td>
                        <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: '#5F6B7A' }}>{r.actividad}</td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={appEstado} /></td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {r.estado !== 'APROBADA' && (
                              <button onClick={() => handleValidar(r.id)} title="Validar Horas" className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-emerald-700" style={{ backgroundColor: '#168A5B' }}>
                                Validar
                              </button>
                            )}
                            {r.estado !== 'OBSERVADA' && (
                              <button onClick={() => { setSelectedHora(r); setObservacionTxt(r.comentario || ''); }} title="Observar Horas" className="px-3 py-1 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-amber-700" style={{ backgroundColor: '#B7791F' }}>
                                Observar
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
              {filtered.map(r => {
                const estNombre = r.estudiante?.usuario?.nombre || '—';
                const appEstado = r.estado === 'APROBADA' ? 'aprobada' : r.estado === 'OBSERVADA' ? 'observada' : 'pendiente';

                return (
                  <div key={r.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-medium text-sm leading-tight" style={{ color: '#172033' }}>{estNombre}</div>
                      <StatusChip estado={appEstado} />
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Fecha:</span>
                        <span style={{ color: '#172033' }}>{new Date(r.fecha).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Horario:</span>
                        <span className="font-mono" style={{ color: '#172033' }}>{r.horaEntrada} - {r.horaSalida}</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Neto / Pausa:</span>
                        <span className="font-bold" style={{ color: '#2563EB' }}>{r.horasRegistradas}h <span className="font-normal text-gray-500">({r.minutosPausa}m)</span></span>
                      </div>
                      <div className="pt-1">
                        <span style={{ color: '#5F6B7A' }} className="block mb-0.5">Actividad:</span>
                        <p className="italic text-gray-700 line-clamp-2">{r.actividad}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {r.estado !== 'APROBADA' && (
                        <button onClick={() => handleValidar(r.id)} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-emerald-700 flex justify-center items-center gap-1.5" style={{ backgroundColor: '#168A5B' }}>
                          <CheckCircle size={14} /> Validar
                        </button>
                      )}
                      {r.estado !== 'OBSERVADA' && (
                        <button onClick={() => { setSelectedHora(r); setObservacionTxt(r.comentario || ''); }} className="flex-1 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-amber-700 flex justify-center items-center gap-1.5" style={{ backgroundColor: '#B7791F' }}>
                          <MessageSquare size={14} /> Observar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            No hay registros de horas reportados en esta vista.
          </div>
        )}
      </div>

      {/* Observation Modal */}
      {selectedHora && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full sm:max-w-md space-y-4 border shadow-xl" style={{ borderColor: '#DCE3EA', maxWidth: 'calc(100vw - 32px)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: '#172033' }}>Observar Registro de Horas</h3>
              <button onClick={() => setSelectedHora(null)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>
            <p className="text-xs" style={{ color: '#5F6B7A' }}>Fecha: {new Date(selectedHora.fecha).toLocaleDateString()} ({selectedHora.horasRegistradas}h)</p>
            <form onSubmit={handleObservar} className="space-y-3">
              <textarea
                required
                rows={4}
                className="w-full p-3 text-sm border rounded-lg outline-none resize-none"
                style={{ borderColor: '#DCE3EA' }}
                placeholder="Ingresa la razón de observación…"
                value={observacionTxt}
                onChange={e => setObservacionTxt(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedHora(null)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
                <button type="submit" disabled={submittingObs} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#B7791F' }}>
                  {submittingObs ? 'Guardando…' : 'Enviar Observación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
