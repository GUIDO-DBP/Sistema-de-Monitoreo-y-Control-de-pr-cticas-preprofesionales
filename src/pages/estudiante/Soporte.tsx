import { useState } from 'react';
import { MessageCircle, CheckCircle } from 'lucide-react';

const faqs = [
  { q: '¿Cómo registro mis horas de práctica?', a: 'Ve a "Mis horas" en el menú lateral y usa el botón "Registrar horas". Completa la fecha, hora de entrada, hora de salida y la actividad realizada.' },
  { q: '¿Qué documentos debo subir?', a: 'Debes subir: solicitud de prácticas, carta de presentación, currículum vitae, constancia académica y plan de actividades. Todos en formato PDF.' },
  { q: '¿Cómo contacto a mi coordinador?', a: 'Puedes enviar un mensaje desde la sección "Mis horas" o a través del correo institucional de tu coordinador: coord.ramos@univ.edu.pe.' },
  { q: '¿Cuándo se publica mi evaluación?', a: 'Tu tutor empresarial debe completar la evaluación antes de la fecha límite indicada. Recibirás una notificación cuando esté disponible.' },
];

export default function Soporte() {
  const [form, setForm] = useState({ tipo: '', asunto: '', mensaje: '' });
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Ayuda y soporte</h1>
        <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Resuelve tus dudas o contacta a la Oficina de Prácticas.</p>
      </div>

      {/* FAQ */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Preguntas frecuentes</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details key={i} className="group">
              <summary className="flex items-center justify-between cursor-pointer py-2 border-b text-sm font-medium"
                style={{ borderColor: '#EDF2F7', color: '#172033' }}>
                {faq.q}
                <span className="text-xs" style={{ color: '#5F6B7A' }}>▼</span>
              </summary>
              <p className="text-sm pt-2 pb-1" style={{ color: '#5F6B7A' }}>{faq.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact form */}
      {!sent ? (
        <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle size={18} style={{ color: '#2563EB' }} />
            <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Enviar consulta</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Tipo de consulta</label>
              <select className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                style={{ borderColor: '#DCE3EA' }}
                value={form.tipo} onChange={e => setForm(v => ({ ...v, tipo: e.target.value }))}>
                <option value="">Seleccionar…</option>
                <option>Dudas sobre documentación</option>
                <option>Problemas con registro de horas</option>
                <option>Consulta sobre mi postulación</option>
                <option>Error en el sistema</option>
                <option>Otra consulta</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Asunto</label>
              <input className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
                style={{ borderColor: '#DCE3EA' }} placeholder="Describe brevemente tu consulta"
                value={form.asunto} onChange={e => setForm(v => ({ ...v, asunto: e.target.value }))} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#172033' }}>Mensaje</label>
              <textarea rows={5} className="w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none"
                style={{ borderColor: '#DCE3EA' }} placeholder="Explica tu situación con más detalle…"
                value={form.mensaje} onChange={e => setForm(v => ({ ...v, mensaje: e.target.value }))} />
            </div>
          </div>
          <button
            onClick={() => setSent(true)}
            disabled={!form.tipo || !form.asunto || !form.mensaje}
            className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF', opacity: (!form.tipo || !form.asunto || !form.mensaje) ? 0.5 : 1 }}>
            Enviar consulta
          </button>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border bg-white text-center" style={{ borderColor: '#DCE3EA' }}>
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D1FAE5' }}>
            <CheckCircle size={28} style={{ color: '#168A5B' }} />
          </div>
          <h2 className="font-semibold mb-1" style={{ color: '#172033' }}>Consulta enviada</h2>
          <p className="text-sm" style={{ color: '#5F6B7A' }}>La Oficina de Prácticas responderá en un plazo de 24–48 horas.</p>
          <button onClick={() => { setSent(false); setForm({ tipo: '', asunto: '', mensaje: '' }); }}
            className="mt-4 text-sm font-medium" style={{ color: '#2563EB' }}>
            Enviar otra consulta
          </button>
        </div>
      )}
    </div>
  );
}
