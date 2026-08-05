import { useState, useEffect, useCallback } from 'react';
import { Search, Building2, MapPin, Users, Globe, Plus, AlertCircle, RefreshCw, X } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { EmpresaBackend, ConvenioBackend } from '../types/api';

const modalidades = ['Todas', 'Presencial', 'Híbrido', 'Remoto'];

export default function Empresas() {
  const [empresas, setEmpresas] = useState<EmpresaBackend[]>([]);
  const [convenios, setConvenios] = useState<ConvenioBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [modalidad, setModalidad] = useState('Todas');
  const [selected, setSelected] = useState<string | null>(null);

  // Modal new empresa state
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    rubro: '',
    ubicacion: '',
    modalidad: 'Híbrido',
    vacantes: 5,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [empRes, convRes] = await Promise.all([
        api.get<EmpresaBackend[]>('/empresas'),
        api.get<ConvenioBackend[]>('/convenios').catch(() => []),
      ]);
      setEmpresas(empRes);
      setConvenios(convRes);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de empresas desde la API.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await api.post<EmpresaBackend>('/empresas', {
        ...formData,
        vacantes: Number(formData.vacantes),
      });
      setShowModal(false);
      setFormData({ nombre: '', rubro: '', ubicacion: '', modalidad: 'Híbrido', vacantes: 5 });
      fetchData();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Error al crear la empresa.');
      }
    } finally {
      setSaving(false);
    }
  };

  const filtered = empresas.filter(e => {
    const matchQ = e.nombre.toLowerCase().includes(query.toLowerCase()) ||
      e.rubro.toLowerCase().includes(query.toLowerCase()) ||
      e.ubicacion.toLowerCase().includes(query.toLowerCase());
    const matchM = modalidad === 'Todas' || e.modalidad === modalidad;
    return matchQ && matchM;
  });

  const selEmpresa = empresas.find(e => e.id === selected);
  const selConvenios = convenios.filter(c => c.empresaId === selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Empresas receptoras</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Catálogo de empresas conectadas con el backend SMCPP.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 w-full sm:w-auto rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
          <Plus size={14} /> Nueva empresa
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2 text-sm font-medium">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchData} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Empresas registradas', value: loading ? '…' : empresas.length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Vacantes totales', value: loading ? '…' : empresas.reduce((s, e) => s + e.vacantes, 0), color: '#0F9F92', bg: '#CCFBF1' },
          { label: 'Con convenio activo', value: loading ? '…' : convenios.filter(c => c.estado === 'ACTIVO').length, color: '#168A5B', bg: '#D1FAE5' },
          { label: 'Postulaciones activas', value: loading ? '…' : empresas.reduce((s, e) => s + (e._count?.postulaciones || 0), 0), color: '#B7791F', bg: '#FEF3C7' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-xl sm:text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#5F6B7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por nombre, rubro o ubicación…"
          />
        </div>
        <div className="flex rounded-lg border overflow-x-auto whitespace-nowrap scrollbar-hide" style={{ borderColor: '#DCE3EA' }}>
          {modalidades.map(m => (
            <button key={m} onClick={() => setModalidad(m)}
              className="px-3 py-2 text-sm font-medium transition-colors"
              style={{ backgroundColor: modalidad === m ? '#152A43' : '#FFFFFF', color: modalidad === m ? '#FFFFFF' : '#5F6B7A' }}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Grid + detail */}
      <div className={`flex flex-col ${selected ? 'lg:grid lg:grid-cols-[1fr_0.45fr]' : ''} gap-6`}>
        {/* Cards */}
        <div className="order-2 lg:order-1">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl border p-5 animate-pulse flex justify-between" style={{ borderColor: '#DCE3EA' }}>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                  </div>
                  <div className="w-20 h-6 bg-gray-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border p-12 flex flex-col items-center" style={{ borderColor: '#DCE3EA' }}>
              <Building2 size={40} style={{ color: '#DCE3EA', marginBottom: 12 }} />
              <p className="text-sm font-medium" style={{ color: '#172033' }}>Sin resultados</p>
              <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>No se encontraron empresas con ese criterio de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filtered.map(e => {
                const conv = convenios.find(c => c.empresaId === e.id);
                const isSelected = selected === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelected(e.id === selected ? null : e.id)}
                    className="bg-white rounded-2xl border p-5 cursor-pointer transition-all hover:shadow-md"
                    style={{ borderColor: isSelected ? '#2563EB' : '#DCE3EA', backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: '#EFF6FF' }}>
                          <Building2 size={18} style={{ color: '#2563EB' }} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm" style={{ color: '#172033' }}>{e.nombre}</div>
                          <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{e.rubro}</div>
                          <div className="flex items-center gap-3 mt-2 text-xs" style={{ color: '#5F6B7A' }}>
                            <span className="flex items-center gap-1"><MapPin size={11} />{e.ubicacion}</span>
                            <span className="flex items-center gap-1"><Globe size={11} />{e.modalidad}</span>
                            <span className="flex items-center gap-1"><Users size={11} />{e.vacantes} vacantes</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {conv && (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{
                              backgroundColor: conv.estado === 'ACTIVO' ? '#D1FAE5' : conv.estado === 'POR_VENCER' ? '#FEF3C7' : '#F3F4F6',
                              color: conv.estado === 'ACTIVO' ? '#168A5B' : conv.estado === 'POR_VENCER' ? '#B7791F' : '#7A8491',
                            }}>
                            Convenio {conv.estado}
                          </span>
                        )}
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                          {e._count?.postulaciones || 0} postulaciones
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selEmpresa && (
          <div className="bg-white rounded-2xl border p-5 space-y-5 order-1 lg:order-2 lg:sticky lg:top-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#EFF6FF' }}>
                <Building2 size={22} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <div className="font-semibold" style={{ color: '#172033' }}>{selEmpresa.nombre}</div>
                <div className="text-xs" style={{ color: '#5F6B7A' }}>{selEmpresa.rubro}</div>
              </div>
            </div>

            <div className="space-y-2">
              {[
                ['Ubicación', selEmpresa.ubicacion],
                ['Modalidad', selEmpresa.modalidad],
                ['Vacantes totales', selEmpresa.vacantes],
                ['Estado', selEmpresa.activo ? 'Activa' : 'Inactiva'],
              ].map(([k, v]) => (
                <div key={String(k)} className="flex justify-between">
                  <span className="text-xs" style={{ color: '#5F6B7A' }}>{k}</span>
                  <span className="text-xs font-medium" style={{ color: '#172033' }}>{v}</span>
                </div>
              ))}
            </div>

            {selConvenios.length > 0 && (
              <div className="border-t pt-4" style={{ borderColor: '#EDF2F7' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#5F6B7A' }}>CONVENIOS ({selConvenios.length})</div>
                <div className="space-y-2">
                  {selConvenios.map(c => (
                    <div key={c.id} className="p-3 rounded-xl border text-xs space-y-1" style={{ backgroundColor: '#F4F7FA', borderColor: '#DCE3EA' }}>
                      <div className="flex justify-between font-semibold" style={{ color: '#172033' }}>
                        <span>{c.codigo}</span>
                        <span style={{ color: c.estado === 'ACTIVO' ? '#168A5B' : '#B7791F' }}>{c.estado}</span>
                      </div>
                      <div style={{ color: '#5F6B7A' }}>Vence: {new Date(c.vencimiento).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Nueva Empresa */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full sm:max-w-md space-y-4 shadow-xl border overflow-y-auto max-h-[90vh]" style={{ borderColor: '#DCE3EA', maxWidth: 'calc(100vw - 32px)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: '#172033' }}>Registrar Nueva Empresa</h2>
              <button onClick={() => setShowModal(false)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#C43D4D' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateEmpresa} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Nombre de la Empresa</label>
                <input required value={formData.nombre} onChange={e => setFormData(p => ({ ...p, nombre: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="ej. TechCorp Perú" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Rubro</label>
                <input required value={formData.rubro} onChange={e => setFormData(p => ({ ...p, rubro: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="ej. Desarrollo de Software" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Ubicación</label>
                <input required value={formData.ubicacion} onChange={e => setFormData(p => ({ ...p, ubicacion: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} placeholder="ej. Av. Floral 123, Puno" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Modalidad</label>
                  <select value={formData.modalidad} onChange={e => setFormData(p => ({ ...p, modalidad: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }}>
                    <option value="Presencial">Presencial</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Remoto">Remoto</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Vacantes</label>
                  <input type="number" min={1} required value={formData.vacantes} onChange={e => setFormData(p => ({ ...p, vacantes: Number(e.target.value) }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg text-sm border font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Guardando…' : 'Crear Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
