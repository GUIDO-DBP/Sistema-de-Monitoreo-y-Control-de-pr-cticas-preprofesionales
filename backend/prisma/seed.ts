import { PrismaClient, Rol, EstadoConvenio, EstadoPostulacion, EstadoDocumento, EstadoHoras, EstadoEvaluacion, CategoriaNotificacion, Prioridad } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive database seed for SMCPP...');

  // Clean existing data in reverse order of foreign keys
  await prisma.auditoria.deleteMany();
  await prisma.notificacion.deleteMany();
  await prisma.detalleEvaluacion.deleteMany();
  await prisma.evaluacion.deleteMany();
  await prisma.criterioEvaluacion.deleteMany();
  await prisma.registroHora.deleteMany();
  await prisma.documento.deleteMany();
  await prisma.postulacion.deleteMany();
  await prisma.convenio.deleteMany();
  await prisma.tutorEmpresarial.deleteMany();
  await prisma.empresa.deleteMany();
  await prisma.estudiante.deleteMany();
  await prisma.usuario.deleteMany();

  // 1. Password hashes
  const adminPassword = await bcrypt.hash('Admin123*', 12);
  const coordPassword = await bcrypt.hash('Coordinador123*', 12);
  const studentPassword = await bcrypt.hash('Estudiante123*', 12);
  const tutorPassword = await bcrypt.hash('Tutor123*', 12);

  // 2. Create Users: 1 Admin, 2 Coordinadores, 8 Estudiantes, 4 Tutores = 15 Usuarios
  const uAdmin = await prisma.usuario.create({
    data: { nombre: 'Administrador General', email: 'admin@unap.edu.pe', passwordHash: adminPassword, rol: Rol.ADMINISTRADOR },
  });

  const uCoord1 = await prisma.usuario.create({
    data: { nombre: 'Coord. Carlos Ramos', email: 'coordinador@unap.edu.pe', passwordHash: coordPassword, rol: Rol.COORDINADOR },
  });

  const uCoord2 = await prisma.usuario.create({
    data: { nombre: 'Coord. Elena Morales', email: 'elena.morales@unap.edu.pe', passwordHash: coordPassword, rol: Rol.COORDINADOR },
  });

  // 8 Estudiantes
  const studentUsersData = [
    { nombre: 'Ana Torres Mamani', email: 'ana.torres@unap.edu.pe', codigo: '2021064821', escuela: 'Ingeniería de Sistemas', ciclo: 9, telefono: '951234567', iniciales: 'AT', color: '#2563EB' },
    { nombre: 'Juan Diego Pérez', email: 'juan.perez@unap.edu.pe', codigo: '2021064822', escuela: 'Ingeniería de Sistemas', ciclo: 9, telefono: '952345678', iniciales: 'JP', color: '#10B981' },
    { nombre: 'Lucía Mendoza Quispe', email: 'lucia.mendoza@unap.edu.pe', codigo: '2021064823', escuela: 'Ingeniería de Sistemas', ciclo: 10, telefono: '953456789', iniciales: 'LM', color: '#F59E0B' },
    { nombre: 'Mateo Colque Huanca', email: 'mateo.colque@unap.edu.pe', codigo: '2021064824', escuela: 'Ingeniería Electrónica', ciclo: 8, telefono: '954567890', iniciales: 'MC', color: '#8B5CF6' },
    { nombre: 'Sofia Paredes Vilca', email: 'sofia.paredes@unap.edu.pe', codigo: '2021064825', escuela: 'Ingeniería de Sistemas', ciclo: 9, telefono: '955678901', iniciales: 'SP', color: '#EC4899' },
    { nombre: 'Diego Flores Apaza', email: 'diego.flores@unap.edu.pe', codigo: '2021064826', escuela: 'Ingeniería Estadística', ciclo: 9, telefono: '956789012', iniciales: 'DF', color: '#06B6D4' },
    { nombre: 'Camila Choque Condori', email: 'camila.choque@unap.edu.pe', codigo: '2021064827', escuela: 'Ingeniería de Sistemas', ciclo: 10, telefono: '957890123', iniciales: 'CC', color: '#84CC16' },
    { nombre: 'Renato Mamani Cruz', email: 'renato.mamani@unap.edu.pe', codigo: '2021064828', escuela: 'Ingeniería de Sistemas', ciclo: 8, telefono: '958901234', iniciales: 'RM', color: '#6366F1' },
  ];

  const estudiantes: any[] = [];
  for (const s of studentUsersData) {
    const u = await prisma.usuario.create({
      data: { nombre: s.nombre, email: s.email, passwordHash: studentPassword, rol: Rol.ESTUDIANTE },
    });
    const est = await prisma.estudiante.create({
      data: { usuarioId: u.id, codigo: s.codigo, escuela: s.escuela, ciclo: s.ciclo, telefono: s.telefono, iniciales: s.iniciales, color: s.color },
    });
    estudiantes.push({ usuario: u, estudiante: est });
  }

  // 7 Empresas Receptoras
  const empresasData = [
    { nombre: 'AndesTech Solutions', rubro: 'Desarrollo de software y consultoría TI', ubicacion: 'Av. Floral 450, Puno', modalidad: 'Híbrido', vacantes: 5 },
    { nombre: 'IncaSoft Global', rubro: 'Desarrollo Web & Cloud Computing', ubicacion: 'Jr. Lima 320, Puno', modalidad: 'Presencial', vacantes: 4 },
    { nombre: 'Altiplano Data Systems', rubro: 'Ciencia de Datos y Analytics', ubicacion: 'Av. El Sol 890, Juliaca', modalidad: 'Remoto', vacantes: 3 },
    { nombre: 'CyberSec Peru', rubro: 'Ciberseguridad & Auditoría de Redes', ubicacion: 'Jr. Arequipa 150, Puno', modalidad: 'Híbrido', vacantes: 2 },
    { nombre: 'Logística & TI Sur S.A.C.', rubro: 'Sistemas Integrados de Gestión ERP', ubicacion: 'Av. Circunvalación 1100, Juliaca', modalidad: 'Presencial', vacantes: 6 },
    { nombre: 'GeoMin Analytics', rubro: 'Sistemas de Información Geográfica (GIS)', ubicacion: 'Jr. Deustua 410, Puno', modalidad: 'Presencial', vacantes: 3 },
    { nombre: 'Innovasistencia S.A.', rubro: 'Soporte TI & Infraestructura Cloud', ubicacion: 'Av. La Torre 600, Puno', modalidad: 'Remoto', vacantes: 4 },
  ];

  const empresas: any[] = [];
  for (const e of empresasData) {
    const emp = await prisma.empresa.create({ data: e });
    empresas.push(emp);
  }

  // 4 Tutores Empresariales
  const tutoresData = [
    { nombre: 'Ing. Carlos Medina', email: 'carlos.medina@andestech.pe', cargo: 'Jefe de Desarrollo', empresaIdx: 0 },
    { nombre: 'Ing. Maria Huanca', email: 'm.huanca@incasoft.pe', cargo: 'Líder Técnico Cloud', empresaIdx: 1 },
    { nombre: 'Ing. Roberto Benítez', email: 'r.benitez@altiplanodata.pe', cargo: 'Director de Analítica', empresaIdx: 2 },
    { nombre: 'Ing. Gabriel Vizcarra', email: 'g.vizcarra@cybersec.pe', cargo: 'Consultor Principal de Ciberseguridad', empresaIdx: 3 },
  ];

  const tutores: any[] = [];
  for (const t of tutoresData) {
    const u = await prisma.usuario.create({
      data: { nombre: t.nombre, email: t.email, passwordHash: tutorPassword, rol: Rol.TUTOR },
    });
    const tut = await prisma.tutorEmpresarial.create({
      data: { usuarioId: u.id, empresaId: empresas[t.empresaIdx].id, cargo: t.cargo },
    });
    tutores.push({ usuario: u, tutor: tut });
  }

  // 7 Convenios: 4 activos, 2 próximos a vencer, 1 vencido
  const conveniosData = [
    { codigo: 'CONV-2026-001', empresaIdx: 0, rubro: 'Tecnología de la Información', inicio: new Date('2026-01-15'), vencimiento: new Date('2026-12-31'), vacantes: 5, estudiantesActivos: 2, estado: EstadoConvenio.ACTIVO },
    { codigo: 'CONV-2026-002', empresaIdx: 1, rubro: 'Desarrollo Web & Cloud', inicio: new Date('2026-02-01'), vencimiento: new Date('2026-11-30'), vacantes: 4, estudiantesActivos: 1, estado: EstadoConvenio.ACTIVO },
    { codigo: 'CONV-2026-003', empresaIdx: 2, rubro: 'Ciencia de Datos', inicio: new Date('2026-01-10'), vencimiento: new Date('2026-10-15'), vacantes: 3, estudiantesActivos: 1, estado: EstadoConvenio.ACTIVO },
    { codigo: 'CONV-2026-004', empresaIdx: 3, rubro: 'Ciberseguridad', inicio: new Date('2026-03-01'), vencimiento: new Date('2027-03-01'), vacantes: 2, estudiantesActivos: 1, estado: EstadoConvenio.ACTIVO },
    { codigo: 'CONV-2025-089', empresaIdx: 4, rubro: 'ERP & Automatización', inicio: new Date('2025-08-01'), vencimiento: new Date('2026-08-30'), vacantes: 6, estudiantesActivos: 1, estado: EstadoConvenio.POR_VENCER },
    { codigo: 'CONV-2025-095', empresaIdx: 5, rubro: 'Sistemas de Información GIS', inicio: new Date('2025-09-01'), vencimiento: new Date('2026-09-01'), vacantes: 3, estudiantesActivos: 1, estado: EstadoConvenio.POR_VENCER },
    { codigo: 'CONV-2024-033', empresaIdx: 6, rubro: 'Soporte & Redes', inicio: new Date('2024-05-01'), vencimiento: new Date('2025-05-01'), vacantes: 4, estudiantesActivos: 0, estado: EstadoConvenio.VENCIDO },
  ];

  const convenios: any[] = [];
  for (const c of conveniosData) {
    const conv = await prisma.convenio.create({
      data: {
        codigo: c.codigo,
        empresaId: empresas[c.empresaIdx].id,
        rubro: c.rubro,
        inicio: c.inicio,
        vencimiento: c.vencimiento,
        vacantes: c.vacantes,
        estudiantesActivos: c.estudiantesActivos,
        estado: c.estado,
      },
    });
    convenios.push(conv);
  }

  // 8 Postulaciones: 2 PENDIENTES, 1 EN_REVISION, 1 OBSERVADA, 3 APROBADAS, 1 RECHAZADA
  const postulacionesData = [
    // 0: Ana Torres Mamani (Aprobada, AndesTech, SMCPP-2026-048, 35h aprobadas en seed)
    { codigo: 'SMCPP-2026-048', estIdx: 0, empIdx: 0, convIdx: 0, tutorIdx: 0, area: 'Desarrollo de software', modalidad: 'Híbrido', inicio: new Date('2026-03-01'), fin: new Date('2026-08-31'), horasSem: 30, motivacion: 'Desarrollar competencias profesionales en desarrollo web fullstack.', desc: 'Desarrollo de módulos web en React y Node.js, pruebas y documentación.', etapa: 4, estado: EstadoPostulacion.APROBADA, obs: null },
    // 1: Juan Diego Pérez (Aprobada, IncaSoft, avance medio)
    { codigo: 'SMCPP-2026-049', estIdx: 1, empIdx: 1, convIdx: 1, tutorIdx: 1, area: 'Desarrollo Cloud', modalidad: 'Presencial', inicio: new Date('2026-03-15'), fin: new Date('2026-09-15'), horasSem: 30, motivacion: 'Especialización en arquitectura serverless y microservicios.', desc: 'Implementación de funciones en AWS Lambda y servicios de microservicios.', etapa: 4, estado: EstadoPostulacion.APROBADA, obs: null },
    // 2: Lucía Mendoza (Aprobada, Altiplano Data, avance alto)
    { codigo: 'SMCPP-2026-050', estIdx: 2, empIdx: 2, convIdx: 2, tutorIdx: 2, area: 'Analytics & Data Pipeline', modalidad: 'Remoto', inicio: new Date('2026-02-01'), fin: new Date('2026-07-31'), horasSem: 40, motivacion: 'Construcción de dashboards analíticos y ETL para grandes volúmenes de datos.', desc: 'Creación de pipelines en Python y modelos predictivos.', etapa: 4, estado: EstadoPostulacion.APROBADA, obs: null },
    // 3: Mateo Colque (Pendiente, CyberSec)
    { codigo: 'SMCPP-2026-051', estIdx: 3, empIdx: 3, convIdx: 3, tutorIdx: 3, area: 'Seguridad de Redes', modalidad: 'Híbrido', inicio: new Date('2026-04-01'), fin: new Date('2026-10-01'), horasSem: 30, motivacion: 'Aprender técnicas de ethical hacking y hardening de servidores.', desc: 'Pruebas de vulnerabilidad y configuración de firewalls.', etapa: 1, estado: EstadoPostulacion.PENDIENTE, obs: null },
    // 4: Sofia Paredes (Pendiente, Logística & TI)
    { codigo: 'SMCPP-2026-052', estIdx: 4, empIdx: 4, convIdx: 4, tutorIdx: null, area: 'Sistemas ERP', modalidad: 'Presencial', inicio: new Date('2026-04-15'), fin: new Date('2026-10-15'), horasSem: 30, motivacion: 'Capacitación en módulos ERP y gestión de inventarios.', desc: 'Apoyo en parametrización del sistema ERP de la empresa.', etapa: 1, estado: EstadoPostulacion.PENDIENTE, obs: null },
    // 5: Diego Flores (En Revisión, GeoMin)
    { codigo: 'SMCPP-2026-053', estIdx: 5, empIdx: 5, convIdx: 5, tutorIdx: null, area: 'GIS & Cartografía Digital', modalidad: 'Presencial', inicio: new Date('2026-03-20'), fin: new Date('2026-09-20'), horasSem: 35, motivacion: 'Implementación de mapas interactivos con ArcGIS.', desc: 'Procesamiento de datos satelitales y capas vectoriales.', etapa: 2, estado: EstadoPostulacion.EN_REVISION, obs: null },
    // 6: Camila Choque (Observada, Innovasistencia)
    { codigo: 'SMCPP-2026-054', estIdx: 6, empIdx: 6, convIdx: 6, tutorIdx: null, area: 'Infraestructura TI', modalidad: 'Remoto', inicio: new Date('2026-04-01'), fin: new Date('2026-10-01'), horasSem: 30, motivacion: 'Administración de servidores Linux y contenedores Docker.', desc: 'Monitoreo de disponibilidad y automatización de despliegues.', etapa: 2, estado: EstadoPostulacion.OBSERVADA, obs: 'Falta adjuntar el plan de trabajo con la firma del representante legal de la empresa.' },
    // 7: Renato Mamani (Rechazada, AndesTech)
    { codigo: 'SMCPP-2026-055', estIdx: 7, empIdx: 0, convIdx: 0, tutorIdx: null, area: 'Desarrollo Mobile', modalidad: 'Híbrido', inicio: new Date('2026-03-01'), fin: new Date('2026-09-01'), horasSem: 20, motivacion: 'Desarrollo de aplicaciones React Native.', desc: 'Creación de módulos móviles.', etapa: 1, estado: EstadoPostulacion.RECHAZADA, obs: 'Las horas semanales indicadas (20h) son inferiores al mínimo reglamentario exigido (30h).' },
  ];

  const postulaciones: any[] = [];
  for (const p of postulacionesData) {
    const post = await prisma.postulacion.create({
      data: {
        codigo: p.codigo,
        estudianteId: estudiantes[p.estIdx].estudiante.id,
        empresaId: empresas[p.empIdx].id,
        convenioId: convenios[p.convIdx].id,
        responsableId: uCoord1.id,
        tutorId: p.tutorIdx !== null ? tutores[p.tutorIdx].tutor.id : null,
        area: p.area,
        modalidad: p.modalidad,
        fechaInicio: p.inicio,
        fechaFin: p.fin,
        horasSemanales: p.horasSem,
        motivacion: p.motivacion,
        descripcion: p.desc,
        etapa: p.etapa,
        estado: p.estado,
        observaciones: p.obs,
      },
    });
    postulaciones.push(post);
  }

  // Documentos por postulación (Estados: APROBADO, PENDIENTE, OBSERVADO)
  const docsData = [
    // Ana Torres (5 docs, 4 aprobados, 1 observado)
    { postIdx: 0, estIdx: 0, nombre: 'Solicitud de prácticas', tipo: 'application/pdf', ruta: 'uploads/solicitud-ana-torres.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 0, estIdx: 0, nombre: 'Carta de presentación', tipo: 'application/pdf', ruta: 'uploads/carta-ana-torres.pdf', version: 2, estado: EstadoDocumento.OBSERVADO, com: 'Revisar firma del decano y sello institucional.' },
    { postIdx: 0, estIdx: 0, nombre: 'Currículum vitae', tipo: 'application/pdf', ruta: 'uploads/cv-ana-torres.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 0, estIdx: 0, nombre: 'Constancia académica', tipo: 'application/pdf', ruta: 'uploads/constancia-ana-torres.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 0, estIdx: 0, nombre: 'Plan de actividades', tipo: 'application/pdf', ruta: 'uploads/plan-ana-torres.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },

    // Juan Pérez (3 docs)
    { postIdx: 1, estIdx: 1, nombre: 'Solicitud de prácticas', tipo: 'application/pdf', ruta: 'uploads/solicitud-juan-perez.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 1, estIdx: 1, nombre: 'Carta de presentación', tipo: 'application/pdf', ruta: 'uploads/carta-juan-perez.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 1, estIdx: 1, nombre: 'Plan de actividades', tipo: 'application/pdf', ruta: 'uploads/plan-juan-perez.pdf', version: 1, estado: EstadoDocumento.PENDIENTE, com: null },

    // Lucía Mendoza (4 docs)
    { postIdx: 2, estIdx: 2, nombre: 'Solicitud de prácticas', tipo: 'application/pdf', ruta: 'uploads/solicitud-lucia-mendoza.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 2, estIdx: 2, nombre: 'Carta de presentación', tipo: 'application/pdf', ruta: 'uploads/carta-lucia-mendoza.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 2, estIdx: 2, nombre: 'Currículum vitae', tipo: 'application/pdf', ruta: 'uploads/cv-lucia-mendoza.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 2, estIdx: 2, nombre: 'Plan de actividades', tipo: 'application/pdf', ruta: 'uploads/plan-lucia-mendoza.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },

    // Camila Choque (2 docs, 1 observado)
    { postIdx: 6, estIdx: 6, nombre: 'Solicitud de prácticas', tipo: 'application/pdf', ruta: 'uploads/solicitud-camila-choque.pdf', version: 1, estado: EstadoDocumento.APROBADO, com: null },
    { postIdx: 6, estIdx: 6, nombre: 'Plan de actividades', tipo: 'application/pdf', ruta: 'uploads/plan-camila-choque.pdf', version: 1, estado: EstadoDocumento.OBSERVADO, com: 'Adjuntar la firma autorizada de la empresa.' },
  ];

  for (const d of docsData) {
    await prisma.documento.create({
      data: {
        postulacionId: postulaciones[d.postIdx].id,
        estudianteId: estudiantes[d.estIdx].estudiante.id,
        nombre: d.nombre,
        tipo: d.tipo,
        ruta: d.ruta,
        nombreInterno: d.ruta.replace('uploads/', ''),
        tamano: 180000,
        version: d.version,
        estado: d.estado,
        comentario: d.com,
        cargadoPorId: estudiantes[d.estIdx].usuario.id,
      },
    });
  }

  // Registros de Horas para los estudiantes
  // Ana Torres (postIdx 0): Exactamente 35 horas aprobadas
  const anaHoras = [
    { fecha: new Date('2026-03-02'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Inducción al equipo y configuración de entorno', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-03'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Análisis de requerimientos del sistema SMCPP', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-04'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Diseño de la base de datos PostgreSQL en Prisma', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-05'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Desarrollo de endpoints REST de autenticación', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-06'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Pruebas unitarias y documentación de API JWT', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-09'), entrada: '08:00', salida: '15:00', pausa: 60, horas: 6, act: 'Implementación del cliente HTTP en Frontend', estado: EstadoHoras.PENDIENTE },
    { fecha: new Date('2026-03-10'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Integración de vistas y prueba con API', estado: EstadoHoras.OBSERVADA },
  ];

  let acAna = 0;
  for (const h of anaHoras) {
    if (h.estado === EstadoHoras.APROBADA) acAna += h.horas;
    await prisma.registroHora.create({
      data: {
        postulacionId: postulaciones[0].id,
        estudianteId: estudiantes[0].estudiante.id,
        tutorId: tutores[0].tutor.id,
        semana: 'Semana 1-2',
        fecha: h.fecha,
        horaEntrada: h.entrada,
        horaSalida: h.salida,
        minutosPausa: h.pausa,
        horasCalculadas: h.horas,
        horasRegistradas: h.horas,
        horasAcumuladas: acAna,
        actividad: h.act,
        estado: h.estado,
        comentario: h.estado === EstadoHoras.OBSERVADA ? 'Falta especificar tareas completadas' : null,
        fechaValidacion: h.estado === EstadoHoras.APROBADA ? new Date('2026-03-07') : null,
      },
    });
  }

  // Lucía Mendoza (postIdx 2): Avance alto (240h aprobadas)
  let acLucia = 0;
  for (let i = 1; i <= 30; i++) {
    const fecha = new Date(2026, 1, i); // Febrero 2026
    const h = 8;
    acLucia += h;
    await prisma.registroHora.create({
      data: {
        postulacionId: postulaciones[2].id,
        estudianteId: estudiantes[2].estudiante.id,
        tutorId: tutores[2].tutor.id,
        semana: `Semana ${Math.ceil(i / 5)}`,
        fecha: fecha,
        horaEntrada: '08:00',
        horaSalida: '17:00',
        minutosPausa: 60,
        horasCalculadas: h,
        horasRegistradas: h,
        horasAcumuladas: acLucia,
        actividad: `Desarrollo de pipelines ETL y modelos de datos #${i}`,
        estado: EstadoHoras.APROBADA,
        fechaValidacion: new Date('2026-03-01'),
      },
    });
  }

  // Juan Diego Pérez (postIdx 1): Avance medio (120h aprobadas)
  let acJuan = 0;
  for (let i = 1; i <= 15; i++) {
    const fecha = new Date(2026, 2, i); // Marzo 2026
    const h = 8;
    acJuan += h;
    await prisma.registroHora.create({
      data: {
        postulacionId: postulaciones[1].id,
        estudianteId: estudiantes[1].estudiante.id,
        tutorId: tutores[1].tutor.id,
        semana: `Semana ${Math.ceil(i / 5)}`,
        fecha: fecha,
        horaEntrada: '08:00',
        horaSalida: '17:00',
        minutosPausa: 60,
        horasCalculadas: h,
        horasRegistradas: h,
        horasAcumuladas: acJuan,
        actividad: `Despliegue de funciones serverless en AWS #${i}`,
        estado: EstadoHoras.APROBADA,
        fechaValidacion: new Date('2026-03-25'),
      },
    });
  }

  // Criterios de Evaluación
  const criteriosDef = [
    { nombre: 'Calidad del trabajo', categoria: 'Técnica', peso: 15, descripcion: 'Precisión, orden y rigor en las tareas asignadas.' },
    { nombre: 'Cumplimiento de tareas', categoria: 'Técnica', peso: 15, descripcion: 'Entregas a tiempo y conforme a especificaciones.' },
    { nombre: 'Capacidad técnica', categoria: 'Técnica', peso: 15, descripcion: 'Dominio de herramientas y resolución de problemas.' },
    { nombre: 'Comunicación', categoria: 'Blanda', peso: 10, descripcion: 'Claridad y asertividad en la interacción.' },
    { nombre: 'Trabajo en equipo', categoria: 'Blanda', peso: 10, descripcion: 'Colaboración activa y disposición con el grupo.' },
    { nombre: 'Adaptabilidad', categoria: 'Blanda', peso: 10, descripcion: 'Flexibilidad ante cambios o imprevistos técnicos.' },
    { nombre: 'Puntualidad', categoria: 'Actitudinal', peso: 10, descripcion: 'Asistencia y puntualidad en jornada y reuniones.' },
    { nombre: 'Iniciativa', categoria: 'Actitudinal', peso: 10, descripcion: 'Proactividad al proponer soluciones.' },
    { nombre: 'Ética profesional', categoria: 'Actitudinal', peso: 5, descripcion: 'Respeto a normas de la empresa y confidencialidad.' },
  ];

  const criteriosCreados = [];
  for (const c of criteriosDef) {
    const crit = await prisma.criterioEvaluacion.create({ data: c });
    criteriosCreados.push(crit);
  }

  // Evaluaciones: Pendientes, En Proceso, Completadas
  // Ana Torres (postIdx 0): PENDIENTE (según requisito explícito)
  await prisma.evaluacion.create({
    data: {
      postulacionId: postulaciones[0].id,
      estudianteId: estudiantes[0].estudiante.id,
      tutorId: tutores[0].tutor.id,
      fechaLimite: new Date('2026-08-31'),
      avance: 0,
      resultado: null,
      estado: EstadoEvaluacion.PENDIENTE,
    },
  });

  // Lucía Mendoza (postIdx 2): COMPLETADA (resultado 4.9)
  const evalLucia = await prisma.evaluacion.create({
    data: {
      postulacionId: postulaciones[2].id,
      estudianteId: estudiantes[2].estudiante.id,
      tutorId: tutores[2].tutor.id,
      fechaLimite: new Date('2026-07-31'),
      avance: 100,
      resultado: 4.9,
      estado: EstadoEvaluacion.COMPLETADA,
      fortalezas: 'Sobresaliente desempeño técnico en análisis de datos y modelado predictivo.',
      aspectosMejorar: 'Mantener el equilibrio entre velocidad de desarrollo y documentación.',
      fechaEnvio: new Date('2026-04-10'),
    },
  });
  for (const crit of criteriosCreados) {
    await prisma.detalleEvaluacion.create({
      data: { evaluacionId: evalLucia.id, criterioId: crit.id, puntaje: 4.9, comentario: `Sobresaliente en ${crit.nombre}` },
    });
  }

  // Juan Diego Pérez (postIdx 1): EN_PROCESO (avance 60%)
  const evalJuan = await prisma.evaluacion.create({
    data: {
      postulacionId: postulaciones[1].id,
      estudianteId: estudiantes[1].estudiante.id,
      tutorId: tutores[1].tutor.id,
      fechaLimite: new Date('2026-09-15'),
      avance: 60,
      resultado: 4.2,
      estado: EstadoEvaluacion.EN_PROCESO,
      fortalezas: 'Buena iniciativa en despliegue de infraestructura serverless.',
    },
  });
  for (let i = 0; i < 5; i++) {
    await prisma.detalleEvaluacion.create({
      data: { evaluacionId: evalJuan.id, criterioId: criteriosCreados[i].id, puntaje: 4.2, comentario: `Buen desempeño en ${criteriosCreados[i].nombre}` },
    });
  }

  // Notificaciones por usuario
  await prisma.notificacion.createMany({
    data: [
      {
        usuarioId: estudiantes[0].usuario.id,
        categoria: CategoriaNotificacion.DOCUMENTOS,
        titulo: 'Documento observado',
        resumen: 'Tu carta de presentación fue observada. Revisa los comentarios para corregirla.',
        prioridad: Prioridad.ALTA,
        leida: false,
        accionUrl: '/mis-documentos',
      },
      {
        usuarioId: estudiantes[0].usuario.id,
        categoria: CategoriaNotificacion.HORAS,
        titulo: 'Jornada de horas aprobada',
        resumen: 'El tutor Ing. Carlos Medina aprobó tu registro diario de 7 horas.',
        prioridad: Prioridad.MEDIA,
        leida: true,
        accionUrl: '/mis-horas',
      },
      {
        usuarioId: uCoord1.id,
        categoria: CategoriaNotificacion.POSTULACIONES,
        titulo: 'Nueva postulación enviada',
        resumen: 'Sofia Paredes Vilca ha enviado su postulación para Logística & TI Sur S.A.C.',
        prioridad: Prioridad.MEDIA,
        leida: false,
        accionUrl: '/postulaciones',
      },
      {
        usuarioId: uCoord1.id,
        categoria: CategoriaNotificacion.DOCUMENTOS,
        titulo: 'Documento subsanado',
        resumen: 'Camila Choque Condori subió una nueva versión del plan de actividades.',
        prioridad: Prioridad.ALTA,
        leida: false,
        accionUrl: '/documentos',
      },
    ],
  });

  // Auditorías de acciones relevantes
  await prisma.auditoria.createMany({
    data: [
      { usuarioId: uCoord1.id, accion: 'APROBAR_POSTULACION', entidad: 'Postulacion', entidadId: postulaciones[0].id, detalles: { codigo: 'SMCPP-2026-048', estudiante: 'Ana Torres Mamani' } },
      { usuarioId: uCoord1.id, accion: 'APROBAR_POSTULACION', entidad: 'Postulacion', entidadId: postulaciones[1].id, detalles: { codigo: 'SMCPP-2026-049', estudiante: 'Juan Diego Pérez' } },
      { usuarioId: tutores[0].usuario.id, accion: 'VALIDAR_HORA', entidad: 'RegistroHora', entidadId: postulaciones[0].id, detalles: { horas: 7, estudiante: 'Ana Torres Mamani' } },
      { usuarioId: tutores[2].usuario.id, accion: 'ENVIAR_EVALUACION', entidad: 'Evaluacion', entidadId: evalLucia.id, detalles: { resultado: 4.9, estudiante: 'Lucía Mendoza Quispe' } },
    ],
  });

  console.log('✅ Seed completed successfully with full realistic SMCPP dataset!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
