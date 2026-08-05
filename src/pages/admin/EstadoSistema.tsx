import { Activity, Server, Database, CheckCircle2 } from 'lucide-react';

export default function EstadoSistema() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Estado del sistema</h1>
        <p className="mt-1 text-sm text-slate-500">Métricas de rendimiento, servicios y disponibilidad técnica del SMCPP.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Server className="text-blue-600" size={20} /> Servidor API Backend (Express + Node.js)
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Estado service:</span><span className="font-semibold text-green-600">OK (HTTP 200)</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Puerto de escucha:</span><span className="font-mono">127.0.0.1:3001</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Latencia API:</span><span className="font-mono">~ 4 ms</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Versión SMCPP:</span><span className="font-mono">v1.0.0-production</span></div>
          </div>
        </div>

        <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <Database className="text-emerald-600" size={20} /> Base de Datos (PostgreSQL 16)
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Estado servidor:</span><span className="font-semibold text-green-600">CONECTADO</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Host & Puerto:</span><span className="font-mono">127.0.0.1:5432</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Pool de conexiones:</span><span className="font-mono">13 activas / Prisma ORM</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Última migración:</span><span className="font-mono">20260803_init (100% aplicada)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
