import { useState, useEffect, useCallback } from 'react';
import { Plus, CheckCircle, Clock, AlertCircle, RefreshCw, Trash2, X } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';
import { api, ApiError } from '../../services/api';
import type { ResumenHorasBackend, PostulacionBackend } from '../../types/api';

export default function MisHoras() {
  const [data, setData] = useState<ResumenHorasBackend | null>(null);
  const [postulacion, setPostulacion] = useState<PostulacionBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal para nueva hora
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    horaEntrada: '08:00',
    horaSalida: '16:00',
    minutosPausa: 60,
    actividad: 'Desarrollo y pruebas de módulos de la aplicación',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [horasRes, postRes] = await Promise.all([
        api.get<ResumenHorasBackend>('/horas/mias'),
        api.get<PostulacionBackend[]>('/postulaciones'),
      ]);
      setData(horasRes);
      if (Array.isArray(postRes) && postRes.length > 0) {
        setPostulacion(postRes[0]);
      }
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar tus registros de horas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateHora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postulacion) {
      setFormError('No tienes una postulación activa vinculada.');
      return;
    }
    setFormError('');
    setSaving(true);
    try {
      await api.post('/horas', {
        postulacionId: postulacion.id,
        fecha: form.fecha,
        horaEntrada: form.horaEntrada,
        horaSalida: form.horaSalida,
        minutosPausa: Number(form.minutosPausa),
        actividad: form.actividad,
      });
      setShowModal(false);
      fetchData();
    } catch (err) {
      if (err instanceof ApiError) setFormError(err.message);
      else setFormError('Error al guardar el registro de horas.');
    } finally {
      setSaving(false);
    }
  };

  const handleEliminar = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este registro pendiente?')) return;
    try {
      await api.delete(`/horas/${id}`);
      fetchData();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al eliminar registro.');
    }
  };

  const resumen = data?.resumen || { acumuladas: 0, meta: 320, aprobadas: 0, pendientes: 0, observadas: 0, porcentaje: 0 };
  const registros = data?.registros || [];

  if (loading) {
    return (
      <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
        Cargando tu progreso de horas desde la API…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Mis Horas de Práctica</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Registra tus jornadas diarias de práctica para completar tu meta de 320 horas.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          style={{ backgroundColor: '#2563EB' }}>
          <Plus size={16} /> Registrar Jornada
        </button>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchData} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border space-y-4" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold" style={{ color: '#5F6B7A' }}>AVANCE GENERAL</span>
            <div className="text-3xl font-bold mt-1" style={{ color: '#172033' }}>
              {resumen.aprobadas} <span className="text-base font-normal" style={{ color: '#5F6B7A' }}>/ 320 horas aprobadas</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: '#2563EB' }}>{resumen.porcentaje}%</span>
            <div className="text-xs" style={{ color: '#5F6B7A' }}>Completado</div>
          </div>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${resumen.porcentaje}%`, backgroundColor: '#2563EB' }} />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Fecha', 'Entrada - Salida', 'Pausa', 'Horas Netas', 'Actividad', 'Estado', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold whitespace-nowrap" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {registros.map(r => {
                const appEstado = r.estado === 'APROBADA' ? 'aprobada' : r.estado === 'OBSERVADA' ? 'observada' : 'pendiente';

                return (
                  <tr key={r.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                    <td className="px-4 py-3 text-sm font-medium whitespace-nowrap" style={{ color: '#172033' }}>{new Date(r.fecha).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-xs font-mono whitespace-nowrap" style={{ color: '#5F6B7A' }}>{r.horaEntrada} - {r.horaSalida}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#5F6B7A' }}>{r.minutosPausa} min</td>
                    <td className="px-4 py-3 text-xs font-bold whitespace-nowrap" style={{ color: '#2563EB' }}>{r.horasRegistradas}h</td>
                    <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: '#5F6B7A' }}>{r.actividad}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusChip estado={appEstado} /></td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.estado === 'PENDIENTE' && (
                        <button onClick={() => handleEliminar(r.id)} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Eliminar registro">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y" style={{ borderColor: '#EDF2F7' }}>
          {registros.map(r => {
            const appEstado = r.estado === 'APROBADA' ? 'aprobada' : r.estado === 'OBSERVADA' ? 'observada' : 'pendiente';
            return (
              <div key={r.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="font-medium text-sm" style={{ color: '#172033' }}>
                      {new Date(r.fecha).toLocaleDateString()}
                    </div>
                    <div className="text-xs font-mono mt-0.5" style={{ color: '#5F6B7A' }}>
                      {r.horaEntrada} - {r.horaSalida}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusChip estado={appEstado} />
                    {r.estado === 'PENDIENTE' && (
                      <button onClick={() => handleEliminar(r.id)} className="p-1 text-red-500 hover:bg-red-50 rounded bg-red-50" title="Eliminar registro">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="text-xs space-y-1.5 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  <div className="flex justify-between">
                    <span style={{ color: '#5F6B7A' }}>Pausa:</span>
                    <span style={{ color: '#172033' }}>{r.minutosPausa} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#5F6B7A' }}>Horas Netas:</span>
                    <span className="font-bold" style={{ color: '#2563EB' }}>{r.horasRegistradas}h</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#5F6B7A' }}>Actividad Realizada</div>
                  <div className="text-xs leading-relaxed" style={{ color: '#172033' }}>{r.actividad}</div>
                </div>
              </div>
            );
          })}
        </div>

        {registros.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Aún no has registrado jornadas de práctica.
          </div>
        )}
      </div>

      {/* Modal Registrar Hora */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4 border shadow-xl" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg" style={{ color: '#172033' }}>Registrar Jornada Diaria</h3>
              <button onClick={() => setShowModal(false)} style={{ color: '#5F6B7A' }}><X size={18} /></button>
            </div>

            {formError && (
              <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: '#FEE2E2', color: '#C43D4D' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleCreateHora} className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Fecha de la Jornada</label>
                <input type="date" required value={form.fecha} onChange={e => setForm(p => ({ ...p, fecha: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Hora Entrada</label>
                  <input type="time" required value={form.horaEntrada} onChange={e => setForm(p => ({ ...p, horaEntrada: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Hora Salida</label>
                  <input type="time" required value={form.horaSalida} onChange={e => setForm(p => ({ ...p, horaSalida: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Minutos de Pausa / Almuerzo</label>
                <input type="number" min={0} max={240} required value={form.minutosPausa} onChange={e => setForm(p => ({ ...p, minutosPausa: Number(e.target.value) }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none" style={{ borderColor: '#DCE3EA' }} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Actividades Realizadas</label>
                <textarea required rows={3} value={form.actividad} onChange={e => setForm(p => ({ ...p, actividad: e.target.value }))}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none" style={{ borderColor: '#DCE3EA' }} placeholder="Describe brevemente tus tareas…" />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 rounded-lg border text-sm font-medium" style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>Cancelar</button>
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#2563EB' }}>
                  {saving ? 'Guardando…' : 'Guardar Jornada'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
