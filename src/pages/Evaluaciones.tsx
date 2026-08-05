import { useState, useEffect, useCallback } from 'react';
import { Search, Star, AlertCircle, RefreshCw, X, Save, Send } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { EvaluacionBackend, CriterioEvaluacionBackend } from '../types/api';

export default function Evaluaciones() {
  const [evaluaciones, setEvaluaciones] = useState<EvaluacionBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  // Modal para calificar
  const [selectedEval, setSelectedEval] = useState<EvaluacionBackend | null>(null);
  const [criterios, setCriterios] = useState<CriterioEvaluacionBackend[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [fortalezas, setFortalezas] = useState('');
  const [aspectosMejorar, setAspectosMejorar] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchEvaluaciones = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<EvaluacionBackend[]>('/evaluaciones');
      setEvaluaciones(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar evaluaciones desde la API.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvaluaciones();
  }, [fetchEvaluaciones]);

  const handleOpenEval = async (evalObj: EvaluacionBackend) => {
    try {
      const res = await api.get<{ evaluacion: EvaluacionBackend; criterios: CriterioEvaluacionBackend[] }>(`/evaluaciones/${evalObj.id}`);
      setSelectedEval(res.evaluacion);
      setCriterios(res.criterios);

      // Pre-poblar puntajes existentes
      const initScores: Record<string, number> = {};
      res.evaluacion.detalles?.forEach(d => {
        initScores[d.criterioId] = d.puntaje;
      });
      setScores(initScores);
      setFortalezas(res.evaluacion.fortalezas || '');
      setAspectosMejorar(res.evaluacion.aspectosMejorar || '');
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al abrir la evaluación.');
    }
  };

  const handleSaveDetalles = async (enviarFinal: boolean) => {
    if (!selectedEval) return;
    setSaving(true);
    try {
      const detallesList = Object.entries(scores).map(([criterioId, puntaje]) => ({
        criterioId,
        puntaje,
      }));

      await api.post(`/evaluaciones/${selectedEval.id}/detalles`, {
        detalles: detallesList,
        fortalezas,
        aspectosMejorar,
      });

      if (enviarFinal) {
        await api.patch(`/evaluaciones/${selectedEval.id}/enviar`);
      }

      setSelectedEval(null);
      fetchEvaluaciones();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al guardar la evaluación.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = evaluaciones.filter(e => {
    const estNombre = e.estudiante?.usuario?.nombre || 'Estudiante';
    const empNombre = e.postulacion?.empresa?.nombre || 'Empresa';
    return !search || estNombre.toLowerCase().includes(search.toLowerCase()) || empNombre.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Evaluaciones de Desempeño</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Evaluaciones ponderadas de prácticas basadas en 9 criterios cuantitativos.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchEvaluaciones} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por estudiante o empresa…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando evaluaciones desde la API…
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    {['Estudiante', 'Empresa / Práctica', 'Avance', 'Nota Global', 'Estado', 'Acción'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(e => {
                    const estNombre = e.estudiante?.usuario?.nombre || '—';
                    const empNombre = e.postulacion?.empresa?.nombre || '—';
                    const appEstado = e.estado === 'COMPLETADA' ? 'aprobada' : e.estado === 'EN_PROCESO' ? 'en_revision' : 'pendiente';

                    return (
                      <tr key={e.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                        <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: '#172033' }}>{estNombre}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{empNombre} ({e.postulacion?.codigo})</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                              <div className="h-full rounded-full" style={{ width: `${e.avance}%`, backgroundColor: '#2563EB' }} />
                            </div>
                            <span>{e.avance}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold whitespace-nowrap" style={{ color: '#2563EB' }}>
                          {e.resultado ? `${e.resultado.toFixed(2)} / 5.0` : 'Pendiente'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={appEstado} /></td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => handleOpenEval(e)}
                            className="px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-blue-50 transition-colors"
                            style={{ borderColor: '#2563EB', color: '#2563EB' }}
                          >
                            {e.estado === 'COMPLETADA' ? 'Ver Rubrica' : 'Calificar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
              {filtered.map(e => {
                const estNombre = e.estudiante?.usuario?.nombre || '—';
                const empNombre = e.postulacion?.empresa?.nombre || '—';
                const appEstado = e.estado === 'COMPLETADA' ? 'aprobada' : e.estado === 'EN_PROCESO' ? 'en_revision' : 'pendiente';

                return (
                  <div key={e.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="font-medium text-sm leading-tight" style={{ color: '#172033' }}>{estNombre}</div>
                      <StatusChip estado={appEstado} />
                    </div>
                    
                    <div className="text-xs space-y-2">
                      <div>
                        <span style={{ color: '#5F6B7A' }} className="block mb-0.5">Empresa / Práctica:</span>
                        <span style={{ color: '#172033' }}>{empNombre} ({e.postulacion?.codigo})</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#5F6B7A' }}>Avance:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                            <div className="h-full rounded-full" style={{ width: `${e.avance}%`, backgroundColor: '#2563EB' }} />
                          </div>
                          <span>{e.avance}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span style={{ color: '#5F6B7A' }}>Nota Global:</span>
                        <span className="font-bold text-sm" style={{ color: '#2563EB' }}>
                          {e.resultado ? `${e.resultado.toFixed(2)} / 5.0` : 'Pendiente'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => handleOpenEval(e)}
                        className="w-full py-2 rounded-lg border text-sm font-semibold hover:bg-blue-50 transition-colors flex justify-center items-center gap-2"
                        style={{ borderColor: '#2563EB', color: '#2563EB' }}
                      >
                        <Star size={16} /> {e.estado === 'COMPLETADA' ? 'Ver Rubrica' : 'Calificar'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            No hay evaluaciones registradas.
          </div>
        )}
      </div>

      {/* Modal Evaluation Form */}
      {selectedEval && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-2xl space-y-4 border shadow-xl max-h-[90vh] overflow-y-auto" style={{ borderColor: '#DCE3EA', maxWidth: 'calc(100vw - 32px)' }}>
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-semibold text-lg" style={{ color: '#172033' }}>Evaluación de Desempeño Ponderada</h3>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Estudiante: {selectedEval.estudiante?.usuario?.nombre}</p>
              </div>
              <button onClick={() => setSelectedEval(null)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>

            <div className="space-y-4">
              <div className="text-xs font-semibold" style={{ color: '#152A43' }}>PUNTAJE POR CRITERIO (ESCALA 1 A 5)</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {criterios.map(c => (
                  <div key={c.id} className="p-3 rounded-xl border space-y-1" style={{ borderColor: '#DCE3EA', backgroundColor: '#FAFAFA' }}>
                    <div className="flex justify-between items-center text-xs font-medium" style={{ color: '#172033' }}>
                      <span>{c.nombre} <span className="text-gray-400">({c.peso}%)</span></span>
                      <span className="font-bold text-blue-600">{scores[c.id] || 0} / 5</span>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={0.5}
                      value={scores[c.id] || 5}
                      disabled={selectedEval.estado === 'COMPLETADA'}
                      onChange={e => setScores(prev => ({ ...prev, [c.id]: Number(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Fortalezas del Practicante</label>
                <textarea
                  rows={2}
                  disabled={selectedEval.estado === 'COMPLETADA'}
                  className="w-full p-2.5 text-sm border rounded-lg outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }}
                  placeholder="Aspectos positivos destacados durante la práctica…"
                  value={fortalezas}
                  onChange={e => setFortalezas(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Aspectos por Mejorar</label>
                <textarea
                  rows={2}
                  disabled={selectedEval.estado === 'COMPLETADA'}
                  className="w-full p-2.5 text-sm border rounded-lg outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }}
                  placeholder="Recomendaciones para su desarrollo futuro…"
                  value={aspectosMejorar}
                  onChange={e => setAspectosMejorar(e.target.value)}
                />
              </div>

              {selectedEval.estado !== 'COMPLETADA' && (
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveDetalles(false)}
                    className="flex-1 py-2.5 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2"
                    style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}
                  >
                    <Save size={16} /> Guardar Borrador
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveDetalles(true)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#168A5B' }}
                  >
                    <Send size={16} /> Finalizar y Enviar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
