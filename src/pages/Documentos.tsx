import { useState, useEffect, useCallback } from 'react';
import { Search, Download, CheckCircle, AlertCircle, FileText, RefreshCw, X, MessageSquare } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { DocumentoBackend } from '../types/api';

export default function Documentos() {
  const [docs, setDocs] = useState<DocumentoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'todos' | 'PENDIENTE' | 'APROBADO' | 'OBSERVADO'>('todos');

  // Observation modal
  const [selectedDoc, setSelectedDoc] = useState<DocumentoBackend | null>(null);
  const [observacionTxt, setObservacionTxt] = useState('');
  const [submittingObs, setSubmittingObs] = useState(false);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<DocumentoBackend[]>('/documentos');
      setDocs(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar la lista de documentos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleAprobar = async (id: string) => {
    try {
      await api.patch(`/documentos/${id}/estado`, { estado: 'APROBADO' });
      fetchDocs();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al aprobar documento.');
    }
  };

  const handleObservar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !observacionTxt.trim()) return;
    setSubmittingObs(true);
    try {
      await api.post(`/documentos/${selectedDoc.id}/observaciones`, { observacion: observacionTxt });
      setSelectedDoc(null);
      setObservacionTxt('');
      fetchDocs();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al registrar observación.');
    } finally {
      setSubmittingObs(false);
    }
  };

  const handleDescargar = async (doc: DocumentoBackend) => {
    try {
      await api.downloadBlob(`/documentos/${doc.id}/descargar`, `${doc.nombre}.pdf`);
    } catch (err) {
      alert('Error al descargar archivo PDF desde el servidor.');
    }
  };

  const filtered = docs.filter(d => {
    const matchTab = tab === 'todos' || d.estado === tab;
    const estNombre = d.estudiante?.usuario?.nombre || 'Estudiante';
    const matchSearch = !search ||
      d.nombre.toLowerCase().includes(search.toLowerCase()) ||
      estNombre.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Revisión de Documentos</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestiona expedientes y requerimientos de prácticas en tiempo real.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchDocs} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2 overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ borderColor: '#DCE3EA' }}>
        {[
          { key: 'todos', label: 'Todos' },
          { key: 'PENDIENTE', label: 'Pendientes' },
          { key: 'APROBADO', label: 'Aprobados' },
          { key: 'OBSERVADO', label: 'Observados' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as any)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: tab === t.key ? '#152A43' : '#FFFFFF',
              color: tab === t.key ? '#FFFFFF' : '#5F6B7A',
              border: '1px solid #DCE3EA',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por documento o estudiante…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando documentos en tiempo real…
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    {['Documento', 'Estudiante', 'Versión', 'Tamaño', 'Fecha Carga', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(d => {
                    const estNombre = d.estudiante?.usuario?.nombre || '—';
                    const appEstado = d.estado === 'APROBADO' ? 'aprobada' : d.estado === 'OBSERVADO' ? 'observada' : 'pendiente';

                    return (
                      <tr key={d.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <FileText size={16} style={{ color: '#2563EB' }} />
                            <span className="text-sm font-medium" style={{ color: '#172033' }}>{d.nombre}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm whitespace-nowrap" style={{ color: '#172033' }}>{estNombre}</td>
                        <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: '#5F6B7A' }}>v{d.version}</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{(d.tamano / 1024).toFixed(1)} KB</td>
                        <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={appEstado} /></td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleDescargar(d)} title="Descargar PDF" className="p-1.5 rounded-lg border hover:bg-gray-100 transition-colors" style={{ borderColor: '#DCE3EA', color: '#2563EB' }}>
                              <Download size={14} />
                            </button>
                            {d.estado !== 'APROBADO' && (
                              <button onClick={() => handleAprobar(d.id)} title="Aprobar Documento" className="p-1.5 rounded-lg text-white hover:bg-emerald-700 transition-colors" style={{ backgroundColor: '#168A5B' }}>
                                <CheckCircle size={14} />
                              </button>
                            )}
                            {d.estado !== 'OBSERVADO' && (
                              <button onClick={() => { setSelectedDoc(d); setObservacionTxt(d.comentario || ''); }} title="Observar Documento" className="p-1.5 rounded-lg text-white hover:bg-amber-700 transition-colors" style={{ backgroundColor: '#B7791F' }}>
                                <MessageSquare size={14} />
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
              {filtered.map(d => {
                const estNombre = d.estudiante?.usuario?.nombre || '—';
                const appEstado = d.estado === 'APROBADO' ? 'aprobada' : d.estado === 'OBSERVADO' ? 'observada' : 'pendiente';

                return (
                  <div key={d.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex gap-2">
                        <FileText size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#2563EB' }} />
                        <div>
                          <div className="text-sm font-medium leading-tight" style={{ color: '#172033' }}>{d.nombre}</div>
                          <div className="text-xs font-medium mt-1" style={{ color: '#172033' }}>{estNombre}</div>
                        </div>
                      </div>
                      <StatusChip estado={appEstado} />
                    </div>
                    
                    <div className="text-xs space-y-1 pl-6">
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Versión / Tamaño:</span>
                        <span style={{ color: '#172033' }}>v{d.version} ({(d.tamano / 1024).toFixed(1)} KB)</span>
                      </div>
                      <div className="flex justify-between">
                        <span style={{ color: '#5F6B7A' }}>Fecha de Carga:</span>
                        <span style={{ color: '#172033' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 pl-6">
                      <button onClick={() => handleDescargar(d)} className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg border hover:bg-gray-100 transition-colors" style={{ borderColor: '#DCE3EA', color: '#2563EB' }}>
                        <Download size={14} /> <span className="text-xs font-medium">Descargar</span>
                      </button>
                      {d.estado !== 'APROBADO' && (
                        <button onClick={() => handleAprobar(d.id)} className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-white hover:bg-emerald-700 transition-colors" style={{ backgroundColor: '#168A5B' }}>
                          <CheckCircle size={14} /> <span className="text-xs font-medium">Aprobar</span>
                        </button>
                      )}
                      {d.estado !== 'OBSERVADO' && (
                        <button onClick={() => { setSelectedDoc(d); setObservacionTxt(d.comentario || ''); }} className="flex-1 py-1.5 flex items-center justify-center gap-1.5 rounded-lg text-white hover:bg-amber-700 transition-colors" style={{ backgroundColor: '#B7791F' }}>
                          <MessageSquare size={14} /> <span className="text-xs font-medium">Observar</span>
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
            No se encontraron documentos en el sistema.
          </div>
        )}
      </div>

      {/* Observation Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full sm:max-w-md space-y-4 border shadow-xl" style={{ borderColor: '#DCE3EA', maxWidth: 'calc(100vw - 32px)' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: '#172033' }}>Observar Documento</h3>
              <button onClick={() => setSelectedDoc(null)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>
            <p className="text-xs" style={{ color: '#5F6B7A' }}>Documento: <strong>{selectedDoc.nombre}</strong></p>
            <form onSubmit={handleObservar} className="space-y-3">
              <textarea
                required
                rows={4}
                className="w-full p-3 text-sm border rounded-lg outline-none resize-none"
                style={{ borderColor: '#DCE3EA' }}
                placeholder="Ingresa los detalles de la observación o motivo de rechazo…"
                value={observacionTxt}
                onChange={e => setObservacionTxt(e.target.value)}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setSelectedDoc(null)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
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
