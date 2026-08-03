import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, FileText, ChevronRight, RefreshCw, Plus } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';
import { api, ApiError } from '../../services/api';
import type { PostulacionBackend } from '../../types/api';

export default function MiPostulacion() {
  const navigate = useNavigate();
  const [postulacion, setPostulacion] = useState<PostulacionBackend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<PostulacionBackend[]>('/postulaciones')
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          setPostulacion(res[0]);
        }
      })
      .catch(err => {
        if (err instanceof ApiError) setError(err.message);
        else setError('Error al consultar tu postulación.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
        Cargando tu postulación desde el backend…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
      </div>
    );
  }

  if (!postulacion) {
    return (
      <div className="bg-white rounded-2xl border p-12 flex flex-col items-center max-w-xl mx-auto text-center" style={{ borderColor: '#DCE3EA' }}>
        <FileText size={48} style={{ color: '#DCE3EA', marginBottom: 12 }} />
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#172033' }}>No tienes postulaciones activas</h2>
        <p className="text-sm mb-6" style={{ color: '#5F6B7A' }}>Aún no has registrado ninguna solicitud de práctica preprofesional.</p>
        <button
          onClick={() => navigate('/mi-postulacion/nueva')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm"
          style={{ backgroundColor: '#2563EB' }}>
          <Plus size={16} /> Registrar nueva postulación
        </button>
      </div>
    );
  }

  const appEstado = postulacion.estado === 'APROBADA' ? 'aprobada' :
    postulacion.estado === 'EN_REVISION' ? 'en_revision' :
    postulacion.estado === 'OBSERVADA' ? 'observada' :
    postulacion.estado === 'RECHAZADA' ? 'rechazada' : 'pendiente';

  const estUser = postulacion.estudiante?.usuario;
  const empNombre = postulacion.empresa?.nombre || '—';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mi postulación</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Estado y avance de tu proceso de prácticas preprofesionales.</p>
        </div>
        <StatusChip estado={appEstado} />
      </div>

      {/* Empresa info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Empresa y práctica</h2>
          <div className="space-y-2">
            {[
              ['Código', postulacion.codigo],
              ['Empresa', empNombre],
              ['Área', postulacion.area],
              ['Modalidad', postulacion.modalidad],
              ['Horas semanales', `${postulacion.horasSemanales} horas`],
              ['Fecha de inicio', postulacion.fechaInicio ? new Date(postulacion.fechaInicio).toLocaleDateString() : 'Por definir'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <span className="text-xs" style={{ color: '#5F6B7A' }}>{k}</span>
                <span className="text-xs font-medium text-right" style={{ color: '#172033' }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <h2 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Contactos asignados</h2>
          <div className="space-y-3">
            {[
              { rol: 'Coordinador de prácticas', nombre: postulacion.responsable?.nombre || 'Coord. Carlos Ramos', color: '#2563EB' },
              { rol: 'Tutor empresarial', nombre: postulacion.tutor?.usuario?.nombre || 'Ing. Carlos Medina', color: '#0F9F92' },
            ].map(c => (
              <div key={c.rol} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                  style={{ backgroundColor: c.color }}>
                  {c.nombre.slice(0, 2)}
                </div>
                <div>
                  <div className="text-xs font-medium" style={{ color: '#172033' }}>{c.nombre}</div>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>{c.rol}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/notificaciones')}
            className="mt-4 w-full py-2 rounded-lg border text-xs font-medium transition-colors hover:bg-gray-50"
            style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
            Contactar al coordinador
          </button>
        </div>
      </div>

      {/* Incidencias / Observaciones */}
      {postulacion.observaciones && (
        <div className="p-5 rounded-2xl border" style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
          <h2 className="text-sm font-semibold mb-2" style={{ color: '#B7791F' }}>Observaciones recibidas</h2>
          <div className="flex items-start gap-2">
            <AlertCircle size={14} style={{ color: '#B7791F', marginTop: 2 }} />
            <p className="text-sm" style={{ color: '#B7791F' }}>{postulacion.observaciones}</p>
          </div>
        </div>
      )}
    </div>
  );
}
