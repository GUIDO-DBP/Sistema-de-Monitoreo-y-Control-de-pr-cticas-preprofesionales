import { useState } from 'react';
import { FileText, Edit2 } from 'lucide-react';

export default function RequisitosDocumentarios() {
  const [reqs, setReqs] = useState([
    { nombre: 'Solicitud de prácticas', formato: 'PDF', maxSize: '5 MB', obligatorio: true, desc: 'Solicitud formal dirigida a la Facultad' },
    { nombre: 'Carta de presentación', formato: 'PDF', maxSize: '5 MB', obligatorio: true, desc: 'Carta emitida por la Facultad para la empresa' },
    { nombre: 'Currículum vitae', formato: 'PDF', maxSize: '10 MB', obligatorio: true, desc: 'CV documentado del estudiante' },
    { nombre: 'Constancia académica', formato: 'PDF', maxSize: '5 MB', obligatorio: true, desc: 'Constancia de notas o récord académico' },
    { nombre: 'Plan de actividades', formato: 'PDF', maxSize: '5 MB', obligatorio: true, desc: 'Plan detallado firmado por el tutor' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Requisitos documentarios</h1>
        <p className="mt-1 text-sm text-slate-500">Parámetros y especificaciones de documentos requeridos para las prácticas.</p>
      </div>

      <div className="rounded-2xl border bg-white border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-xs font-semibold text-slate-500">
              <th className="px-6 py-3">Documento</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3">Formato</th>
              <th className="px-4 py-3">Tamaño Máx.</th>
              <th className="px-4 py-3">Obligatoriedad</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {reqs.map((r, i) => (
              <tr key={r.nombre} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" /> {r.nombre}
                </td>
                <td className="px-4 py-4 text-xs text-slate-600">{r.desc}</td>
                <td className="px-4 py-4 text-xs font-mono">{r.formato}</td>
                <td className="px-4 py-4 text-xs">{r.maxSize}</td>
                <td className="px-4 py-4">
                  <span className="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 font-semibold">Obligatorio</span>
                </td>
                <td className="px-4 py-4">
                  <button onClick={() => alert(`Editar parámetro del documento: ${r.nombre}`)} className="p-1.5 rounded hover:bg-slate-100 text-slate-600">
                    <Edit2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
