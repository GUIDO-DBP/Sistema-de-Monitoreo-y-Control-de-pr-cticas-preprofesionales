import { useState, useEffect, useCallback } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, FileText, RefreshCw, Clock } from 'lucide-react';
import { StatusChip } from '../../components/StatusChip';
import { api, ApiError } from '../../services/api';
import type { DocumentoBackend, PostulacionBackend } from '../../types/api';

const docReqs = [
  { nombre: 'Solicitud de prácticas', descripcion: 'Solicitud formal firmada por el estudiante' },
  { nombre: 'Carta de presentación', descripcion: 'Carta emitida por la Facultad dirigida a la empresa' },
  { nombre: 'Currículum vitae', descripcion: 'CV actualizado con competencias y datos de contacto' },
  { nombre: 'Constancia académica', descripcion: 'Constancia de matrícula o historial de notas' },
  { nombre: 'Plan de actividades', descripcion: 'Plan de trabajo firmado por el tutor empresarial' },
];

export default function MisDocumentos() {
  const [postulacion, setPostulacion] = useState<PostulacionBackend | null>(null);
  const [docs, setDocs] = useState<DocumentoBackend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadingName, setUploadingName] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const postulaciones = await api.get<PostulacionBackend[]>('/postulaciones');
      if (Array.isArray(postulaciones) && postulaciones.length > 0) {
        const activePost = postulaciones[0];
        setPostulacion(activePost);
        const docsRes = await api.get<DocumentoBackend[]>(`/postulaciones/${activePost.id}/documentos`);
        setDocs(docsRes);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        // If error contains raw HTML or 404/500 code, show clean friendly message
        if (err.status === 404 || err.status >= 500 || err.message.includes('<!DOCTYPE') || err.message.includes('Cannot GET')) {
          setError('No se pudieron cargar los documentos. Intenta nuevamente.');
        } else {
          setError(err.message);
        }
      } else {
        setError('No se pudieron cargar los documentos. Intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }

  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileUpload = async (nombreDoc: string, file: File) => {
    if (!postulacion) return;
    if (!file.name.endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('Solamente se permiten archivos en formato PDF.');
      return;
    }

    setUploadingName(nombreDoc);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('nombre', nombreDoc);

    try {
      await api.post(`/postulaciones/${postulacion.id}/documentos`, formData);
      fetchData();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Error al subir el documento PDF.');
    } finally {
      setUploadingName(null);
    }
  };

  const handleDescargar = async (doc: DocumentoBackend) => {
    try {
      await api.downloadBlob(`/documentos/${doc.id}/descargar`, `${doc.nombre}.pdf`);
    } catch (err) {
      alert('Error al descargar archivo desde el servidor.');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm" style={{ color: '#5F6B7A' }}>
        Cargando tus documentos en tiempo real…
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mis Documentos</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Sube y gestiona los archivos PDF requeridos para tus prácticas preprofesionales.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            {error}
          </div>
          <button onClick={fetchData} className="flex items-center gap-1 text-xs font-semibold underline">
            <RefreshCw size={12} /> Reintentar
          </button>
        </div>
      )}

      <div className="space-y-4">
        {docReqs.map(req => {
          const docExistente = docs.find(d => d.nombre.toLowerCase() === req.nombre.toLowerCase());
          const isUploading = uploadingName === req.nombre;
          const appEstado = docExistente
            ? docExistente.estado === 'APROBADO' ? 'aprobada' : docExistente.estado === 'OBSERVADO' ? 'observada' : 'pendiente'
            : undefined;

          return (
            <div key={req.nombre} className="bg-white p-5 rounded-2xl border flex items-center gap-4 transition-all" style={{ borderColor: docExistente?.estado === 'APROBADO' ? '#A7F3D0' : '#DCE3EA' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: docExistente ? '#EFF6FF' : '#F4F7FA' }}>
                <FileText size={20} style={{ color: docExistente ? '#2563EB' : '#5F6B7A' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm" style={{ color: '#172033' }}>{req.nombre}</h3>
                  {docExistente && <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100" style={{ color: '#5F6B7A' }}>v{docExistente.version}</span>}
                </div>
                <p className="text-xs mt-0.5" style={{ color: '#5F6B7A' }}>{req.descripcion}</p>
                {docExistente?.comentario && (
                  <div className="mt-2 text-xs p-2 rounded-lg" style={{ backgroundColor: '#FFFBEB', color: '#B7791F', border: '1px solid #FDE68A' }}>
                    <strong>Observación:</strong> {docExistente.comentario}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {appEstado && <StatusChip estado={appEstado} />}

                {docExistente && (
                  <button onClick={() => handleDescargar(docExistente)} title="Descargar PDF" className="p-2 rounded-lg border hover:bg-gray-50" style={{ borderColor: '#DCE3EA', color: '#2563EB' }}>
                    <Download size={16} />
                  </button>
                )}

                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors" style={{ borderColor: '#DCE3EA', backgroundColor: isUploading ? '#EFF6FF' : '#FFFFFF', color: '#2563EB' }}>
                  <Upload size={14} />
                  {isUploading ? 'Subiendo PDF…' : docExistente ? 'Reemplazar' : 'Subir PDF'}
                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    disabled={isUploading}
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(req.nombre, file);
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
