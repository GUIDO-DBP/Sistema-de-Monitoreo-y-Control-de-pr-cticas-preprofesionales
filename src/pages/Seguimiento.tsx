import { useState, useEffect, useCallback } from 'react';
import { Search, AlertCircle, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { api, ApiError } from '../services/api';
import type { SeguimientoEstudianteBackend } from '../types/api';

export default function Seguimiento() {
  const [estudiantes, setEstudiantes] = useState<SeguimientoEstudianteBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchSeguimiento = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get<SeguimientoEstudianteBackend[]>('/seguimiento/estudiantes');
      setEstudiantes(data);
    } catch (err) {
      if (err instanceof ApiError) setError(err.message);
      else setError('Error al cargar la matriz de seguimiento.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSeguimiento();
  }, [fetchSeguimiento]);

  const filtered = estudiantes.filter(e =>
    !search || e.nombre.toLowerCase().includes(search.toLowerCase()) || e.codigo.includes(search) || e.empresa.toLowerCase().includes(search.toLowerCase())
  );

  const conRetraso = estudiantes.filter(e => e.retraso).length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Seguimiento Individual de Practicantes</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Matriz de control individual de horas, documentos y evaluación de desempeño.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchSeguimiento} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      {conRetraso > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
          <AlertTriangle size={16} style={{ color: '#B7791F' }} />
          <span className="text-sm font-medium" style={{ color: '#B7791F' }}>
            Se detectaron {conRetraso} estudiantes con retraso o avance menor al esperado en sus horas de práctica.
          </span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar código, estudiante o empresa…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
        {loading ? (
          <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            Cargando matriz de seguimiento desde PostgreSQL…
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: '#F4F7FA' }}>
                {['Código', 'Estudiante', 'Escuela / Ciclo', 'Empresa Receptora', 'Horas (320h)', 'Documentos', 'Evaluación'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#EDF2F7' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#5F6B7A' }}>{e.codigo}</td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium" style={{ color: '#172033' }}>{e.nombre}</div>
                    <div className="text-xs" style={{ color: '#5F6B7A' }}>{e.email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{e.escuela} · Ciclo {e.ciclo}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: '#172033' }}>{e.empresa}</td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
                        <div className="h-full rounded-full" style={{ width: `${e.porcentajeHoras}%`, backgroundColor: e.retraso ? '#B7791F' : '#168A5B' }} />
                      </div>
                      <span className="font-semibold">{e.horasAprobadas}h</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: '#2563EB' }}>{e.docsProgreso}</td>
                  <td className="px-4 py-3 text-xs">
                    <StatusChip estado={e.evaluacionEstado === 'COMPLETADA' ? 'aprobada' : 'pendiente'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
            No hay practicantes registrados.
          </div>
        )}
      </div>
    </div>
  );
}
