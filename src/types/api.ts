// Tipos de datos retornados por la API Backend SMCPP

export type RolBackend = 'ADMINISTRADOR' | 'COORDINADOR' | 'ESTUDIANTE' | 'TUTOR';
export type EstadoConvenioBackend = 'ACTIVO' | 'POR_VENCER' | 'VENCIDO' | 'SUSPENDIDO';
export type EstadoPostulacionBackend = 'PENDIENTE' | 'EN_REVISION' | 'OBSERVADA' | 'APROBADA' | 'RECHAZADA';
export type EstadoDocumentoBackend = 'PENDIENTE' | 'APROBADO' | 'OBSERVADO';
export type EstadoHorasBackend = 'PENDIENTE' | 'APROBADA' | 'OBSERVADA';
export type EstadoEvaluacionBackend = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADA' | 'VENCIDA';
export type CategoriaNotificacionBackend = 'POSTULACIONES' | 'DOCUMENTOS' | 'HORAS' | 'EVALUACIONES' | 'SISTEMA';
export type PrioridadBackend = 'ALTA' | 'MEDIA' | 'BAJA';

export interface UsuarioBackend {
  id: string;
  nombre: string;
  email: string;
  rol: RolBackend;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    codigo: string;
    escuela: string;
    ciclo: number;
  };
  tutorEmpresarial?: {
    cargo?: string;
    empresa?: {
      nombre: string;
    };
  };
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
  convenios?: ConvenioBackend[];
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
  empresa?: EmpresaBackend;
}

export interface PostulacionBackend {
  id: string;
  codigo: string;
  estudianteId: string;
  empresaId: string;
  convenioId?: string;
  responsableId?: string;
  tutorId?: string;
  fechaEnvio: string;
  area: string;
  modalidad: string;
  fechaInicio?: string;
  fechaFin?: string;
  horasSemanales: number;
  motivacion?: string;
  descripcion?: string;
  etapa: number;
  estado: EstadoPostulacionBackend;
  observaciones?: string;
  estudiante?: {
    usuario?: {
      nombre: string;
      email: string;
    };
    codigo: string;
    escuela: string;
    ciclo: number;
  };
  empresa?: {
    nombre: string;
    rubro: string;
  };
  responsable?: {
    nombre: string;
  };
  tutor?: {
    usuario?: {
      nombre: string;
    };
  };
  _count?: {
    documentos: number;
    registrosHoras: number;
    evaluaciones: number;
  };
}

export interface DocumentoBackend {
  id: string;
  postulacionId: string;
  estudianteId: string;
  nombre: string;
  nombreInterno?: string;
  tipo: string;
  ruta: string;
  tamano: number;
  version: number;
  estado: EstadoDocumentoBackend;
  comentario?: string;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    usuario?: {
      nombre: string;
      email: string;
    };
  };
  postulacion?: {
    codigo: string;
    empresa?: {
      nombre: string;
    };
  };
}

export interface RegistroHoraBackend {
  id: string;
  postulacionId: string;
  estudianteId: string;
  tutorId?: string;
  semana?: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  minutosPausa: number;
  horasCalculadas: number;
  horasRegistradas: number;
  horasAcumuladas: number;
  actividad: string;
  evidencia: boolean;
  evidenciaUrl?: string;
  estado: EstadoHorasBackend;
  comentario?: string;
  fechaValidacion?: string;
  createdAt: string;
  updatedAt: string;
  estudiante?: {
    usuario?: {
      nombre: string;
      email: string;
    };
  };
  postulacion?: {
    codigo: string;
    empresa?: {
      nombre: string;
    };
  };
}

export interface ResumenHorasBackend {
  registros: RegistroHoraBackend[];
  resumen: {
    acumuladas: number;
    meta: number;
    aprobadas: number;
    pendientes: number;
    observadas: number;
    porcentaje: number;
  };
}

export interface CriterioEvaluacionBackend {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string;
  peso: number;
}

export interface DetalleEvaluacionBackend {
  id?: string;
  evaluacionId?: string;
  criterioId: string;
  puntaje: number;
  comentario?: string;
  criterio?: CriterioEvaluacionBackend;
}

export interface EvaluacionBackend {
  id: string;
  postulacionId: string;
  estudianteId: string;
  tutorId?: string;
  fechaLimite: string;
  avance: number;
  resultado?: number;
  estado: EstadoEvaluacionBackend;
  fortalezas?: string;
  aspectosMejorar?: string;
  fechaEnvio?: string;
  estudiante?: {
    usuario?: {
      nombre: string;
      email: string;
    };
  };
  tutor?: {
    usuario?: {
      nombre: string;
    };
  };
  postulacion?: {
    codigo: string;
    empresa?: {
      nombre: string;
    };
  };
  detalles?: DetalleEvaluacionBackend[];
}

export interface NotificacionBackend {
  id: string;
  usuarioId: string;
  categoria: CategoriaNotificacionBackend;
  titulo: string;
  resumen: string;
  prioridad: PrioridadBackend;
  leida: boolean;
  accionUrl?: string;
  createdAt: string;
}

export interface ResumenReportesBackend {
  totalEstudiantes: number;
  totalEmpresas: number;
  conveniosActivos: number;
  conveniosPorVencer: number;
  postulacionesAprobadas: number;
  postulacionesPendientes: number;
  horasTotalesAprobadas: number;
  promedioEvaluaciones: number;
  evaluacionesCompletadas: number;
}

export interface SeguimientoEstudianteBackend {
  id: string;
  codigo: string;
  nombre: string;
  email: string;
  escuela: string;
  ciclo: number;
  empresa: string;
  estadoPostulacion: string;
  horasAprobadas: number;
  metaHoras: number;
  porcentajeHoras: number;
  docsProgreso: string;
  evaluacionEstado: string;
  evaluacionResultado?: number;
  retraso: boolean;
}

/** Alias para la estructura del usuario devuelta por /auth/me */
export type UserData = UsuarioBackend;
export type UserBackend = UsuarioBackend;

/** Respuesta del endpoint POST /api/auth/login (después de auto-unwrap { data }) */
export interface LoginResponse {
  token: string;
  user: UsuarioBackend;
}

