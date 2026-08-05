import { useState } from 'react';
import { Calendar, Plus, CheckCircle, Clock } from 'lucide-react';

export default function PeriodosAcademicos() {
  const [periodos, setPeriodos] = useState([
    { codigo: '2026-I', inicio: '15/01/2026', fin: '31/07/2026', estado: 'ACTIVO', estudiantes: 8, esActual: true },
    { codigo: '2025-II', inicio: '15/08/2025', fin: '31/12/2025', estado: 'CERRADO', estudiantes: 14, esActual: false },
    { codigo: '2025-I', inicio: '15/01/2025', fin: '31/07/2025', estado: 'CERRADO', estudiantes: 12, esActual: false },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Periodos académicos</h1>
          <p className="mt-1 text-sm text-slate-500">Gestión de lectivos y calendarios de prácticas preprofesionales.</p>
        </div>
        <button onClick={() => alert('Función para apertura de nuevo periodo académico activa.')}
          className="w-full sm:w-auto justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-600 flex items-center gap-2">
          <Plus size={14} /> Nuevo periodo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {periodos.map(p => (
          <div key={p.codigo} className="p-6 rounded-2xl border bg-white border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-slate-900">Periodo {p.codigo}</div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${p.estado === 'ACTIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                {p.estado}
              </span>
            </div>
            <div className="text-xs text-slate-500 space-y-1">
              <div><strong>Inicio:</strong> {p.inicio}</div>
              <div><strong>Finalización:</strong> {p.fin}</div>
              <div><strong>Estudiantes inscritos:</strong> {p.estudiantes} practicantes</div>
            </div>
            {p.esActual && (
              <div className="pt-2 text-xs font-semibold text-green-600 flex items-center gap-1">
                <CheckCircle size={14} /> Periodo académico vigente
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
