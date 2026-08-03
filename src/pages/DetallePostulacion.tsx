import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Download, Eye, MessageSquare, X } from 'lucide-react';
import { StatusChip } from '../components/StatusChip';
import { Avatar } from '../components/Avatar';
import { postulaciones } from '../data/mockData';

const documentos = [
  { nombre: 'Solicitud de prácticas', version: 'v2', fecha: '2026-04-02', tamano: '245 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Carta de presentación', version: 'v3', fecha: '2026-04-05', tamano: '182 KB', estado: 'en_revision', obs: 'Verificar firma del decano' },
  { nombre: 'Currículum vitae', version: 'v1', fecha: '2026-03-20', tamano: '312 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Constancia académica', version: 'v1', fecha: '2026-03-20', tamano: '98 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Plan de actividades', version: 'v1', fecha: '2026-03-22', tamano: '156 KB', estado: 'pendiente', obs: '' },
];

const historial = [
  { fecha: '2026-04-05 14:30', accion: 'Carta de presentación actualizada a v3', usuario: 'Ana Torres M.', tipo: 'Documento' },
  { fecha: '2026-04-03 09:15', accion: 'Observación enviada: verificar firma del decano', usuario: 'Coord. Ramos', tipo: 'Observación' },
  { fecha: '2026-04-02 16:45', accion: 'Solicitud de prácticas aprobada', usuario: 'Coord. Ramos', tipo: 'Aprobación' },
  { fecha: '2026-03-25 11:00', accion: 'Revisión inicial completada', usuario: 'Coord. Ramos', tipo: 'Revisión' },
  { fecha: '2026-03-20 08:30', accion: 'Postulación enviada', usuario: 'Ana Torres M.', tipo: 'Envío' },
];

const comentarios = [
  { autor: 'Coord. Ramos', iniciales: 'CR', color: '#152A43', fecha: '2026-04-03 09:20', texto: 'La carta de presentación necesita la firma del decano de la facultad. Por favor, actualice el documento.' },
  { autor: 'Ana Torres M.', iniciales: 'AT', color: '#2563EB', fecha: '2026-04-04 14:15', texto: 'Entendido, ya gestioné la firma. Subiré la nueva versión mañana.' },
  { autor: 'Ana Torres M.', iniciales: 'AT', color: '#2563EB', fecha: '2026-04-05 14:30', texto: 'Se adjuntó la versión corregida (v3). Por favor, revisar.' },
];

export default function DetallePostulacion() {
  const { codigo } = useParams<{ codigo: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'resumen' | 'documentos' | 'historial' | 'comentarios'>('resumen');
  const [docPanel, setDocPanel] = useState<(typeof documentos)[0] | null>(null);
  const [newComment, setNewComment] = useState('');
  const [toast, setToast] = useState('');

  const p = postulaciones.find(x => x.codigo === codigo) ?? postulaciones[0];

  const etapas = ['Enviada', 'Revisión inicial', 'Corrección', 'Validación final', 'Aprobada'];

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium"
          style={{ backgroundColor: '#172033', color: '#FFFFFF' }}>
          <CheckCircle size={15} style={{ color: '#0F9F92' }} /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/postulaciones')}
          className="mt-1 p-2 rounded-lg hover:bg-gray-100 transition-colors" style={{ color: '#5F6B7A' }}>
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Avatar iniciales={p.estudiante.iniciales} color={p.estudiante.color} size="lg" />
              <div>
                <h1 className="text-2xl font-semibold" style={{ color: '#172033' }}>{p.estudiante.nombre}</h1>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-sm" style={{ color: '#5F6B7A' }}>{p.estudiante.codigo}</span>
                  <span style={{ color: '#DCE3EA' }}>·</span>
                  <span className="text-sm" style={{ color: '#5F6B7A' }}>{p.empresa}</span>
                  <span style={{ color: '#DCE3EA' }}>·</span>
                  <span className="text-sm" style={{ color: '#5F6B7A' }}>{p.codigo}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <StatusChip estado={p.estado} />
              <span className="text-sm" style={{ color: '#5F6B7A' }}>Responsable: {p.responsable}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button onClick={() => showToast('Observación enviada al estudiante.')}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: '#D65A31', color: '#D65A31', backgroundColor: '#FFF5F0' }}>
            Observar
          </button>
          <button onClick={() => showToast('Postulación rechazada.')}
            className="px-4 py-2 rounded-lg border text-sm font-medium"
            style={{ borderColor: '#C43D4D', color: '#C43D4D', backgroundColor: '#FEF2F2' }}>
            Rechazar
          </button>
          <button onClick={() => showToast('Postulación aprobada correctamente.')}
            className="px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#168A5B', color: '#FFFFFF' }}>
            Aprobar postulación
          </button>
        </div>
      </div>

      {/* Timeline horizontal */}
      <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-sm font-semibold mb-4" style={{ color: '#172033' }}>Trayectoria de la postulación</h2>
        <div className="flex items-center relative">
          <div className="absolute top-4 left-4 right-4 h-0.5" style={{ backgroundColor: '#DCE3EA' }} />
          <div className="absolute top-4 left-4 h-0.5" style={{ width: `${((p.etapa - 1) / (etapas.length - 1)) * 88}%`, backgroundColor: '#2563EB' }} />
          {etapas.map((e, i) => (
            <div key={e} className="flex-1 flex flex-col items-center relative z-10">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2"
                style={{
                  backgroundColor: i < p.etapa ? '#2563EB' : i === p.etapa ? '#FFFFFF' : '#F4F7FA',
                  borderColor: i < p.etapa ? '#2563EB' : i === p.etapa ? '#2563EB' : '#DCE3EA',
                  color: i < p.etapa ? '#FFFFFF' : i === p.etapa ? '#2563EB' : '#5F6B7A',
                }}>
                {i < p.etapa ? '✓' : i + 1}
              </div>
              <div className="mt-2 text-center text-xs font-medium" style={{ color: i <= p.etapa ? '#172033' : '#5F6B7A' }}>{e}</div>
              {i === p.etapa - 1 && <div className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>Actual</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid gap-6" style={{ gridTemplateColumns: '1fr 0.47fr' }}>
        {/* Left col */}
        <div className="space-y-4">
          {/* Tabs */}
          <div className="flex gap-0 border-b" style={{ borderColor: '#DCE3EA' }}>
            {(['resumen', 'documentos', 'historial', 'comentarios'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-3 text-sm font-medium border-b-2 -mb-px capitalize transition-colors"
                style={{ borderColor: tab === t ? '#2563EB' : 'transparent', color: tab === t ? '#2563EB' : '#5F6B7A' }}>
                {t === 'comentarios' ? 'Comentarios' : t === 'documentos' ? 'Documentos' : t === 'historial' ? 'Historial' : 'Resumen'}
              </button>
            ))}
          </div>

          {tab === 'resumen' && (
            <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: '#DCE3EA' }}>
              <h3 className="text-sm font-semibold" style={{ color: '#172033' }}>Información académica</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Escuela profesional', p.estudiante.escuela],
                  ['Ciclo académico', `${p.estudiante.ciclo}° ciclo`],
                  ['Correo', p.estudiante.email],
                  ['Teléfono', p.estudiante.telefono],
                ].map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                    <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
                    <div className="text-sm font-medium mt-0.5" style={{ color: '#172033' }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4" style={{ borderColor: '#EDF2F7' }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Información de la empresa</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Empresa', p.empresa],
                    ['Área de práctica', p.area],
                    ['Modalidad', p.modalidad],
                    ['Tutor empresarial', p.tutor || 'Por asignar'],
                    ['Fecha de inicio', p.fechaInicio],
                    ['Fecha de término', p.fechaFin],
                    ['Horas semanales', `${p.horasSemanales} horas`],
                  ].map(([k, v]) => (
                    <div key={k} className="p-3 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                      <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
                      <div className="text-sm font-medium mt-0.5" style={{ color: '#172033' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4" style={{ borderColor: '#EDF2F7' }}>
                <h3 className="text-sm font-semibold mb-2" style={{ color: '#172033' }}>Motivación del estudiante</h3>
                <p className="text-sm" style={{ color: '#5F6B7A' }}>{p.motivacion}</p>
              </div>
            </div>
          )}

          {tab === 'documentos' && (
            <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F4F7FA' }}>
                    {['Documento', 'Versión', 'Fecha', 'Tamaño', 'Estado', 'Acciones'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {documentos.map((doc, i) => (
                    <tr key={i} className="border-t" style={{ borderColor: '#EDF2F7' }}>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium" style={{ color: '#172033' }}>{doc.nombre}</div>
                        {doc.obs && <div className="text-xs mt-0.5" style={{ color: '#D65A31' }}>Obs: {doc.obs}</div>}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.version}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.fecha}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.tamano}</td>
                      <td className="px-4 py-3"><StatusChip estado={doc.estado as any} /></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setDocPanel(doc)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#5F6B7A' }}>
                            <Eye size={14} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#5F6B7A' }}>
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'historial' && (
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ backgroundColor: '#EDF2F7' }} />
                <div className="space-y-4">
                  {historial.map((h, i) => (
                    <div key={i} className="flex gap-4 relative">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10"
                        style={{ backgroundColor: h.tipo === 'Aprobación' ? '#D1FAE5' : h.tipo === 'Observación' ? '#FEE9E0' : '#EDF2F7', color: h.tipo === 'Aprobación' ? '#168A5B' : h.tipo === 'Observación' ? '#D65A31' : '#5F6B7A' }}>
                        {h.tipo === 'Aprobación' ? <CheckCircle size={14} /> : h.tipo === 'Observación' ? <AlertCircle size={14} /> : <MessageSquare size={14} />}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="text-sm font-medium" style={{ color: '#172033' }}>{h.accion}</div>
                        <div className="text-xs mt-1" style={{ color: '#5F6B7A' }}>{h.usuario} · {h.fecha}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'comentarios' && (
            <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
              <div className="space-y-4 mb-6">
                {comentarios.map((c, i) => (
                  <div key={i} className="flex gap-3">
                    <Avatar iniciales={c.iniciales} color={c.color} size="sm" />
                    <div className="flex-1 p-3 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold" style={{ color: '#172033' }}>{c.autor}</span>
                        <span className="text-xs" style={{ color: '#5F6B7A' }}>{c.fecha}</span>
                      </div>
                      <p className="text-sm" style={{ color: '#5F6B7A' }}>{c.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <Avatar iniciales="CR" color="#152A43" size="sm" />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    placeholder="Escribir un comentario sobre esta postulación…"
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-xl border outline-none resize-none"
                    style={{ borderColor: '#DCE3EA', color: '#172033' }}
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                      Enviar comentario
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right col */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#DCE3EA' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Siguiente acción</h3>
            <div className="p-3 rounded-xl mb-3" style={{ backgroundColor: '#EFF6FF' }}>
              <div className="text-xs font-medium" style={{ color: '#2563EB' }}>Revisar carta de presentación v3</div>
              <div className="text-xs mt-1" style={{ color: '#5F6B7A' }}>Fecha límite: 2026-04-08</div>
            </div>
            <div className="space-y-2">
              {['Verificar firma del decano', 'Comparar con versión anterior', 'Aprobar o solicitar otra corrección'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded border flex items-center justify-center" style={{ borderColor: '#DCE3EA' }}>
                    {i === 0 && <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: '#168A5B' }} />}
                  </div>
                  <span className="text-xs" style={{ color: '#172033', textDecoration: i === 0 ? 'line-through' : 'none', opacity: i === 0 ? 0.5 : 1 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#DCE3EA' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Datos de contacto</h3>
            <div className="space-y-2">
              {[
                ['Correo', p.estudiante.email],
                ['Teléfono', p.estudiante.telefono],
                ['Tutor empresarial', p.tutor || 'Por asignar'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
                  <div className="text-sm font-medium" style={{ color: '#172033' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: '#DCE3EA' }}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: '#172033' }}>Incidencias</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FEE9E0' }}>
                <AlertCircle size={13} style={{ color: '#D65A31' }} />
                <span className="text-xs" style={{ color: '#D65A31' }}>Carta de presentación observada</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#FEF3C7' }}>
                <AlertCircle size={13} style={{ color: '#B7791F' }} />
                <span className="text-xs" style={{ color: '#B7791F' }}>Plan de actividades pendiente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doc panel */}
      {docPanel && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1" onClick={() => setDocPanel(null)} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
          <div className="w-96 bg-white h-full shadow-2xl flex flex-col p-6" style={{ overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#172033' }}>{docPanel.nombre}</h3>
              <button onClick={() => setDocPanel(null)} style={{ color: '#5F6B7A' }}><X size={16} /></button>
            </div>
            <div className="flex-1 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F4F7FA', minHeight: 300 }}>
              <div className="text-center">
                <div className="text-5xl mb-3">📄</div>
                <div className="text-sm" style={{ color: '#5F6B7A' }}>{docPanel.nombre}</div>
                <div className="text-xs mt-1" style={{ color: '#5F6B7A' }}>{docPanel.version} · {docPanel.tamano}</div>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={() => { showToast('Documento aprobado.'); setDocPanel(null); }}
                className="w-full py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#D1FAE5', color: '#168A5B' }}>
                Aprobar documento
              </button>
              <button onClick={() => { showToast('Observación enviada al estudiante.'); setDocPanel(null); }}
                className="w-full py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#FEE9E0', color: '#D65A31' }}>
                Observar documento
              </button>
              <button className="w-full py-2 rounded-lg border text-sm font-medium"
                style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                <Download size={13} className="inline mr-1" /> Descargar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
