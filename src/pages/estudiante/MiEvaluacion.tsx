import { useState, useEffect, useCallback } from 'react';
import { Star, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';
import { api, ApiError } from '../../services/api';
import type { EvaluacionBackend, CriterioEvaluacionBackend } from '../../types/api';

export default function MiEvaluacion() {
  const [evaluacion, setEvaluacion] = useState<EvaluacionBackend | null>(null);
  const [criterios, setCriterios] = useState<CriterioEvaluacionBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMia = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<{ evaluacion: EvaluacionBackend | null; criterios: CriterioEvaluacionBackend[] }>('/evaluaciones/mia');
      setEvaluacion(data.evaluacion);
      setCriterios(data.criterios);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al consultar tu evaluación de desempeño.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMia();
  }, [fetchMia]);

  if (loading) {
    return (
      <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
        Cargando tu evaluación de desempeño desde el servidor…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
        <div className="flex items-center gap-2">
          <AlertCircle size={16} />
          {error}
        </div>
        <button onClick={fetchMia} className="flex items-center gap-1 text-xs font-semibold underline">
          <RefreshCw size={12} /> Reintentar
        </button>
      </div>
    );
  }

  if (!evaluacion) {
    return (
      <div className="bg-white rounded-2xl border p-12 text-center max-w-xl mx-auto" style={{ borderColor: '#DCE3EA' }}>
        <Star size={48} style={{ color: '#DCE3EA', margin: '0 auto 12px' }} />
        <h2 className="text-lg font-semibold mb-1" style={{ color: '#172033' }}>No tienes evaluaciones registradas</h2>
        <p className="text-sm" style={{ color: '#5F6B7A' }}>Tu tutor empresarial aún no ha generado tu ficha de evaluación de prácticas.</p>
      </div>
    );
  }

  const appEstado = evaluacion.estado === 'COMPLETADA' ? 'aprobada' : evaluacion.estado === 'EN_PROCESO' ? 'en_revision' : 'pendiente';

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold" style={{ color: '#172033' }}>Mi Evaluación de Desempeño</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Resultados de la rúbrica cuantitativa evaluada por tu tutor empresarial.</p>
        </div>
        <div className="self-start sm:self-auto">
          <StatusChip estado={appEstado} />
        </div>
      </div>

      {/* Global Grade Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: '#DCE3EA' }}>
        <div>
          <span className="text-xs font-semibold" style={{ color: '#5F6B7A' }}>NOTA GLOBAL DE DESEMPEÑO</span>
          <div className="text-3xl sm:text-4xl font-bold mt-1" style={{ color: '#2563EB' }}>
            {evaluacion.resultado ? `${evaluacion.resultado.toFixed(2)} / 5.0` : 'En proceso'}
          </div>
          <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>Tutor: {evaluacion.tutor?.usuario?.nombre || 'Ing. Carlos Medina'}</p>
        </div>
        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center self-start sm:self-auto" style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
          <Star className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
      </div>

      {/* Criterios list */}
      <div className="bg-white p-6 rounded-2xl border space-y-4" style={{ borderColor: '#DCE3EA' }}>
        <h3 className="font-semibold text-base" style={{ color: '#172033' }}>Desglose por Criterios</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {criterios.map(c => {
            const detalle = evaluacion.detalles?.find(d => d.criterioId === c.id);
            const puntaje = detalle ? detalle.puntaje : 0;

            return (
              <div key={c.id} className="p-4 rounded-xl border space-y-2" style={{ borderColor: '#EDF2F7', backgroundColor: '#FAFAFA' }}>
                <div className="flex justify-between items-center text-sm font-medium" style={{ color: '#172033' }}>
                  <span>{c.nombre}</span>
                  <span className="font-bold text-blue-600">{puntaje ? `${puntaje} / 5` : '—'}</span>
                </div>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>{c.descripcion}</p>
                <div className="w-full h-2 rounded-full overflow-hidden bg-gray-200">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${(puntaje / 5) * 100}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border bg-white" style={{ borderColor: '#A7F3D0', backgroundColor: '#F0FDF4' }}>
          <h4 className="text-xs font-bold mb-2" style={{ color: '#168A5B' }}>FORTALEZAS DESTACADAS</h4>
          <p className="text-sm" style={{ color: '#172033' }}>{evaluacion.fortalezas || 'No se registraron comentarios específicos.'}</p>
        </div>
        <div className="p-4 sm:p-5 rounded-2xl border bg-white" style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
          <h4 className="text-xs font-bold mb-2" style={{ color: '#B7791F' }}>ASPECTOS POR MEJORAR</h4>
          <p className="text-sm" style={{ color: '#172033' }}>{evaluacion.aspectosMejorar || 'No se registraron recomendaciones específicas.'}</p>
        </div>
      </div>
    </div>
  );
}
