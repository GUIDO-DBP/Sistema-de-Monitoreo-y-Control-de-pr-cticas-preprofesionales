import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, ChevronRight, AlertCircle, RefreshCw, Plus, X } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { ConvenioBackend, EmpresaBackend } from '../types/api';

export default function Convenios() {
  const [convenios, setConvenios] = useState<ConvenioBackend[]>([]);
  const [empresas, setEmpresas] = useState<EmpresaBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<'tabla' | 'mapa'>('tabla');
  const [selected, setSelected] = useState<string | null>(null);

  // Modal Nuevo Convenio
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    codigo: '',
    empresaId: '',
    rubro: 'Tecnología de la Información',
    inicio: new Date().toISOString().split('T')[0],
    vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    vacantes: 5,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [convRes, empRes] = await Promise.all([
        api.get<ConvenioBackend[]>('/convenios'),
        api.get<EmpresaBackend[]>('/empresas'),
      ]);
      setConvenios(convRes);
      setEmpresas(empRes);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Error al cargar la lista de convenios.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateConvenio = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      await api.post<ConvenioBackend>('/convenios', {
        codigo: formData.codigo,
        empresaId: formData.empresaId,
        rubro: formData.rubro,
        inicio: new Date(formData.inicio).toISOString(),
        vencimiento: new Date(formData.vencimiento).toISOString(),
        vacantes: Number(formData.vacantes),
      });
      setShowModal(false);
      setFormData({
        codigo: '',
        empresaId: '',
        rubro: 'Tecnología de la Información',
        inicio: new Date().toISOString().split('T')[0],
        vencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vacantes: 5,
      });
      fetchData();
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.message);
      } else {
        setFormError('Error al registrar el convenio.');
      }
    } finally {
      setSaving(false);
    }
  };

  const porVencer = convenios.filter(c => c.estado === 'POR_VENCER').length;
  const sel = convenios.find(c => c.id === selected);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Convenios</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Gestiona los acuerdos institucionales vigentes con empresas.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
            {[{ v: 'tabla', label: 'Tabla' }, { v: 'mapa', label: 'Mapa de relaciones' }].map(({ v, label }) => (
              <button key={v} onClick={() => setView(v as 'tabla' | 'mapa')}
                className="px-4 py-2 text-sm font-medium transition-colors"
                style={{ backgroundColor: view === v ? '#152A43' : '#FFFFFF', color: view === v ? '#FFFFFF' : '#5F6B7A' }}>
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            style={{ backgroundColor: '#2563EB' }}>
            <Plus size={14} /> Nuevo convenio
          </button>
        </div>
      </div>

      {/* Error Alert */}
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

      {porVencer > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border"
          style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
          <AlertTriangle size={16} style={{ color: '#B7791F' }} />
          <span className="text-sm font-medium" style={{ color: '#B7791F' }}>
            {porVencer} convenios vencen durante los próximos 30 días. Inicia el proceso de renovación.
          </span>
          <button className="ml-auto text-sm font-semibold" style={{ color: '#B7791F' }}>
            Revisar <ChevronRight size={13} className="inline" />
          </button>
        </div>
      )}

      {view === 'tabla' && (
        <div className="grid gap-6" style={{ gridTemplateColumns: selected ? '1fr 0.5fr' : '1fr' }}>
          <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
            {loading ? (
              <div className="p-8 text-center text-sm" style={{ color: '#5F6B7A' }}>
                Cargando convenios desde la API…
              </div>
            ) : convenios.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: '#5F6B7A' }}>
                No hay convenios registrados.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    {['Código', 'Empresa', 'Rubro', 'Inicio', 'Vencimiento', 'Vacantes', 'Est. activos', 'Estado'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {convenios.map(c => {
                    const empresaNombre = c.empresa?.nombre || '—';
                    const appEstado = c.estado === 'ACTIVO' ? 'activo' : c.estado === 'POR_VENCER' ? 'por_vencer' : 'suspendido';
                    return (
                      <tr key={c.id}
                        onClick={() => setSelected(c.id === selected ? null : c.id)}
                        className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                        style={{ borderColor: '#EDF2F7', backgroundColor: selected === c.id ? '#EFF6FF' : undefined }}>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: '#5F6B7A' }}>{c.codigo}</td>
                        <td className="px-4 py-3 text-sm font-medium" style={{ color: '#172033' }}>{empresaNombre}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{c.rubro}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{new Date(c.inicio).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: c.estado === 'POR_VENCER' ? '#B7791F' : '#5F6B7A', fontWeight: c.estado === 'POR_VENCER' ? 600 : 400 }}>
                          {new Date(c.vencimiento).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-center" style={{ color: '#5F6B7A' }}>{c.vacantes}</td>
                        <td className="px-4 py-3 text-xs text-center" style={{ color: '#5F6B7A' }}>{c.estudiantesActivos}</td>
                        <td className="px-4 py-3"><StatusChip estado={appEstado} /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {sel && (
            <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: '#DCE3EA' }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-mono" style={{ color: '#5F6B7A' }}>{sel.codigo}</div>
                  <h3 className="font-semibold mt-0.5" style={{ color: '#172033' }}>{sel.empresa?.nombre || '—'}</h3>
                </div>
                <StatusChip estado={sel.estado === 'ACTIVO' ? 'activo' : 'por_vencer'} />
              </div>
              <div className="space-y-2">
                {[
                  ['Rubro', sel.rubro],
                  ['Inicio', new Date(sel.inicio).toLocaleDateString()],
                  ['Vencimiento', new Date(sel.vencimiento).toLocaleDateString()],
                  ['Vacantes totales', sel.vacantes],
                  ['Estudiantes activos', sel.estudiantesActivos],
                ].map(([k, v]) => (
                  <div key={String(k)} className="flex justify-between">
                    <span className="text-xs" style={{ color: '#5F6B7A' }}>{k}</span>
                    <span className="text-xs font-medium" style={{ color: '#172033' }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {view === 'mapa' && (
        <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Mapa de relaciones de convenios</h2>
          <div className="relative" style={{ height: 420 }}>
            <svg width="100%" height="100%" viewBox="0 0 800 400">
              <circle cx="400" cy="200" r="30" fill="#152A43" />
              <text x="400" y="195" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">SMCPP</text>
              <text x="400" y="208" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">Backend</text>

              {convenios.map((c, i) => {
                const angle = (i / Math.max(convenios.length, 1)) * 2 * Math.PI - Math.PI / 2;
                const r = 150;
                const x = 400 + r * Math.cos(angle);
                const y = 200 + r * Math.sin(angle);
                const nodeR = 18 + c.estudiantesActivos * 3;
                const empNombre = c.empresa?.nombre || 'Empresa';
                return (
                  <g key={c.id}>
                    <line x1="400" y1="200" x2={x} y2={y}
                      stroke={c.estado === 'POR_VENCER' ? '#B7791F' : '#DCE3EA'} strokeWidth="1.5"
                      strokeDasharray={c.estado === 'POR_VENCER' ? '4,4' : undefined} />
                    <circle cx={x} cy={y} r={nodeR}
                      fill={c.estado === 'ACTIVO' ? '#EFF6FF' : '#FFFBEB'}
                      stroke={c.estado === 'POR_VENCER' ? '#B7791F' : '#2563EB'} strokeWidth="1.5" />
                    <text x={x} y={y - 2} textAnchor="middle" fontSize="9" fontWeight="600" fill="#172033">
                      {empNombre.split(' ')[0]}
                    </text>
                    <text x={x} y={y + 9} textAnchor="middle" fontSize="8" fill="#5F6B7A">
                      {c.estudiantesActivos} est.
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* Modal Nuevo Convenio */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl border" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: '#172033' }}>Registrar Nuevo Convenio</h2>
              <button onClick={() => setShowModal(false)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#C43D4D' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateConvenio} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Código de Convenio</label>
                <input required value={formData.codigo} onChange={e => setFormData(p => ({ ...p, codigo: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none font-mono" style={{ borderColor: '#DCE3EA' }} placeholder="ej. CONV-2026-002" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Empresa Receptora</label>
                <select required value={formData.empresaId} onChange={e => setFormData(p => ({ ...p, empresaId: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }}>
                  <option value="">Seleccionar empresa…</option>
                  {empresas.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Rubro</label>
                <input required value={formData.rubro} onChange={e => setFormData(p => ({ ...p, rubro: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Fecha Inicio</label>
                  <input type="date" required value={formData.inicio} onChange={e => setFormData(p => ({ ...p, inicio: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Fecha Vencimiento</label>
                  <input type="date" required value={formData.vencimiento} onChange={e => setFormData(p => ({ ...p, vencimiento: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Vacantes Requeridas</label>
                <input type="number" min={1} required value={formData.vacantes} onChange={e => setFormData(p => ({ ...p, vacantes: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg text-sm border font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB', opacity: saving ? 0.7 : 1 }}>
                  {saving ? 'Guardando…' : 'Crear Convenio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
