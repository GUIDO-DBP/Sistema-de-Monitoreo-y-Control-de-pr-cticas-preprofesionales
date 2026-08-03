import { useState } from 'react';

const ANA = {
  nombre: 'Ana Torres Mamani',
  codigo: '2021064821',
  escuela: 'Ingeniería de Sistemas',
  ciclo: 9,
  email: 'a.torres@univ.edu.pe',
  telefono: '987 654 321',
  empresa: 'AndesTech Solutions',
  area: 'Desarrollo de software',
  tutor: 'Ing. Carlos Medina',
  coordinador: 'Coord. Ramos',
};

export default function Perfil() {
  const [editing, setEditing] = useState(false);
  const [telefono, setTelefono] = useState(ANA.telefono);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  return (
    <div className="max-w-2xl space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white"
          style={{ backgroundColor: '#172033' }}>{toast}</div>
      )}

      <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Mi perfil</h1>

      {/* Avatar */}
      <div className="p-6 rounded-2xl border bg-white flex items-center gap-5" style={{ borderColor: '#DCE3EA' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
          style={{ backgroundColor: '#2563EB' }}>AT</div>
        <div>
          <div className="text-xl font-semibold" style={{ color: '#172033' }}>{ANA.nombre}</div>
          <div className="text-sm" style={{ color: '#5F6B7A' }}>Código: {ANA.codigo}</div>
          <div className="text-sm" style={{ color: '#5F6B7A' }}>{ANA.escuela} · {ANA.ciclo}° ciclo</div>
        </div>
      </div>

      {/* Personal data */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold" style={{ color: '#172033' }}>Datos personales</h2>
          <button onClick={() => setEditing(!editing)}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors"
            style={{ borderColor: '#DCE3EA', color: editing ? '#2563EB' : '#5F6B7A' }}>
            {editing ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Correo institucional', value: ANA.email, editable: false },
            { label: 'Escuela profesional', value: ANA.escuela, editable: false },
            { label: 'Ciclo académico', value: `${ANA.ciclo}° ciclo`, editable: false },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium mb-1" style={{ color: '#5F6B7A' }}>{f.label}</label>
              <input readOnly value={f.value} className="w-full px-3 py-2 text-sm rounded-lg border"
                style={{ borderColor: '#DCE3EA', backgroundColor: '#F4F7FA', color: '#172033' }} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#5F6B7A' }}>Teléfono de contacto</label>
            <input
              value={telefono}
              onChange={e => setTelefono(e.target.value)}
              readOnly={!editing}
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none"
              style={{ borderColor: editing ? '#2563EB' : '#DCE3EA', backgroundColor: editing ? '#FFFFFF' : '#F4F7FA', color: '#172033' }}
            />
          </div>
        </div>
        {editing && (
          <button onClick={() => { setEditing(false); showToast('Perfil actualizado correctamente.'); }}
            className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
            Guardar cambios
          </button>
        )}
      </div>

      {/* Practice info */}
      <div className="p-6 rounded-2xl border bg-white" style={{ borderColor: '#DCE3EA' }}>
        <h2 className="text-base font-semibold mb-4" style={{ color: '#172033' }}>Información de práctica</h2>
        <div className="space-y-3">
          {[
            ['Empresa', ANA.empresa],
            ['Área', ANA.area],
            ['Tutor empresarial', ANA.tutor],
            ['Coordinador de prácticas', ANA.coordinador],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-sm" style={{ color: '#5F6B7A' }}>{k}</span>
              <span className="text-sm font-medium" style={{ color: '#172033' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
