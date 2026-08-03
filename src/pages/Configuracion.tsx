import { useState } from 'react';
import { Settings, Bell, Clock, FileText, Shield, Save, CheckCircle } from 'lucide-react';

type Section = 'periodo' | 'notificaciones' | 'horas' | 'documentos' | 'seguridad';

const sections: Array<{ key: Section; label: string; icon: React.ReactNode }> = [
  { key: 'periodo', label: 'Periodo académico', icon: <Settings size={16} /> },
  { key: 'notificaciones', label: 'Notificaciones', icon: <Bell size={16} /> },
  { key: 'horas', label: 'Control de horas', icon: <Clock size={16} /> },
  { key: 'documentos', label: 'Documentos', icon: <FileText size={16} /> },
  { key: 'seguridad', label: 'Seguridad y acceso', icon: <Shield size={16} /> },
];

export default function Configuracion() {
  const [activeSection, setActiveSection] = useState<Section>('periodo');
  const [saved, setSaved] = useState(false);

  // State for each section
  const [periodo, setPeriodo] = useState({
    nombre: '2026-I',
    fechaInicio: '2026-03-01',
    fechaFin: '2026-08-31',
    estado: 'activo',
    horasMinimas: '240',
    horasMaximas: '480',
  });

  const [notifs, setNotifs] = useState({
    alertasConvenio: true,
    recordatorioHoras: true,
    nuevoDocumento: true,
    evaluaciones: true,
    postulaciones: true,
    diasAntesVencimiento: '15',
  });

  const [horas, setHoras] = useState({
    horasSemana: '30',
    toleranciaDias: '3',
    requiereEvidencia: true,
    aprobacionTutor: true,
    requiereComentario: false,
  });

  const [docs, setDocs] = useState({
    versionamiento: true,
    formatosPermitidos: 'PDF, DOCX',
    tamanoMaxMB: '10',
    plazoRevision: '5',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Configuración</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Parámetros del sistema SMCPP para el periodo académico vigente.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ backgroundColor: saved ? '#168A5B' : '#2563EB', color: '#FFFFFF' }}>
          {saved ? <CheckCircle size={14} /> : <Save size={14} />}
          {saved ? 'Cambios guardados' : 'Guardar cambios'}
        </button>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: '220px 1fr' }}>
        {/* Sidebar nav */}
        <div className="bg-white rounded-2xl border p-3 h-fit" style={{ borderColor: '#DCE3EA' }}>
          {sections.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveSection(s.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg mb-0.5 text-sm font-medium text-left transition-all"
              style={{
                backgroundColor: activeSection === s.key ? 'rgba(37,99,235,0.1)' : 'transparent',
                color: activeSection === s.key ? '#2563EB' : '#5F6B7A',
              }}>
              {s.icon}
              {s.label}
            </button>
          ))}
        </div>

        {/* Content panels */}
        <div className="bg-white rounded-2xl border p-6 space-y-6" style={{ borderColor: '#DCE3EA' }}>

          {activeSection === 'periodo' && (
            <>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Periodo académico</h2>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Configura el periodo académico activo del sistema.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Nombre del periodo</label>
                  <input value={periodo.nombre} onChange={e => setPeriodo(p => ({ ...p, nombre: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Estado del periodo</label>
                  <select value={periodo.estado} onChange={e => setPeriodo(p => ({ ...p, estado: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }}>
                    <option value="activo">Activo</option>
                    <option value="cerrado">Cerrado</option>
                    <option value="planificacion">En planificación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Fecha de inicio</label>
                  <input type="date" value={periodo.fechaInicio} onChange={e => setPeriodo(p => ({ ...p, fechaInicio: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Fecha de cierre</label>
                  <input type="date" value={periodo.fechaFin} onChange={e => setPeriodo(p => ({ ...p, fechaFin: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Horas mínimas requeridas</label>
                  <input type="number" value={periodo.horasMinimas} onChange={e => setPeriodo(p => ({ ...p, horasMinimas: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Horas máximas permitidas</label>
                  <input type="number" value={periodo.horasMaximas} onChange={e => setPeriodo(p => ({ ...p, horasMaximas: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                </div>
              </div>
              <div className="p-4 rounded-xl border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                <p className="text-xs font-medium" style={{ color: '#B7791F' }}>
                  ⚠ Cambiar el estado del periodo afecta a todos los flujos activos. Asegúrate de notificar a los coordinadores antes de cerrarlo.
                </p>
              </div>
            </>
          )}

          {activeSection === 'notificaciones' && (
            <>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Notificaciones del sistema</h2>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Controla qué eventos generan alertas automáticas.</p>
              </div>
              <div className="space-y-4">
                {[
                  { key: 'alertasConvenio', label: 'Alertas de convenios próximos a vencer', desc: 'Notificar cuando un convenio vence pronto.' },
                  { key: 'recordatorioHoras', label: 'Recordatorio de registro semanal de horas', desc: 'Notificar al estudiante cada semana.' },
                  { key: 'nuevoDocumento', label: 'Nuevo documento subido', desc: 'Notificar al coordinador cuando se sube un archivo.' },
                  { key: 'evaluaciones', label: 'Evaluaciones pendientes', desc: 'Alertar sobre evaluaciones próximas a vencer.' },
                  { key: 'postulaciones', label: 'Cambios en postulaciones', desc: 'Notificar cambios de estado al estudiante.' },
                ].map(opt => (
                  <div key={opt.key} className="flex items-start justify-between py-3 border-b" style={{ borderColor: '#EDF2F7' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#172033' }}>{opt.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{opt.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [opt.key]: !n[opt.key as keyof typeof n] }))}
                      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0 ml-4"
                      style={{ backgroundColor: notifs[opt.key as keyof typeof notifs] ? '#2563EB' : '#DCE3EA' }}>
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-white top-0.5 transition-all"
                        style={{ left: notifs[opt.key as keyof typeof notifs] ? 'calc(100% - 18px)' : '3px' }} />
                    </button>
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>
                    Días de anticipación para alertas de vencimiento
                  </label>
                  <input type="number" min={1} max={60}
                    value={notifs.diasAntesVencimiento}
                    onChange={e => setNotifs(n => ({ ...n, diasAntesVencimiento: e.target.value }))}
                    className="w-32 px-3 py-2 text-sm rounded-lg border outline-none"
                    style={{ borderColor: '#DCE3EA' }} />
                  <span className="text-xs ml-2" style={{ color: '#5F6B7A' }}>días antes del vencimiento</span>
                </div>
              </div>
            </>
          )}

          {activeSection === 'horas' && (
            <>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Control de horas</h2>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Parámetros para el registro y validación de horas.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Horas máximas por semana</label>
                    <input type="number" value={horas.horasSemana}
                      onChange={e => setHoras(h => ({ ...h, horasSemana: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Tolerancia para envío tardío (días)</label>
                    <input type="number" value={horas.toleranciaDias}
                      onChange={e => setHoras(h => ({ ...h, toleranciaDias: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }} />
                  </div>
                </div>
                {[
                  { key: 'requiereEvidencia', label: 'Requiere evidencia adjunta', desc: 'El estudiante debe subir un archivo al registrar horas.' },
                  { key: 'aprobacionTutor', label: 'Requiere aprobación del tutor', desc: 'El tutor empresarial debe validar las horas.' },
                  { key: 'requiereComentario', label: 'Requiere comentario de actividad', desc: 'Obliga a describir las actividades de la semana.' },
                ].map(opt => (
                  <div key={opt.key} className="flex items-start justify-between py-3 border-b" style={{ borderColor: '#EDF2F7' }}>
                    <div>
                      <div className="text-sm font-medium" style={{ color: '#172033' }}>{opt.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{opt.desc}</div>
                    </div>
                    <button
                      onClick={() => setHoras(h => ({ ...h, [opt.key]: !h[opt.key as keyof typeof h] }))}
                      className="relative w-10 h-5 rounded-full transition-all flex-shrink-0 ml-4"
                      style={{ backgroundColor: horas[opt.key as keyof typeof horas] ? '#2563EB' : '#DCE3EA' }}>
                      <span className="absolute w-3.5 h-3.5 rounded-full bg-white top-0.5 transition-all"
                        style={{ left: horas[opt.key as keyof typeof horas] ? 'calc(100% - 18px)' : '3px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeSection === 'documentos' && (
            <>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Gestión de documentos</h2>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Restricciones y comportamiento para la carga de archivos.</p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Formatos permitidos</label>
                    <input value={docs.formatosPermitidos}
                      onChange={e => setDocs(d => ({ ...d, formatosPermitidos: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }} placeholder="PDF, DOCX, XLSX…" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Tamaño máximo (MB)</label>
                    <input type="number" value={docs.tamanoMaxMB}
                      onChange={e => setDocs(d => ({ ...d, tamanoMaxMB: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Plazo de revisión coordinador (días hábiles)</label>
                    <input type="number" value={docs.plazoRevision}
                      onChange={e => setDocs(d => ({ ...d, plazoRevision: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                      style={{ borderColor: '#DCE3EA' }} />
                  </div>
                </div>
                <div className="flex items-start justify-between py-3 border-b" style={{ borderColor: '#EDF2F7' }}>
                  <div>
                    <div className="text-sm font-medium" style={{ color: '#172033' }}>Control de versiones</div>
                    <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>Guardar historial de versiones al reemplazar un documento.</div>
                  </div>
                  <button
                    onClick={() => setDocs(d => ({ ...d, versionamiento: !d.versionamiento }))}
                    className="relative w-10 h-5 rounded-full transition-all flex-shrink-0 ml-4"
                    style={{ backgroundColor: docs.versionamiento ? '#2563EB' : '#DCE3EA' }}>
                    <span className="absolute w-3.5 h-3.5 rounded-full bg-white top-0.5 transition-all"
                      style={{ left: docs.versionamiento ? 'calc(100% - 18px)' : '3px' }} />
                  </button>
                </div>
              </div>
            </>
          )}

          {activeSection === 'seguridad' && (
            <>
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Seguridad y acceso</h2>
                <p className="text-xs" style={{ color: '#5F6B7A' }}>Políticas de sesión y control de acceso al sistema.</p>
              </div>
              <div className="space-y-5">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#F4F7FA', borderColor: '#DCE3EA' }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: '#5F6B7A' }}>ROLES Y PERMISOS</div>
                  <div className="space-y-2">
                    {[
                      { rol: 'Coordinador', permisos: 'CRUD postulaciones, convenios, documentos, horas, evaluaciones, usuarios' },
                      { rol: 'Estudiante', permisos: 'Lectura/escritura de su propia postulación, documentos y horas' },
                      { rol: 'Tutor empresarial', permisos: 'Validación de horas y evaluaciones de sus estudiantes asignados' },
                    ].map(r => (
                      <div key={r.rol} className="p-3 rounded-lg" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="text-xs font-semibold" style={{ color: '#172033' }}>{r.rol}</div>
                        <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{r.permisos}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: '#F4F7FA', borderColor: '#DCE3EA' }}>
                  <div className="text-xs font-semibold mb-3" style={{ color: '#5F6B7A' }}>POLÍTICA DE SESIÓN</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ['Duración de sesión', '8 horas'],
                      ['Intentos fallidos hasta bloqueo', '5 intentos'],
                      ['Tiempo de bloqueo', '30 minutos'],
                      ['Autenticación 2FA', 'Deshabilitada (demo)'],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
                        <div className="text-sm font-medium mt-0.5" style={{ color: '#172033' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3 rounded-xl border" style={{ backgroundColor: '#FFFBEB', borderColor: '#FDE68A' }}>
                  <p className="text-xs" style={{ color: '#B7791F' }}>
                    🔒 Esta es una versión de demostración. La autenticación real requiere integración con el sistema institucional de la universidad.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
