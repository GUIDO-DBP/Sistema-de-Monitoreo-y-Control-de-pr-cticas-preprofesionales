export type EstadoPostulacion = 'pendiente' | 'en_revision' | 'observada' | 'aprobada' | 'rechazada';
export type Prioridad = 'alta' | 'media' | 'baja';
export type EstadoConvenio = 'activo' | 'por_vencer' | 'vencido' | 'suspendido';
export type EstadoHoras = 'aprobada' | 'pendiente' | 'observada';
export type EstadoEvaluacion = 'pendiente' | 'en_proceso' | 'completada' | 'vencida';

export interface Estudiante {
  id: string;
  nombre: string;
  codigo: string;
  escuela: string;
  ciclo: number;
  email: string;
  telefono: string;
  iniciales: string;
  color: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  rubro: string;
  ubicacion: string;
  modalidad: string;
  vacantes: number;
}

export interface Convenio {
  id: string;
  codigo: string;
  empresa: string;
  empresaId: string;
  rubro: string;
  inicio: string;
  vencimiento: string;
  vacantes: number;
  estudiantesActivos: number;
  estado: EstadoConvenio;
}

export interface Postulacion {
  id: string;
  codigo: string;
  estudiante: Estudiante;
  empresa: string;
  empresaId: string;
  fechaEnvio: string;
  progresoDocs: number;
  totalDocs: number;
  estado: EstadoPostulacion;
  ultimaActualizacion: string;
  responsable: string;
  tutor: string;
  area: string;
  modalidad: string;
  fechaInicio: string;
  fechaFin: string;
  horasSemanales: number;
  motivacion: string;
  etapa: number;
}

export interface TareasBandeja {
  id: string;
  tipo: string;
  titulo: string;
  descripcion: string;
  estudiante?: string;
  convenio?: string;
  fechaLimite: string;
  prioridad: Prioridad;
  responsable: string;
  estado: 'pendiente' | 'en_revision' | 'esperando' | 'resuelto';
}

export interface RegistroHoras {
  id: string;
  estudiante: Estudiante;
  empresa: string;
  semana: string;
  horasRegistradas: number;
  horasAcumuladas: number;
  evidencia: boolean;
  estado: EstadoHoras;
  tutor: string;
}

export interface Evaluacion {
  id: string;
  estudiante: Estudiante;
  empresa: string;
  tutor: string;
  fechaLimite: string;
  avance: number;
  resultado?: number;
  estado: EstadoEvaluacion;
}

export interface Notificacion {
  id: string;
  categoria: 'postulaciones' | 'documentos' | 'horas' | 'evaluaciones' | 'sistema';
  titulo: string;
  resumen: string;
  hora: string;
  prioridad: Prioridad;
  leida: boolean;
  accionUrl?: string;
}

export const estudiantes: Estudiante[] = [
  { id: 'e1', nombre: 'Ana Torres Mamani', codigo: '2021-0145', escuela: 'Ingeniería de Sistemas', ciclo: 9, email: 'a.torres@univ.edu.pe', telefono: '987 654 321', iniciales: 'AT', color: '#2563EB' },
  { id: 'e2', nombre: 'Luis Quispe Condori', codigo: '2021-0089', escuela: 'Ingeniería Industrial', ciclo: 8, email: 'l.quispe@univ.edu.pe', telefono: '976 543 210', iniciales: 'LQ', color: '#0F9F92' },
  { id: 'e3', nombre: 'Daniela Flores Choque', codigo: '2022-0213', escuela: 'Administración', ciclo: 7, email: 'd.flores@univ.edu.pe', telefono: '965 432 109', iniciales: 'DF', color: '#B7791F' },
  { id: 'e4', nombre: 'Diego Apaza Ramos', codigo: '2021-0302', escuela: 'Contabilidad', ciclo: 9, email: 'd.apaza@univ.edu.pe', telefono: '954 321 098', iniciales: 'DA', color: '#168A5B' },
  { id: 'e5', nombre: 'Carmen Huanca Yucra', codigo: '2022-0178', escuela: 'Ingeniería de Sistemas', ciclo: 8, email: 'c.huanca@univ.edu.pe', telefono: '943 210 987', iniciales: 'CH', color: '#D65A31' },
  { id: 'e6', nombre: 'Marco Condori Ticona', codigo: '2021-0267', escuela: 'Ingeniería Industrial', ciclo: 9, email: 'm.condori@univ.edu.pe', telefono: '932 109 876', iniciales: 'MC', color: '#7A3DB8' },
  { id: 'e7', nombre: 'Rosa Mamani Turpo', codigo: '2022-0094', escuela: 'Administración', ciclo: 7, email: 'r.mamani@univ.edu.pe', telefono: '921 098 765', iniciales: 'RM', color: '#C43D4D' },
];

export const empresas: Empresa[] = [
  { id: 'emp1', nombre: 'AndesTech Solutions', rubro: 'Tecnología', ubicacion: 'Puno, Perú', modalidad: 'Presencial', vacantes: 4 },
  { id: 'emp2', nombre: 'DataSur Consultores', rubro: 'Consultoría', ubicacion: 'Juliaca, Perú', modalidad: 'Híbrido', vacantes: 3 },
  { id: 'emp3', nombre: 'Municipalidad Provincial de Puno', rubro: 'Sector Público', ubicacion: 'Puno, Perú', modalidad: 'Presencial', vacantes: 6 },
  { id: 'emp4', nombre: 'Altiplano Digital', rubro: 'Marketing Digital', ubicacion: 'Puno, Perú', modalidad: 'Remoto', vacantes: 2 },
  { id: 'emp5', nombre: 'InnovaSoft Perú', rubro: 'Desarrollo de Software', ubicacion: 'Lima, Perú', modalidad: 'Híbrido', vacantes: 5 },
  { id: 'emp6', nombre: 'Contaperú Asociados', rubro: 'Contabilidad', ubicacion: 'Puno, Perú', modalidad: 'Presencial', vacantes: 2 },
];

export const convenios: Convenio[] = [
  { id: 'cv1', codigo: 'CV-2024-018', empresa: 'AndesTech Solutions', empresaId: 'emp1', rubro: 'Tecnología', inicio: '2024-03-01', vencimiento: '2026-08-01', vacantes: 4, estudiantesActivos: 3, estado: 'por_vencer' },
  { id: 'cv2', codigo: 'CV-2024-032', empresa: 'DataSur Consultores', empresaId: 'emp2', rubro: 'Consultoría', inicio: '2024-06-15', vencimiento: '2026-12-15', vacantes: 3, estudiantesActivos: 2, estado: 'activo' },
  { id: 'cv3', codigo: 'CV-2023-007', empresa: 'Municipalidad Provincial de Puno', empresaId: 'emp3', rubro: 'Sector Público', inicio: '2023-09-01', vencimiento: '2026-09-01', vacantes: 6, estudiantesActivos: 5, estado: 'activo' },
  { id: 'cv4', codigo: 'CV-2025-001', empresa: 'Altiplano Digital', empresaId: 'emp4', rubro: 'Marketing Digital', inicio: '2025-01-10', vencimiento: '2027-01-10', vacantes: 2, estudiantesActivos: 1, estado: 'activo' },
  { id: 'cv5', codigo: 'CV-2024-051', empresa: 'InnovaSoft Perú', empresaId: 'emp5', rubro: 'Desarrollo de Software', inicio: '2024-08-01', vencimiento: '2026-08-10', vacantes: 5, estudiantesActivos: 4, estado: 'por_vencer' },
  { id: 'cv6', codigo: 'CV-2025-012', empresa: 'Contaperú Asociados', empresaId: 'emp6', rubro: 'Contabilidad', inicio: '2025-02-01', vencimiento: '2027-02-01', vacantes: 2, estudiantesActivos: 2, estado: 'activo' },
];

export const postulaciones: Postulacion[] = [
  { id: 'p1', codigo: 'SMCPP-2026-048', estudiante: estudiantes[0], empresa: 'AndesTech Solutions', empresaId: 'emp1', fechaEnvio: '2026-03-20', progresoDocs: 4, totalDocs: 5, estado: 'en_revision', ultimaActualizacion: 'Hace 2 horas', responsable: 'Coord. Ramos', tutor: 'Ing. Carlos Medina', area: 'Desarrollo de software', modalidad: 'Presencial', fechaInicio: '2026-04-01', fechaFin: '2026-07-31', horasSemanales: 30, motivacion: 'Deseo aplicar los conocimientos de programación en un entorno empresarial real.', etapa: 3 },
  { id: 'p2', codigo: 'SMCPP-2026-049', estudiante: estudiantes[1], empresa: 'DataSur Consultores', empresaId: 'emp2', fechaEnvio: '2026-03-22', progresoDocs: 5, totalDocs: 5, estado: 'aprobada', ultimaActualizacion: 'Hace 1 día', responsable: 'Coord. Ramos', tutor: 'Lic. Sandra Vega', area: 'Análisis de datos', modalidad: 'Híbrido', fechaInicio: '2026-04-05', fechaFin: '2026-08-05', horasSemanales: 25, motivacion: 'Quiero fortalecer mis habilidades en análisis de datos con herramientas modernas.', etapa: 5 },
  { id: 'p3', codigo: 'SMCPP-2026-050', estudiante: estudiantes[2], empresa: 'Municipalidad Provincial de Puno', empresaId: 'emp3', fechaEnvio: '2026-03-25', progresoDocs: 3, totalDocs: 5, estado: 'observada', ultimaActualizacion: 'Hace 3 horas', responsable: 'Coord. Quispe', tutor: 'Dr. Pedro Huanca', area: 'Gestión pública', modalidad: 'Presencial', fechaInicio: '2026-04-10', fechaFin: '2026-08-10', horasSemanales: 30, motivacion: 'Contribuir al desarrollo de la gestión pública local.', etapa: 2 },
  { id: 'p4', codigo: 'SMCPP-2026-051', estudiante: estudiantes[3], empresa: 'Altiplano Digital', empresaId: 'emp4', fechaEnvio: '2026-03-28', progresoDocs: 5, totalDocs: 5, estado: 'aprobada', ultimaActualizacion: 'Hace 2 días', responsable: 'Coord. Ramos', tutor: 'Lic. Diana Flores', area: 'Contabilidad digital', modalidad: 'Remoto', fechaInicio: '2026-04-15', fechaFin: '2026-08-15', horasSemanales: 20, motivacion: 'Aprender sobre contabilidad en empresas del sector digital.', etapa: 4 },
  { id: 'p5', codigo: 'SMCPP-2026-052', estudiante: estudiantes[4], empresa: 'InnovaSoft Perú', empresaId: 'emp5', fechaEnvio: '2026-04-01', progresoDocs: 2, totalDocs: 5, estado: 'pendiente', ultimaActualizacion: 'Hace 1 hora', responsable: 'Coord. Quispe', tutor: '', area: 'Desarrollo backend', modalidad: 'Híbrido', fechaInicio: '2026-04-20', fechaFin: '2026-08-20', horasSemanales: 30, motivacion: 'Especializarme en desarrollo de APIs y microservicios.', etapa: 1 },
  { id: 'p6', codigo: 'SMCPP-2026-053', estudiante: estudiantes[5], empresa: 'DataSur Consultores', empresaId: 'emp2', fechaEnvio: '2026-04-02', progresoDocs: 4, totalDocs: 5, estado: 'en_revision', ultimaActualizacion: 'Hace 5 horas', responsable: 'Coord. Ramos', tutor: 'Lic. Sandra Vega', area: 'Consultoría industrial', modalidad: 'Presencial', fechaInicio: '2026-04-25', fechaFin: '2026-08-25', horasSemanales: 30, motivacion: 'Aplicar metodologías de mejora continua en un entorno real.', etapa: 2 },
  { id: 'p7', codigo: 'SMCPP-2026-054', estudiante: estudiantes[6], empresa: 'AndesTech Solutions', empresaId: 'emp1', fechaEnvio: '2026-04-05', progresoDocs: 1, totalDocs: 5, estado: 'rechazada', ultimaActualizacion: 'Hace 4 días', responsable: 'Coord. Quispe', tutor: '', area: 'Marketing digital', modalidad: 'Remoto', fechaInicio: '', fechaFin: '', horasSemanales: 20, motivacion: 'Explorar estrategias de marketing en el sector tecnológico.', etapa: 1 },
];

export const tareasBandeja: TareasBandeja[] = [
  { id: 't1', tipo: 'Documento', titulo: 'Revisar corrección de carta de presentación', descripcion: 'Ana Torres corrigió el documento observado. Pendiente de revisión por coordinador.', estudiante: 'Ana Torres Mamani', fechaLimite: '2026-07-24', prioridad: 'alta', responsable: 'Coord. Ramos', estado: 'pendiente' },
  { id: 't2', tipo: 'Horas', titulo: 'Validar registro semanal de horas', descripcion: 'Luis Quispe registró 28 horas para la semana del 14 al 20 de julio.', estudiante: 'Luis Quispe Condori', fechaLimite: '2026-07-23', prioridad: 'media', responsable: 'Coord. Ramos', estado: 'en_revision' },
  { id: 't3', tipo: 'Convenio', titulo: 'Renovar convenio próximo a vencer', descripcion: 'El convenio CV-2024-018 con AndesTech Solutions vence el 1 de agosto.', convenio: 'CV-2024-018', fechaLimite: '2026-08-01', prioridad: 'alta', responsable: 'Coord. Ramos', estado: 'pendiente' },
  { id: 't4', tipo: 'Evaluación', titulo: 'Solicitar evaluación al tutor empresarial', descripcion: 'La evaluación de Diego Apaza está próxima a su fecha límite.', estudiante: 'Diego Apaza Ramos', fechaLimite: '2026-07-25', prioridad: 'alta', responsable: 'Coord. Ramos', estado: 'esperando' },
  { id: 't5', tipo: 'Documento', titulo: 'Revisión de plan de actividades', descripcion: 'Daniela Flores envió una nueva versión del plan de actividades.', estudiante: 'Daniela Flores Choque', fechaLimite: '2026-07-26', prioridad: 'media', responsable: 'Coord. Quispe', estado: 'en_revision' },
  { id: 't6', tipo: 'Postulación', titulo: 'Aprobar postulación pendiente', descripcion: 'Carmen Huanca completó los documentos faltantes y espera aprobación.', estudiante: 'Carmen Huanca Yucra', fechaLimite: '2026-07-27', prioridad: 'media', responsable: 'Coord. Quispe', estado: 'pendiente' },
  { id: 't7', tipo: 'Convenio', titulo: 'Renovar convenio InnovaSoft Perú', descripcion: 'El convenio CV-2024-051 vence el 10 de agosto. Iniciar proceso.', convenio: 'CV-2024-051', fechaLimite: '2026-08-10', prioridad: 'alta', responsable: '', estado: 'pendiente' },
  { id: 't8', tipo: 'Horas', titulo: 'Investigar horas duplicadas', descripcion: 'El sistema detectó un posible registro duplicado para el 18 de julio.', estudiante: 'Marco Condori Ticona', fechaLimite: '2026-07-24', prioridad: 'alta', responsable: '', estado: 'pendiente' },
];

export const registrosHoras: RegistroHoras[] = [
  { id: 'rh1', estudiante: estudiantes[0], empresa: 'AndesTech Solutions', semana: '14–20 jul', horasRegistradas: 30, horasAcumuladas: 186, evidencia: true, estado: 'aprobada', tutor: 'Ing. Carlos Medina' },
  { id: 'rh2', estudiante: estudiantes[1], empresa: 'DataSur Consultores', semana: '14–20 jul', horasRegistradas: 25, horasAcumuladas: 210, evidencia: true, estado: 'pendiente', tutor: 'Lic. Sandra Vega' },
  { id: 'rh3', estudiante: estudiantes[2], empresa: 'Municipalidad Provincial', semana: '14–20 jul', horasRegistradas: 28, horasAcumuladas: 140, evidencia: false, estado: 'observada', tutor: 'Dr. Pedro Huanca' },
  { id: 'rh4', estudiante: estudiantes[3], empresa: 'Altiplano Digital', semana: '14–20 jul', horasRegistradas: 20, horasAcumuladas: 176, evidencia: true, estado: 'aprobada', tutor: 'Lic. Diana Flores' },
  { id: 'rh5', estudiante: estudiantes[4], empresa: 'InnovaSoft Perú', semana: '14–20 jul', horasRegistradas: 22, horasAcumuladas: 88, evidencia: true, estado: 'pendiente', tutor: '' },
];

export const evaluaciones: Evaluacion[] = [
  { id: 'ev1', estudiante: estudiantes[0], empresa: 'AndesTech Solutions', tutor: 'Ing. Carlos Medina', fechaLimite: '2026-07-31', avance: 60, resultado: undefined, estado: 'en_proceso' },
  { id: 'ev2', estudiante: estudiantes[1], empresa: 'DataSur Consultores', tutor: 'Lic. Sandra Vega', fechaLimite: '2026-08-05', avance: 100, resultado: 4.2, estado: 'completada' },
  { id: 'ev3', estudiante: estudiantes[2], empresa: 'Municipalidad Provincial', tutor: 'Dr. Pedro Huanca', fechaLimite: '2026-07-25', avance: 0, resultado: undefined, estado: 'pendiente' },
  { id: 'ev4', estudiante: estudiantes[3], empresa: 'Altiplano Digital', tutor: 'Lic. Diana Flores', fechaLimite: '2026-07-20', avance: 0, resultado: undefined, estado: 'vencida' },
  { id: 'ev5', estudiante: estudiantes[4], empresa: 'InnovaSoft Perú', tutor: '', fechaLimite: '2026-08-20', avance: 0, resultado: undefined, estado: 'pendiente' },
];

export const notificaciones: Notificacion[] = [
  { id: 'n1', categoria: 'documentos', titulo: 'Corrección de documento enviada', resumen: 'Daniela Flores envió una corrección del documento "Carta de presentación".', hora: 'Hace 30 min', prioridad: 'alta', leida: false, accionUrl: '/postulaciones/SMCPP-2026-050' },
  { id: 'n2', categoria: 'postulaciones', titulo: 'Convenio próximo a vencer', resumen: 'El convenio CV-2024-018 con AndesTech Solutions vence en 12 días.', hora: 'Hace 1 hora', prioridad: 'alta', leida: false, accionUrl: '/convenios' },
  { id: 'n3', categoria: 'evaluaciones', titulo: 'Evaluación completada', resumen: 'El tutor de Luis Quispe completó la evaluación de desempeño con puntaje 4.2.', hora: 'Hace 2 horas', prioridad: 'media', leida: false, accionUrl: '/evaluaciones' },
  { id: 'n4', categoria: 'horas', titulo: 'Registro duplicado detectado', resumen: 'Se detectó un posible registro duplicado de horas para Marco Condori el 18 de julio.', hora: 'Hace 3 horas', prioridad: 'alta', leida: true, accionUrl: '/control-horas' },
  { id: 'n5', categoria: 'postulaciones', titulo: 'Nueva postulación recibida', resumen: 'Carmen Huanca Yucra envió una nueva postulación para InnovaSoft Perú.', hora: 'Ayer, 16:45', prioridad: 'media', leida: true, accionUrl: '/postulaciones' },
  { id: 'n6', categoria: 'sistema', titulo: 'Periodo académico activo', resumen: 'El periodo 2026-I está activo. Quedan 3 días para el cierre de documentación.', hora: 'Ayer, 09:00', prioridad: 'baja', leida: true },
];

export const actividadReciente = [
  { id: 'ar1', avatar: 'AT', color: '#2563EB', texto: 'Ana Torres corrigió dos documentos.', hora: 'Hace 30 min', tipo: 'Documento' },
  { id: 'ar2', avatar: 'CM', color: '#0F9F92', texto: 'El tutor Carlos Medina validó 8 horas.', hora: 'Hace 1 h', tipo: 'Horas' },
  { id: 'ar3', avatar: 'LQ', color: '#168A5B', texto: 'Se aprobó la postulación de Luis Quispe.', hora: 'Hace 2 h', tipo: 'Postulación' },
  { id: 'ar4', avatar: '!', color: '#B7791F', texto: 'El convenio con AndesTech vence en 15 días.', hora: 'Hace 3 h', tipo: 'Alerta' },
  { id: 'ar5', avatar: 'DF', color: '#D65A31', texto: 'Daniela Flores envió documentos para revisión.', hora: 'Hace 4 h', tipo: 'Documento' },
];

// Notifications specific to the student role (Ana Torres Mamani)
export const notificacionesEstudiante: Notificacion[] = [
  { id: 'ne1', categoria: 'documentos', titulo: 'Documento observado', resumen: 'Tu carta de presentación fue observada por el coordinador. Por favor, revisa y corrige.', hora: 'Hace 1 hora', prioridad: 'alta', leida: false, accionUrl: '/mis-documentos' },
  { id: 'ne2', categoria: 'horas', titulo: 'Horas de la semana aprobadas', resumen: 'El tutor Ing. Carlos Medina aprobó tu registro de 30 horas de la semana del 14 al 20 de julio.', hora: 'Hace 3 horas', prioridad: 'media', leida: false, accionUrl: '/mis-horas' },
  { id: 'ne3', categoria: 'postulaciones', titulo: 'Estado de tu postulación actualizado', resumen: 'Tu postulación SMCPP-2026-048 pasó a estado "En revisión". El coordinador está evaluando tu expediente.', hora: 'Ayer, 14:30', prioridad: 'media', leida: false, accionUrl: '/mi-postulacion' },
  { id: 'ne4', categoria: 'evaluaciones', titulo: 'Evaluación programada', resumen: 'Tu tutor empresarial ha iniciado el proceso de evaluación de desempeño. Fecha límite: 31 de julio.', hora: 'Ayer, 10:00', prioridad: 'alta', leida: true, accionUrl: '/mi-evaluacion' },
  { id: 'ne5', categoria: 'sistema', titulo: 'Periodo 2026-I activo', resumen: 'El periodo académico 2026-I está activo. Recuerda registrar tus horas semanalmente.', hora: 'Hace 2 días', prioridad: 'baja', leida: true },
];
