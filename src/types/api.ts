export type RolBackend = 'ADMINISTRADOR' | 'COORDINADOR' | 'ESTUDIANTE' | 'TUTOR';
export type EstadoConvenioBackend = 'ACTIVO' | 'POR_VENCER' | 'VENCIDO' | 'SUSPENDIDO';
export type EstadoPostulacionBackend = 'PENDIENTE' | 'EN_REVISION' | 'OBSERVADA' | 'APROBADA' | 'RECHAZADA';
export type EstadoDocumentoBackend = 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
export type EstadoHorasBackend = 'PENDIENTE' | 'APROBADA' | 'OBSERVADA';
export type CategoriaNotificacionBackend = 'POSTULACIONES' | 'DOCUMENTOS' | 'HORAS' | 'EVALUACIONES' | 'SISTEMA';
export type PrioridadBackend = 'ALTA' | 'MEDIA' | 'BAJA';

export interface ApiResponse<T> {
  data: T;
  error?: string;
  code?: string;
}

export interface UserBackend {
  id: string;
  nombre: string;
  email: string;
  rol: RolBackend;
  estudiante?: { id: string; codigo: string; escuela: string } | null;
  tutor?: { id: string; empresaId: string } | null;
}

export interface LoginResponse {
  token: string;
  user: UserBackend;
}

export interface EmpresaBackend {
  id: string;
  nombre: string;
  rubro: string;
  ubicacion: string;
  modalidad: string;
  vacantes: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  convenios?: Array<{
    id: string;
    codigo: string;
    estado: EstadoConvenioBackend;
    inicio: string;
    vencimiento: string;
    vacantes: number;
    estudiantesActivos: number;
  }>;
  _count?: { convenios: number; postulaciones: number; tutores?: number };
}

export interface ConvenioBackend {
  id: string;
  codigo: string;
  empresaId: string;
  rubro: string;
  inicio: string;
  vencimiento: string;
  vacantes: number;
  estudiantesActivos: number;
  estado: EstadoConvenioBackend;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  empresa?: { id: string; nombre: string; ubicacion: string };
}

export interface PostulacionBackend {
  id: string;
  codigo: string;
  estudianteId: string;
  empresaId: string;
  convenioId?: string | null;
  responsableId?: string | null;
  tutorId?: string | null;
  fechaEnvio: string;
  area: string;
  modalidad: string;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  horasSemanales: number;
  motivacion?: string | null;
  descripcion?: string | null;
  etapa: number;
  estado: EstadoPostulacionBackend;
  observaciones?: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    id: string;
    usuario: {
      id: string;
      nombre: string;
      email: string;
      estudiante?: { id: string; codigo: string; escuela: string; iniciales: string; color: string };
    };
  };
  empresa?: { id: string; nombre: string; rubro: string; modalidad: string };
  convenio?: { id: string; codigo: string; estado: EstadoConvenioBackend } | null;
  responsable?: { id: string; nombre: string } | null;
  tutor?: { usuario: { id: string; nombre: string } } | null;
  _count?: { documentos: number; registrosHoras: number; evaluaciones: number };
}

export interface NotificacionBackend {
  id: string;
  usuarioId: string;
  categoria: CategoriaNotificacionBackend;
  titulo: string;
  resumen: string;
  prioridad: PrioridadBackend;
  leida: boolean;
  accionUrl?: string | null;
  createdAt: string;
}
