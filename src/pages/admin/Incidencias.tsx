import { useState } from 'react';
import { AlertOctagon, CheckCircle, Clock } from 'lucide-react';

export default function Incidencias() {
  const [incidencias] = useState([
    { id: 'INC-101', titulo: 'Consulta sobre carga de archivo PDF mayor a 5MB', estudiante: 'Diego Flores', estado: 'RESUELTO', prioridad: 'BAJA', fecha: '04/08/2026' },
    { id: 'INC-102', titulo: 'Duda con la validación de horas acumuladas', estudiante: 'Mateo Colque', estado: 'EN_PROCESO', prioridad: 'MEDIA', fecha: '05/08/2026' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Incidencias y tickets de soporte</h1>
        <p className="mt-1 text-sm text-slate-500">Gestión y resolución de reportes técnicos enviados por los usuarios.</p>
      </div>

      <div className="rounded-2xl border bg-white border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left font-semibold text-slate-500">
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Asunto / Incidencia</th>
              <th className="px-4 py-3">Usuario / Solicitante</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {incidencias.map((inc) => (
              <tr key={inc.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold text-slate-900">{inc.id}</td>
                <td className="px-4 py-3 text-slate-700 font-medium">{inc.titulo}</td>
                <td className="px-4 py-3 text-slate-600">{inc.estudiante}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded font-semibold ${inc.prioridad === 'ALTA' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-800'}`}>
                    {inc.prioridad}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">{inc.fecha}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded font-semibold ${inc.estado === 'RESUELTO' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {inc.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
