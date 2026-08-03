import { Clock, Star } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';

const categorias = [
  {
    nombre: 'A. Desempeño profesional',
    criterios: [
      { nombre: 'Calidad del trabajo', puntaje: null },
      { nombre: 'Cumplimiento de tareas', puntaje: null },
      { nombre: 'Capacidad técnica', puntaje: null },
    ],
  },
  {
    nombre: 'B. Habilidades interpersonales',
    criterios: [
      { nombre: 'Comunicación', puntaje: null },
      { nombre: 'Trabajo en equipo', puntaje: null },
      { nombre: 'Adaptabilidad', puntaje: null },
    ],
  },
  {
    nombre: 'C. Responsabilidad',
    criterios: [
      { nombre: 'Puntualidad', puntaje: null },
      { nombre: 'Iniciativa', puntaje: null },
      { nombre: 'Ética profesional', puntaje: null },
    ],
  },
];

export default function MiEvaluacion() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mi evaluación</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Evaluación de desempeño emitida por tu tutor empresarial.</p>
        </div>
        <StatusChip estado="pendiente" />
      </div>

      {/* Status info */}
      <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de la evaluación</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            ['Tutor evaluador', 'Ing. Carlos Medina'],
            ['Empresa', 'AndesTech Solutions'],
            ['Fecha límite', '31 de julio 2026'],
            ['Estado', 'Pendiente'],
          ].map(([k, v]) => (
            <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
              <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
              <div className="text-sm font-medium mt-0.5" style={{ color: '#172033' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending notice */}
      <div className="p-5 rounded-2xl border text-center" style={{ borderColor: '#FDE68A', backgroundColor: '#FFFBEB' }}>
        <Clock size={32} className="mx-auto mb-3" style={{ color: '#B7791F' }} />
        <h2 className="font-semibold mb-1" style={{ color: '#B7791F' }}>Evaluación en espera</h2>
        <p className="text-sm" style={{ color: '#B7791F' }}>
          Tu tutor empresarial aún no ha completado la evaluación de desempeño.
          Recibirás una notificación cuando esté disponible.
        </p>
        <p className="text-xs mt-2" style={{ color: '#B7791F' }}>Fecha límite: 31 de julio 2026</p>
      </div>

      {/* Rubric preview */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Criterios que serán evaluados</h2>
        <div className="space-y-4">
          {categorias.map(cat => (
            <div key={cat.nombre}>
              <h3 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: '#5F6B7A' }}>{cat.nombre}</h3>
              <div className="space-y-2">
                {cat.criterios.map(cr => (
                  <div key={cr.nombre} className="flex items-center justify-between py-2 border-b last:border-0"
                    style={{ borderColor: '#EDF2F7' }}>
                    <span className="text-sm" style={{ color: '#172033' }}>{cr.nombre}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <div key={n} className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                          style={{ backgroundColor: '#F4F7FA', color: '#5F6B7A' }}>{n}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: '#5F6B7A' }}>
          <Star size={12} />
          Escala: 1 = Deficiente · 2 = En desarrollo · 3 = Adecuado · 4 = Destacado · 5 = Excelente
        </div>
      </div>
    </div>
  );
}
