import { useState } from 'react';
import { Search, FolderOpen, FileText, Download, Eye, Upload, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

type DocEstado = 'aprobado' | 'pendiente' | 'observado';

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  estudiante: string;
  escuela: string;
  fecha: string;
  tamano: string;
  estado: DocEstado;
  version: number;
  comentario?: string;
}

const documentosMock: Documento[] = [
  { id: 'd1', nombre: 'Solicitud de prácticas', tipo: 'Solicitud', estudiante: 'Ana Torres Mamani', escuela: 'Ing. de Sistemas', fecha: '2026-03-20', tamano: '148 KB', estado: 'aprobado', version: 2 },
  { id: 'd2', nombre: 'Carta de presentación', tipo: 'Carta', estudiante: 'Ana Torres Mamani', escuela: 'Ing. de Sistemas', fecha: '2026-03-22', tamano: '212 KB', estado: 'observado', version: 3, comentario: 'Revisar firma del decano y sello institucional.' },
  { id: 'd3', nombre: 'Currículum vitae', tipo: 'CV', estudiante: 'Luis Quispe Condori', escuela: 'Ing. Industrial', fecha: '2026-03-21', tamano: '380 KB', estado: 'aprobado', version: 1 },
  { id: 'd4', nombre: 'Plan de actividades', tipo: 'Plan', estudiante: 'Daniela Flores Choque', escuela: 'Administración', fecha: '2026-03-25', tamano: '195 KB', estado: 'pendiente', version: 1 },
  { id: 'd5', nombre: 'Constancia académica', tipo: 'Constancia', estudiante: 'Diego Apaza Ramos', escuela: 'Contabilidad', fecha: '2026-03-28', tamano: '110 KB', estado: 'aprobado', version: 1 },
  { id: 'd6', nombre: 'Solicitud de prácticas', tipo: 'Solicitud', estudiante: 'Carmen Huanca Yucra', escuela: 'Ing. de Sistemas', fecha: '2026-04-01', tamano: '145 KB', estado: 'pendiente', version: 1 },
  { id: 'd7', nombre: 'Plan de actividades', tipo: 'Plan', estudiante: 'Marco Condori Ticona', escuela: 'Ing. Industrial', fecha: '2026-04-02', tamano: '220 KB', estado: 'pendiente', version: 1 },
  { id: 'd8', nombre: 'Carta de presentación', tipo: 'Carta', estudiante: 'Rosa Mamani Turpo', escuela: 'Administración', fecha: '2026-04-05', tamano: '180 KB', estado: 'observado', version: 2, comentario: 'Falta el número de convenio.' },
];

const estadoConfig: Record<DocEstado, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  aprobado: { label: 'Aprobado', icon: <CheckCircle size={12} />, bg: '#D1FAE5', text: '#168A5B' },
  pendiente: { label: 'Pendiente', icon: <Clock size={12} />, bg: '#FEF3C7', text: '#B7791F' },
  observado: { label: 'Observado', icon: <AlertCircle size={12} />, bg: '#FEE9E0', text: '#D65A31' },
};

const tipos = ['Todos', 'Solicitud', 'Carta', 'CV', 'Plan', 'Constancia'];
const estadosFiltro = ['Todos', 'aprobado', 'pendiente', 'observado'];

export default function Documentos() {
  const [query, setQuery] = useState('');
  const [tipoFilter, setTipoFilter] = useState('Todos');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [selected, setSelected] = useState<Documento | null>(null);

  const filtered = documentosMock.filter(d => {
    const matchQ = d.nombre.toLowerCase().includes(query.toLowerCase()) ||
      d.estudiante.toLowerCase().includes(query.toLowerCase());
    const matchT = tipoFilter === 'Todos' || d.tipo === tipoFilter;
    const matchE = estadoFilter === 'Todos' || d.estado === estadoFilter;
    return matchQ && matchT && matchE;
  });

  const pendientes = documentosMock.filter(d => d.estado === 'pendiente').length;
  const observados = documentosMock.filter(d => d.estado === 'observado').length;
  const aprobados = documentosMock.filter(d => d.estado === 'aprobado').length;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: '#172033' }}>Documentos</h1>
          <p className="mt-1 text-sm" style={{ color: '#5F6B7A' }}>Repositorio centralizado de documentos de prácticas preprofesionales.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
          <Upload size={14} /> Subir documento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total documentos', value: documentosMock.length, color: '#2563EB', bg: '#EFF6FF' },
          { label: 'Aprobados', value: aprobados, color: '#168A5B', bg: '#D1FAE5' },
          { label: 'Pendientes de revisión', value: pendientes, color: '#B7791F', bg: '#FEF3C7' },
          { label: 'Con observaciones', value: observados, color: '#D65A31', bg: '#FEE9E0' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: '#5F6B7A' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-60">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#5F6B7A' }} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border outline-none"
            style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF' }}
            placeholder="Buscar por nombre de documento o estudiante…" />
        </div>
        <select value={tipoFilter} onChange={e => setTipoFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none"
          style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF', color: '#172033' }}>
          {tipos.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={estadoFilter} onChange={e => setEstadoFilter(e.target.value)}
          className="px-3 py-2 text-sm rounded-lg border outline-none"
          style={{ borderColor: '#DCE3EA', backgroundColor: '#FFFFFF', color: '#172033' }}>
          {estadosFiltro.map(e => <option key={e} value={e}>{e === 'Todos' ? 'Todos los estados' : estadoConfig[e as DocEstado]?.label ?? e}</option>)}
        </select>
      </div>

      {/* Table + detail */}
      <div className="grid gap-6" style={{ gridTemplateColumns: selected ? '1fr 0.42fr' : '1fr' }}>
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: '#DCE3EA' }}>
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center">
              <FolderOpen size={40} style={{ color: '#DCE3EA', marginBottom: 12 }} />
              <p className="text-sm font-medium" style={{ color: '#172033' }}>Sin documentos</p>
              <p className="text-xs mt-1" style={{ color: '#5F6B7A' }}>Ajusta los filtros para ver otros resultados.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: '#F4F7FA' }}>
                  {['Documento', 'Tipo', 'Estudiante', 'Escuela', 'Fecha', 'Tamaño', 'Versión', 'Estado', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#5F6B7A' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(d => {
                  const cfg = estadoConfig[d.estado];
                  return (
                    <tr key={d.id}
                      onClick={() => setSelected(d.id === selected?.id ? null : d)}
                      className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                      style={{ borderColor: '#EDF2F7', backgroundColor: selected?.id === d.id ? '#EFF6FF' : undefined }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} style={{ color: '#5F6B7A', flexShrink: 0 }} />
                          <span className="text-sm font-medium" style={{ color: '#172033' }}>{d.nombre}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{d.tipo}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#172033' }}>{d.estudiante}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{d.escuela}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{d.fecha}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: '#5F6B7A' }}>{d.tamano}</td>
                      <td className="px-4 py-3 text-xs text-center" style={{ color: '#5F6B7A' }}>v{d.version}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: cfg.bg, color: cfg.text }}>
                          {cfg.icon}{cfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-gray-100" title="Ver" style={{ color: '#5F6B7A' }}>
                            <Eye size={13} />
                          </button>
                          <button className="p-1.5 rounded hover:bg-gray-100" title="Descargar" style={{ color: '#5F6B7A' }}>
                            <Download size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && (
          <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: '#DCE3EA' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F4F7FA' }}>
                <FileText size={20} style={{ color: '#2563EB' }} />
              </div>
              <div>
                <div className="font-semibold text-sm" style={{ color: '#172033' }}>{selected.nombre}</div>
                <div className="text-xs" style={{ color: '#5F6B7A' }}>Versión {selected.version} · {selected.fecha}</div>
              </div>
            </div>
            <div className="space-y-2">
              {[
                ['Estudiante', selected.estudiante],
                ['Escuela', selected.escuela],
                ['Tipo', selected.tipo],
                ['Tamaño', selected.tamano],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-xs" style={{ color: '#5F6B7A' }}>{k}</span>
                  <span className="text-xs font-medium" style={{ color: '#172033' }}>{v}</span>
                </div>
              ))}
            </div>
            {selected.comentario && (
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#FEE9E0' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#D65A31' }}>OBSERVACIÓN DEL COORDINADOR</div>
                <p className="text-xs" style={{ color: '#172033' }}>{selected.comentario}</p>
              </div>
            )}
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: '#DCE3EA', color: '#5F6B7A' }}>
                <Download size={13} /> Descargar
              </button>
              {selected.estado === 'pendiente' && (
                <button className="flex-1 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
                  Aprobar
                </button>
              )}
              {selected.estado === 'aprobado' && (
                <button className="flex-1 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#D1FAE5', color: '#168A5B' }}>
                  ✓ Aprobado
                </button>
              )}
            </div>
            {selected.estado !== 'observado' && (
              <button className="w-full py-2 rounded-lg text-sm font-medium border"
                style={{ borderColor: '#FDE68A', color: '#B7791F', backgroundColor: '#FFFBEB' }}>
                Agregar observación
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
