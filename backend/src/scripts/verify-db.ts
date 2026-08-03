import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verify() {
  console.log('--- DB VERIFICATION REPORT ---');

  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nombre: true, email: true, rol: true, activo: true },
  });
  console.log(`Usuarios count: ${usuarios.length}`);
  console.table(usuarios);

  const estudiantes = await prisma.estudiante.findMany({
    include: { usuario: { select: { nombre: true, email: true } } },
  });
  console.log(`Estudiantes count: ${estudiantes.length}`);
  console.table(estudiantes.map(e => ({
    id: e.id,
    nombre: e.usuario.nombre,
    codigo: e.codigo,
    escuela: e.escuela,
    ciclo: e.ciclo,
  })));

  const tutores = await prisma.tutorEmpresarial.findMany({
    include: { usuario: { select: { nombre: true, email: true } }, empresa: { select: { nombre: true } } },
  });
  console.log(`Tutores count: ${tutores.length}`);
  console.table(tutores.map(t => ({
    id: t.id,
    nombre: t.usuario.nombre,
    empresa: t.empresa.nombre,
    cargo: t.cargo,
  })));

  const empresas = await prisma.empresa.findMany();
  console.log(`Empresas count: ${empresas.length}`);
  console.table(empresas.map(e => ({ id: e.id, nombre: e.nombre, rubro: e.rubro, modalidad: e.modalidad, vacantes: e.vacantes })));

  const convenios = await prisma.convenio.findMany();
  console.log(`Convenios count: ${convenios.length}`);
  console.table(convenios.map(c => ({ id: c.id, codigo: c.codigo, estado: c.estado, inicio: c.inicio, vencimiento: c.vencimiento })));

  const postulaciones = await prisma.postulacion.findMany({
    include: {
      estudiante: { include: { usuario: { select: { nombre: true } } } },
      empresa: { select: { nombre: true } },
    },
  });
  console.log(`Postulaciones count: ${postulaciones.length}`);
  console.table(postulaciones.map(p => ({
    id: p.id,
    codigo: p.codigo,
    estudiante: p.estudiante.usuario.nombre,
    empresa: p.empresa.nombre,
    estado: p.estado,
    etapa: p.etapa,
  })));

  const documentos = await prisma.documento.findMany();
  console.log(`Documentos count: ${documentos.length}`);
  console.table(documentos.map(d => ({ id: d.id, nombre: d.nombre, tipo: d.tipo, estado: d.estado, version: d.version })));

  const horas = await prisma.registroHora.findMany();
  console.log(`Registros de Horas count: ${horas.length}`);
  console.table(horas.map(h => ({ id: h.id, semana: h.semana, registradas: h.horasRegistradas, acumuladas: h.horasAcumuladas, estado: h.estado })));

  const notificaciones = await prisma.notificacion.findMany({
    include: { usuario: { select: { nombre: true, rol: true } } },
  });
  console.log(`Notificaciones count: ${notificaciones.length}`);
  console.table(notificaciones.map(n => ({
    id: n.id,
    usuario: `${n.usuario.nombre} (${n.usuario.rol})`,
    titulo: n.titulo,
    categoria: n.categoria,
    leida: n.leida,
  })));

  const evaluaciones = await prisma.evaluacion.findMany();
  console.log(`Evaluaciones count: ${evaluaciones.length}`);
  console.table(evaluaciones.map(e => ({ id: e.id, avance: e.avance, estado: e.estado })));

  await prisma.$disconnect();
}

verify().catch(err => {
  console.error(err);
  process.exit(1);
});
