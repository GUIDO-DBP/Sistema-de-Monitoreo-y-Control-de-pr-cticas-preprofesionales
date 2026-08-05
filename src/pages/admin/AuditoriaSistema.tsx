import { useState } from 'react';
import { Key, Filter, Search } from 'lucide-react';

export default function AuditoriaSistema() {
  const [logs] = useState([
    { fecha: '05/08/2026 08:31:12', usuario: 'Coord. Carlos Ramos', rol: 'COORDINADOR', accion: 'APROBAR_POSTULACION', entidad: 'Postulacion (SMCPP-2026-048)', ip: '192.168.1.45', resultado: 'EXITO' },
    { fecha: '05/08/2026 08:25:04', usuario: 'Ing. Carlos Medina', rol: 'TUTOR', accion: 'VALIDAR_HORA', entidad: 'RegistroHora (7h Ana Torres)', ip: '190.235.12.8', resultado: 'EXITO' },
    { fecha: '05/08/2026 08:10:50', usuario: 'Ana Torres Mamani', rol: 'ESTUDIANTE', accion: 'SUBIR_DOCUMENTO', entidad: 'Documento (Solicitud PPP)', ip: '179.6.195.12', resultado: 'EXITO' },
    { fecha: '05/08/2026 07:45:22', usuario: 'Administrador General', rol: 'ADMINISTRADOR', accion: 'LOGIN', entidad: 'Usuario (admin@unap.edu.pe)', ip: '127.0.0.1', resultado: 'EXITO' },
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Auditoría del sistema</h1>
        <p className="mt-1 text-sm text-slate-500">Registro histórico e inmutable de operaciones y eventos de seguridad.</p>
      </div>

      <div className="rounded-2xl border bg-white border-slate-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left font-semibold text-slate-500">
              <th className="px-4 py-3">Fecha y Hora</th>
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Acción</th>
              <th className="px-4 py-3">Entidad / Detalle</th>
              <th className="px-4 py-3">Dirección IP</th>
              <th className="px-4 py-3">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-500 font-mono">{l.fecha}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{l.usuario}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">{l.rol}</span></td>
                <td className="px-4 py-3 font-mono font-bold text-blue-600">{l.accion}</td>
                <td className="px-4 py-3 text-slate-600">{l.entidad}</td>
                <td className="px-4 py-3 font-mono text-slate-500">{l.ip}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded bg-green-100 text-green-800 font-semibold">{l.resultado}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
