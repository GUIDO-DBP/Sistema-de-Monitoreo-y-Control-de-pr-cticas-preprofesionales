import { useState } from 'react';
import { Upload, Eye, Download, X } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';

const documentos = [
  { nombre: 'Solicitud de prácticas', version: 'v2', fecha: '2026-04-02', tamano: '245 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Carta de presentación', version: 'v3', fecha: '2026-04-05', tamano: '182 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Currículum vitae', version: 'v1', fecha: '2026-03-20', tamano: '312 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Constancia académica', version: 'v1', fecha: '2026-03-20', tamano: '98 KB', estado: 'aprobada', obs: '' },
  { nombre: 'Plan de actividades', version: 'v1', fecha: '2026-03-22', tamano: '156 KB', estado: 'pendiente', obs: 'Pendiente de envío. Formato PDF, máx. 5 MB.' },
];

export default function MisDocumentos() {
  const [preview, setPreview] = useState<(typeof documentos)[0] | null>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const aprobados = documentos.filter(d => d.estado === 'aprobada').length;

  return (
    <div className="max-w-3xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#172033' }}>{toast}</div>
      )}

      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mis documentos</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Documentos de tu proceso de prácticas preprofesionales.</p>
      </div>

      {/* Progress summary */}
      <div className="p-5 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: '#172033' }}>Progreso documentario</span>
          <span className="text-sm font-bold" style={{ color: '#168A5B' }}>{aprobados}/{documentos.length} aprobados</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#EDF2F7' }}>
          <div className="h-full rounded-full" style={{ width: `${(aprobados / documentos.length) * 100}%`, backgroundColor: '#168A5B' }} />
        </div>
      </div>

      {/* Documents list */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
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
                  {doc.obs && <div className="text-xs mt-0.5" style={{ color: '#B7791F' }}>{doc.obs}</div>}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.version}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.fecha}</td>
                <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{doc.tamano}</td>
                <td className="px-4 py-3"><StatusChip estado={doc.estado as any} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {doc.estado !== 'pendiente' && (
                      <>
                        <button onClick={() => setPreview(doc)} className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#5F6B7A' }}>
                          <Eye size={13} />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: '#5F6B7A' }}>
                          <Download size={13} />
                        </button>
                      </>
                    )}
                    {doc.estado === 'pendiente' && (
                      <label className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer"
                        style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
                        <Upload size={12} /> Subir
                        <input type="file" className="hidden" onChange={() => showToast('Documento subido. Pendiente de revisión.')} />
                      </label>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload zone for pending */}
      <div className="p-6 rounded-2xl border-2 border-dashed text-center" style={{ borderColor: '#DCE3EA' }}>
        <Upload size={24} className="mx-auto mb-2" style={{ color: '#5F6B7A' }} />
        <p className="text-sm font-medium" style={{ color: '#172033' }}>Arrastra aquí el Plan de actividades</p>
        <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>PDF, DOCX · máx. 5 MB</p>
        <label className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
          style={{ backgroundColor: '#EFF6FF', color: '#2563EB' }}>
          Seleccionar archivo
          <input type="file" className="hidden" onChange={() => showToast('Documento subido. Pendiente de revisión.')} />
        </label>
      </div>

      {/* Preview panel */}
      {preview && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1" onClick={() => setPreview(null)} style={{ backgroundColor: 'rgba(0,0,0,0.3)' }} />
          <div className="w-96 bg-white h-full shadow-2xl flex flex-col p-6" style={{ overflowY: 'auto' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: '#172033' }}>{preview.nombre}</h3>
              <button onClick={() => setPreview(null)} style={{ color: '#5F6B7A' }}><X size={16} /></button>
            </div>
            <div className="flex-1 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: '#F4F7FA', minHeight: 300 }}>
              <div className="text-center">
                <div className="text-5xl mb-3">📄</div>
                <div className="text-sm" style={{ color: '#5F6B7A' }}>{preview.nombre}</div>
                <div className="text-xs mt-1" style={{ color: '#5F6B7A' }}>{preview.version} · {preview.tamano}</div>
              </div>
            </div>
            <button className="w-full py-2 rounded-lg border text-sm font-medium"
              style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
              <Download size={13} className="inline mr-1" /> Descargar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
