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
  const coordPassword = await bcrypt.hash('Coordinador123*', 12);
  const studentPassword = await bcrypt.hash('Estudiante123*', 12);
  const tutorPassword = await bcrypt.hash('Tutor123*', 12);

  // 2. Create Users
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

  // 8. Create 5 Documentos for Ana's postulation
  await prisma.documento.createMany({
    data: [
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Solicitud de prácticas',
        tipo: 'Solicitud',
        ruta: 'uploads/solicitud-ana-torres.pdf',
        tamano: 151552,
        version: 1,
        estado: EstadoDocumento.APROBADO,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Carta de presentación',
        tipo: 'Carta',
        ruta: 'uploads/carta-ana-torres.pdf',
        tamano: 217088,
        version: 2,
        estado: EstadoDocumento.OBSERVADO,
        comentario: 'Revisar firma del decano y sello institucional.',
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Currículum vitae',
        tipo: 'CV',
        ruta: 'uploads/cv-ana-torres.pdf',
        tamano: 389120,
        version: 1,
        estado: EstadoDocumento.APROBADO,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Constancia académica',
        tipo: 'Constancia',
        ruta: 'uploads/constancia-ana-torres.pdf',
        tamano: 112640,
        version: 1,
        estado: EstadoDocumento.APROBADO,
      },
      {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        nombre: 'Plan de actividades',
        tipo: 'Plan',
        ruta: 'uploads/plan-ana-torres.pdf',
        tamano: 199680,
        version: 1,
        estado: EstadoDocumento.APROBADO,
      },
    ],
  });

  // 9. Create Registros de Horas (186 de 320 horas)
  const registrosSemanas = [
    { semana: 'Semana 1 (03-09 Mar)', registradas: 30, acumuladas: 30, estado: EstadoHoras.APROBADA },
    { semana: 'Semana 2 (10-16 Mar)', registradas: 30, acumuladas: 60, estado: EstadoHoras.APROBADA },
    { semana: 'Semana 3 (17-23 Mar)', registradas: 30, acumuladas: 90, estado: EstadoHoras.APROBADA },
    { semana: 'Semana 4 (24-30 Mar)', registradas: 30, acumuladas: 120, estado: EstadoHoras.APROBADA },
    { semana: 'Semana 5 (31 Mar-06 Abr)', registradas: 30, acumuladas: 150, estado: EstadoHoras.APROBADA },
    { semana: 'Semana 6 (07-13 Abr)', registradas: 36, acumuladas: 186, estado: EstadoHoras.PENDIENTE },
  ];

  for (const reg of registrosSemanas) {
    await prisma.registroHora.create({
      data: {
        postulacionId: postulacion.id,
        estudianteId: studentProfile.id,
        tutorId: tutorProfile.id,
        semana: reg.semana,
        horasRegistradas: reg.registradas,
        horasAcumuladas: reg.acumuladas,
        evidencia: true,
        evidenciaUrl: 'uploads/evidencia-semanal.pdf',
        estado: reg.estado,
      },
    });
  }

  // 10. Create Evaluacion (Pendiente)
  await prisma.evaluacion.create({
    data: {
      postulacionId: postulacion.id,
      estudianteId: studentProfile.id,
      tutorId: tutorProfile.id,
      fechaLimite: new Date('2026-08-31'),
      avance: 40,
      estado: EstadoEvaluacion.PENDIENTE,
    },
  });

  // 11. Create Notifications for users
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
        titulo: 'Horas de la semana aprobadas',
        resumen: 'El tutor Ing. Carlos Medina aprobó tu registro de 30 horas.',
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
      {
        usuarioId: userCoord.id,
        categoria: CategoriaNotificacion.DOCUMENTOS,
        titulo: 'Documentos pendientes de revisión',
        resumen: 'Hay 3 documentos pendientes de revisión en la bandeja.',
        prioridad: Prioridad.ALTA,
        leida: false,
        accionUrl: '/documentos',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
