import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ChevronRight, Upload, X, Building2, MapPin, Clock, Users, AlertCircle } from 'lucide-react';
import { api, ApiError } from '../services/api';
import type { EmpresaBackend, PostulacionBackend } from '../types/api';

const steps = ['Empresa y convenio', 'Información de la práctica', 'Documentos', 'Revisión y envío'];

const docReqs = [
  { nombre: 'Solicitud de prácticas', formatos: 'PDF', tamano: '2 MB' },
  { nombre: 'Carta de presentación', formatos: 'PDF', tamano: '2 MB' },
  { nombre: 'Currículum vitae', formatos: 'PDF', tamano: '5 MB' },
  { nombre: 'Constancia académica', formatos: 'PDF', tamano: '2 MB' },
  { nombre: 'Plan de actividades', formatos: 'PDF, DOCX', tamano: '5 MB' },
];

interface NuevaPostulacionProps {
  rol: 'coordinador' | 'estudiante';
}

export default function NuevaPostulacion({ rol }: NuevaPostulacionProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [empresas, setEmpresas] = useState<EmpresaBackend[]>([]);
  const [loadingEmpresas, setLoadingEmpresas] = useState(true);
  const [empresaSelected, setEmpresaSelected] = useState('');
  const [errorApi, setErrorApi] = useState('');

  const [form, setForm] = useState({
    area: 'Desarrollo de software',
    modalidad: 'Híbrido',
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaFin: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    horas: '30',
    descripcion: '',
    motivacion: '',
  });

  const [docs, setDocs] = useState<Record<string, string>>({});
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    api.get<EmpresaBackend[]>('/empresas')
      .then(res => {
        setEmpresas(res);
        if (res.length > 0) setEmpresaSelected(res[0].id);
      })
      .catch(() => setErrorApi('Error al cargar la lista de empresas.'))
      .finally(() => setLoadingEmpresas(false));
  }, []);

  const empresa = empresas.find(e => e.id === empresaSelected);
  const docsCompleted = Object.keys(docs).length;

  const handleNext = () => { if (step < 3) setStep(s => s + 1); };
  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!agree || !empresaSelected) return;
    setSubmitting(true);
    setErrorApi('');
    try {
      await api.post<PostulacionBackend>('/postulaciones', {
        empresaId: empresaSelected,
        convenioId: empresa?.convenios?.[0]?.id,
        area: form.area,
        modalidad: form.modalidad as 'Presencial' | 'Híbrido' | 'Remoto',
        fechaInicio: new Date(form.fechaInicio).toISOString(),
        fechaFin: new Date(form.fechaFin).toISOString(),
        horasSemanales: Number(form.horas),
        motivacion: form.motivacion,
        descripcion: form.descripcion,
      });

      setSubmitted(true);
      const destino = rol === 'coordinador' ? '/postulaciones' : '/mi-postulacion';
      setTimeout(() => navigate(destino), 2000);
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorApi(err.message);
      } else {
        setErrorApi('Error al enviar la postulación.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#D1FAE5' }}>
          <CheckCircle size={32} style={{ color: '#168A5B' }} />
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: '#172033' }}>Postulación enviada correctamente</h2>
        <p className="text-sm" style={{ color: '#5F6B7A' }}>Registrada en PostgreSQL. Redirigiendo…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>
          {rol === 'coordinador' ? 'Registrar postulación' : 'Mi nueva postulación'}
        </h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>
          {rol === 'coordinador'
            ? 'Registra una solicitud de prácticas enviando datos a la API SMCPP.'
            : 'Completa los datos para registrar tu solicitud de prácticas en la API.'}
        </p>
      </div>

      {errorApi && (
        <div className="flex items-center gap-2 p-4 rounded-xl border text-sm" style={{ backgroundColor: '#FEE2E2', borderColor: '#FECACA', color: '#C43D4D' }}>
          <AlertCircle size={16} />
          {errorApi}
        </div>
      )}

      {/* Stepper */}
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
                style={{
                  backgroundColor: i < step ? '#168A5B' : i === step ? '#2563EB' : '#EDF2F7',
                  color: i <= step ? '#FFFFFF' : '#5F6B7A',
                }}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block" style={{ color: i === step ? '#172033' : '#5F6B7A' }}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: i < step ? '#168A5B' : '#DCE3EA' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: '#DCE3EA' }}>
        {step === 0 && (
          <div>
            <h2 className="text-base font-semibold mb-1" style={{ color: '#172033' }}>Selecciona la empresa receptora</h2>
            <p className="text-xs mb-4" style={{ color: '#5F6B7A' }}>Empresas disponibles en el backend SMCPP</p>

            {loadingEmpresas ? (
              <div className="p-8 text-center text-sm" style={{ color: '#5F6B7A' }}>Cargando empresas receptoras…</div>
            ) : empresas.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: '#5F6B7A' }}>No hay empresas registradas.</div>
            ) : (
              <div className="space-y-3">
                {empresas.map(e => (
                  <div
                    key={e.id}
                    onClick={() => setEmpresaSelected(e.id)}
                    className="p-4 rounded-xl border cursor-pointer transition-all"
                    style={{
                      borderColor: empresaSelected === e.id ? '#2563EB' : '#DCE3EA',
                      backgroundColor: empresaSelected === e.id ? '#EFF6FF' : '#FAFAFA',
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-medium text-sm" style={{ color: '#172033' }}>{e.nombre}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#5F6B7A' }}>
                          <span className="flex items-center gap-1"><Building2 size={11} /> {e.rubro}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {e.ubicacion}</span>
                          <span className="flex items-center gap-1"><Clock size={11} /> {e.modalidad}</span>
                          <span className="flex items-center gap-1"><Users size={11} /> {e.vacantes} vacantes</span>
                        </div>
                      </div>
                      {empresaSelected === e.id && <CheckCircle size={18} style={{ color: '#2563EB' }} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de la práctica</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Área de interés</label>
                <input
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.area}
                  onChange={e => setForm(prev => ({ ...prev, area: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Modalidad</label>
                <select className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.modalidad} onChange={e => setForm(prev => ({ ...prev, modalidad: e.target.value }))}>
                  <option value="Presencial">Presencial</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Remoto">Remoto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Horas semanales</label>
                <input type="number" min={10} max={40}
                  className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.horas} onChange={e => setForm(prev => ({ ...prev, horas: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Fecha de inicio</label>
                <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.fechaInicio} onChange={e => setForm(prev => ({ ...prev, fechaInicio: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Fecha prevista de término</label>
                <input type="date" className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                  style={{ borderColor: '#DCE3EA' }}
                  value={form.fechaFin} onChange={e => setForm(prev => ({ ...prev, fechaFin: e.target.value }))} />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>Motivación para la práctica</label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }} placeholder="¿Por qué te interesa esta empresa y práctica?"
                  value={form.motivacion} onChange={e => setForm(prev => ({ ...prev, motivacion: e.target.value }))} />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#172033' }}>
                  Descripción de actividades
                </label>
                <textarea rows={3} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                  style={{ borderColor: '#DCE3EA' }} placeholder="Describe las actividades a realizar…"
                  value={form.descripcion} onChange={e => setForm(prev => ({ ...prev, descripcion: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Carga de documentos</h2>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: docsCompleted === docReqs.length ? '#D1FAE5' : '#EFF6FF', color: docsCompleted === docReqs.length ? '#168A5B' : '#2563EB' }}>
                {docsCompleted} de {docReqs.length} documentos completados
              </span>
            </div>
            <div className="space-y-3">
              {docReqs.map((req) => {
                const uploaded = docs[req.nombre];
                return (
                  <div key={req.nombre} className="flex items-center gap-4 p-4 rounded-xl border"
                    style={{ borderColor: uploaded ? '#A7F3D0' : '#DCE3EA', backgroundColor: uploaded ? '#F0FDF4' : '#FAFAFA' }}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0`}
                      style={{ backgroundColor: uploaded ? '#D1FAE5' : '#EDF2F7' }}>
                      {uploaded ? <CheckCircle size={18} style={{ color: '#168A5B' }} /> : <Upload size={18} style={{ color: '#5F6B7A' }} />}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium" style={{ color: '#172033' }}>{req.nombre}</div>
                      <div className="text-xs" style={{ color: '#5F6B7A' }}>{req.formatos} · máx. {req.tamano}</div>
                      {uploaded && <div className="text-xs mt-0.5" style={{ color: '#168A5B' }}>{uploaded}</div>}
                    </div>
                    {uploaded ? (
                      <button onClick={() => setDocs(d => { const nd = { ...d }; delete nd[req.nombre]; return nd; })}
                        className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#C43D4D' }}>
                        <X size={14} />
                      </button>
                    ) : (
                      <label className="px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors"
                        style={{ borderColor: '#DCE3EA', color: '#5F6B7A', backgroundColor: '#FFFFFF' }}>
                        Seleccionar
                        <input type="file" className="hidden" onChange={() => setDocs(d => ({ ...d, [req.nombre]: `${req.nombre}.pdf` }))} />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Revisión y envío</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                <h3 className="text-xs font-semibold mb-2" style={{ color: '#5F6B7A' }}>EMPRESA SELECCIONADA</h3>
                <div className="text-sm font-medium" style={{ color: '#172033' }}>{empresa?.nombre ?? '—'}</div>
                <div className="text-xs" style={{ color: '#5F6B7A' }}>{empresa?.rubro} · {empresa?.modalidad}</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#F4F7FA' }}>
                <h3 className="text-xs font-semibold mb-2" style={{ color: '#5F6B7A' }}>INFORMACIÓN DE LA PRÁCTICA</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['Área', form.area || '—'],
                    ['Modalidad', form.modalidad || '—'],
                    ['Inicio', form.fechaInicio || '—'],
                    ['Término', form.fechaFin || '—'],
                    ['Horas/semana', form.horas],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <div className="text-xs" style={{ color: '#5F6B7A' }}>{k}</div>
                      <div className="text-sm font-medium" style={{ color: '#172033' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)}
                  className="mt-0.5" style={{ accentColor: '#2563EB' }} />
                <span className="text-sm" style={{ color: '#172033' }}>
                  Declaro que la información registrada es correcta y que los datos ingresados serán procesados en PostgreSQL.
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={handleBack} disabled={step === 0}
          className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors"
          style={{ borderColor: '#DCE3EA', color: step === 0 ? '#DCE3EA' : '#5F6B7A', backgroundColor: '#FFFFFF' }}>
          Regresar
        </button>
        <div className="flex gap-3">
          {step < 3 ? (
            <button onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
              Continuar <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={!agree || submitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity text-white"
              style={{ backgroundColor: '#168A5B', opacity: agree && !submitting ? 1 : 0.5 }}>
              {submitting ? 'Enviando a API…' : 'Enviar postulación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
