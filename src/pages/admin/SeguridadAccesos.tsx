import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SeguridadAccesos() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Seguridad y accesos</h1>
        <p className="mt-1 text-sm text-slate-500">Políticas de seguridad, control de sesiones y monitoreo de intentos de acceso.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">Intentos Fallidos Recientes</div>
          <div className="text-2xl font-bold text-slate-900">0</div>
          <div className="text-xs text-green-600">Sin bloqueos por fuerza bruta</div>
        </div>
        <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">Sesiones JWT Activas</div>
          <div className="text-2xl font-bold text-slate-900">4</div>
          <div className="text-xs text-blue-600">Expiración automática: 8 horas</div>
        </div>
        <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-2">
          <div className="text-xs font-semibold text-slate-500">Algoritmo de Hash Password</div>
          <div className="text-2xl font-bold text-slate-900">Bcrypt</div>
          <div className="text-xs text-slate-500">Factor de costo: 12 salt rounds</div>
        </div>
      </div>

      <div className="p-6 rounded-2xl border bg-white border-slate-200 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Políticas institucionales activas</h2>
        <div className="space-y-3 text-sm">
          {[
            ['Expiración de Tokens JWT', '8 Horas de validez continua'],
            ['Formato de contraseñas obligatorias', 'Mínimo 8 caracteres, números y caracteres especiales'],
            ['Control de CORS en API Backend', 'Permitido exclusivamente desde dominios configurados'],
            ['Sanetizado contra SQL Injection', 'Habilitado vía ORM Prisma (queries parametrizadas)'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center border-b pb-2 border-slate-100">
              <span className="text-slate-700 font-medium">{k}</span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-green-100 text-green-800">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
