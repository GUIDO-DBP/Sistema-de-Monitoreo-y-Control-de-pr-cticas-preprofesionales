import { PrismaClient, Rol, EstadoConvenio, EstadoPostulacion, EstadoDocumento, EstadoHoras, EstadoEvaluacion, CategoriaNotificacion, Prioridad } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed database...');

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

  // 1. Passwords hash
  const adminPassword = await bcrypt.hash('Admin123*', 12);
  const coordPassword = await bcrypt.hash('Coordinador123*', 12);
  const studentPassword = await bcrypt.hash('Estudiante123*', 12);
  const tutorPassword = await bcrypt.hash('Tutor123*', 12);

  // 2. Create Users
  const userAdmin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador General',
      email: 'admin@unap.edu.pe',
      passwordHash: adminPassword,
      rol: Rol.ADMINISTRADOR,
    },
  });

  const userCoord = await prisma.usuario.create({
    data: {
      nombre: 'Coord. Carlos Ramos',
      email: 'coordinador@unap.edu.pe',
      passwordHash: coordPassword,
      rol: Rol.COORDINADOR,
    },
  });

  const userStudent = await prisma.usuario.create({
    data: {
      nombre: 'Ana Torres Mamani',
      email: 'ana.torres@unap.edu.pe',
      passwordHash: studentPassword,
      rol: Rol.ESTUDIANTE,
    },
  });

  const userTutor = await prisma.usuario.create({
    data: {
      nombre: 'Ing. Carlos Medina',
      email: 'carlos.medina@andestech.pe',
      passwordHash: tutorPassword,
      rol: Rol.TUTOR,
    },
  });

  // 3. Create Student profile
  const studentProfile = await prisma.estudiante.create({
    data: {
      usuarioId: userStudent.id,
      codigo: '2021064821',
      escuela: 'Ingeniería de Sistemas',
      ciclo: 9,
      telefono: '951234567',
      iniciales: 'AT',
      color: '#2563EB',
    },
  });

  // 4. Create Empresa (AndesTech Solutions)
  const empresa = await prisma.empresa.create({
    data: {
      nombre: 'AndesTech Solutions',
      rubro: 'Desarrollo de software y consultoría TI',
      ubicacion: 'Av. Floral 450, Puno',
      modalidad: 'Híbrido',
      vacantes: 5,
    },
  });

  // 5. Create Tutor profile linked to Empresa
  const tutorProfile = await prisma.tutorEmpresarial.create({
    data: {
      usuarioId: userTutor.id,
      empresaId: empresa.id,
      cargo: 'Jefe de Desarrollo',
    },
  });

  // 6. Create Convenio
  const convenio = await prisma.convenio.create({
    data: {
      codigo: 'CONV-2026-001',
      empresaId: empresa.id,
      rubro: 'Tecnología de la Información',
      inicio: new Date('2026-01-15'),
      vencimiento: new Date('2026-12-31'),
      vacantes: 5,
      estudiantesActivos: 1,
      estado: EstadoConvenio.ACTIVO,
    },
  });

  // 7. Create Postulacion for Ana Torres (Aprobada)
  const postulacion = await prisma.postulacion.create({
    data: {
      codigo: 'SMCPP-2026-048',
      estudianteId: studentProfile.id,
      empresaId: empresa.id,
      convenioId: convenio.id,
      responsableId: userCoord.id,
      tutorId: tutorProfile.id,
      area: 'Desarrollo de software',
      modalidad: 'Híbrido',
      fechaInicio: new Date('2026-03-01'),
      fechaFin: new Date('2026-08-31'),
      horasSemanales: 30,
      motivacion: 'Desarrollar competencias profesionales en desarrollo web fullstack.',
      descripcion: 'Desarrollo de módulos web en React y Node.js, pruebas y documentación.',
      etapa: 4,
      estado: EstadoPostulacion.APROBADA,
    },
  });

  // 8. Create 5 Documentos para Ana Torres
  await prisma.documento.createMany({
    data: [
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Solicitud de prácticas',
        tipo: 'application/pdf',
        ruta: 'uploads/solicitud-ana-torres.pdf',
        nombreInterno: 'solicitud-ana-torres.pdf',
        tamano: 151552,
        version: 1,
        estado: EstadoDocumento.APROBADO,
        cargadoPorId: userStudent.id,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Carta de presentación',
        tipo: 'application/pdf',
        ruta: 'uploads/carta-ana-torres.pdf',
        nombreInterno: 'carta-ana-torres.pdf',
        tamano: 217088,
        version: 2,
        estado: EstadoDocumento.OBSERVADO,
        comentario: 'Revisar firma del decano y sello institucional.',
        cargadoPorId: userStudent.id,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Currículum vitae',
        tipo: 'application/pdf',
        ruta: 'uploads/cv-ana-torres.pdf',
        nombreInterno: 'cv-ana-torres.pdf',
        tamano: 389120,
        version: 1,
        estado: EstadoDocumento.APROBADO,
        cargadoPorId: userStudent.id,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Constancia académica',
        tipo: 'application/pdf',
        ruta: 'uploads/constancia-ana-torres.pdf',
        nombreInterno: 'constancia-ana-torres.pdf',
        tamano: 112640,
        version: 1,
        estado: EstadoDocumento.APROBADO,
        cargadoPorId: userStudent.id,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Plan de actividades',
        tipo: 'application/pdf',
        ruta: 'uploads/plan-ana-torres.pdf',
        nombreInterno: 'plan-ana-torres.pdf',
        tamano: 199680,
        version: 1,
        estado: EstadoDocumento.APROBADO,
        cargadoPorId: userStudent.id,
      },
    ],
  });

  // 9. Create Registros de Horas (186 de 320 horas acumuladas)
  const registrosDiarios = [
    { fecha: new Date('2026-03-02'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Inducción al equipo y configuración de entorno', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-03'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Análisis de requerimientos del sistema SMCPP', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-04'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Diseño de la base de datos PostgreSQL en Prisma', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-05'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Desarrollo de endpoints REST de autenticación', estado: EstadoHoras.APROBADA },
    { fecha: new Date('2026-03-06'), entrada: '08:00', salida: '16:00', pausa: 60, horas: 7, act: 'Pruebas unitarias y documentación de API JWT', estado: EstadoHoras.APROBADA },
  ];

  let acumulado = 0;
  for (const r of registrosDiarios) {
    acumulado += r.horas;
    await prisma.registroHora.create({
      data: {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        tutorId: tutorProfile.id,
        semana: 'Semana 1',
        fecha: r.fecha,
        horaEntrada: r.entrada,
        horaSalida: r.salida,
        minutosPausa: r.pausa,
        horasCalculadas: r.horas,
        horasRegistradas: r.horas,
        horasAcumuladas: acumulado,
        actividad: r.act,
        estado: r.estado,
        fechaValidacion: new Date('2026-03-07'),
      },
    });
  }

  // 10. Criterios de Evaluación
  const criteriosDef = [
    { nombre: 'Calidad del trabajo', categoria: 'Técnica', peso: 15, descripcion: 'Precisión, orden y rigor en las tareas.' },
    { nombre: 'Cumplimiento de tareas', categoria: 'Técnica', peso: 15, descripcion: 'Entregas a tiempo y según especificaciones.' },
    { nombre: 'Capacidad técnica', categoria: 'Técnica', peso: 15, descripcion: 'Dominio de herramientas y solución de problemas.' },
    { nombre: 'Comunicación', categoria: 'Blanda', peso: 10, descripcion: 'Claridad en la expresión oral y escrita.' },
    { nombre: 'Trabajo en equipo', categoria: 'Blanda', peso: 10, descripcion: 'Colaboración activa con los miembros.' },
    { nombre: 'Adaptabilidad', categoria: 'Blanda', peso: 10, descripcion: 'Flexibilidad ante cambios o imprevistos.' },
    { nombre: 'Puntualidad', categoria: 'Actitudinal', peso: 10, descripcion: 'Asistencia y puntualidad en reuniones.' },
    { nombre: 'Iniciativa', categoria: 'Actitudinal', peso: 10, descripcion: 'Proactividad en proponer soluciones.' },
    { nombre: 'Ética profesional', categoria: 'Actitudinal', peso: 5, descripcion: 'Respeto a confidencialidad y normas.' },
  ];

  const criteriosCreados = [];
  for (const c of criteriosDef) {
    const crit = await prisma.criterioEvaluacion.create({ data: c });
    criteriosCreados.push(crit);
  }

  // 11. Evaluacion para Ana Torres
  const evalAna = await prisma.evaluacion.create({
    data: {
      postulacionId: postulacion.id,
      estudianteId: studentProfile.id,
      tutorId: tutorProfile.id,
      fechaLimite: new Date('2026-08-31'),
      avance: 100,
      resultado: 4.8,
      estado: EstadoEvaluacion.COMPLETADA,
      fortalezas: 'Excelente iniciativa y rapidez para aprender tecnologías modernas como React y PostgreSQL.',
      aspectosMejorar: 'Continuar reforzando pruebas automatizadas de integración.',
      fechaEnvio: new Date('2026-04-15'),
    },
  });

  // Detalle de evaluación por cada criterio
  for (const crit of criteriosCreados) {
    await prisma.detalleEvaluacion.create({
      data: {
        evaluacionId: evalAna.id,
        criterioId: crit.id,
        puntaje: 4.8,
        comentario: 'Desempeño sobresaliente en ' + crit.nombre,
      },
    });
  }

  // 12. Create Notifications for users
  await prisma.notificacion.createMany({
    data: [
      {
        usuarioId: userStudent.id,
        categoria: CategoriaNotificacion.DOCUMENTOS,
        titulo: 'Documento observado',
        resumen: 'Tu carta de presentación fue observada por el coordinador. Por favor, revisa y corrige.',
        prioridad: Prioridad.ALTA,
        leida: false,
        accionUrl: '/mis-documentos',
      },
      {
        usuarioId: userStudent.id,
        categoria: CategoriaNotificacion.HORAS,
        titulo: 'Horas de la jornada aprobadas',
        resumen: 'El tutor Ing. Carlos Medina aprobó tu registro diario de 7 horas.',
        prioridad: Prioridad.MEDIA,
        leida: false,
        accionUrl: '/mis-horas',
      },
      {
        usuarioId: userCoord.id,
        categoria: CategoriaNotificacion.POSTULACIONES,
        titulo: 'Nueva postulación enviada',
        resumen: 'Ana Torres Mamani ha enviado una postulación para AndesTech Solutions.',
        prioridad: Prioridad.MEDIA,
        leida: false,
        accionUrl: '/postulaciones',
      },
    ],
  });

  console.log('✅ Database seeded successfully with All Fases (1-5) data!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
