import { prisma } from '../config/prisma';
import { EstadoPostulacion, EstadoConvenio, EstadoHoras, EstadoEvaluacion } from '@prisma/client';

export async function obtenerResumenReportes() {
  const [
    totalEstudiantes,
    totalEmpresas,
    conveniosActivos,
    conveniosPorVencer,
    postulacionesAprobadas,
    postulacionesPendientes,
    horasAprobadasAggr,
    evaluacionesCompletadasAggr,
  ] = await Promise.all([
    prisma.estudiante.count(),
    prisma.empresa.count(),
    prisma.convenio.count({ where: { estado: EstadoConvenio.ACTIVO } }),
    prisma.convenio.count({ where: { estado: EstadoConvenio.POR_VENCER } }),
    prisma.postulacion.count({ where: { estado: EstadoPostulacion.APROBADA } }),
    prisma.postulacion.count({ where: { estado: EstadoPostulacion.PENDIENTE } }),
    prisma.registroHora.aggregate({
      _sum: { horasRegistradas: true },
      where: { estado: EstadoHoras.APROBADA },
    }),
    prisma.evaluacion.aggregate({
      _avg: { resultado: true },
      _count: { id: true },
      where: { estado: EstadoEvaluacion.COMPLETADA },
    }),
  ]);

  return {
    totalEstudiantes,
    totalEmpresas,
    conveniosActivos,
    conveniosPorVencer,
    postulacionesAprobadas,
    postulacionesPendientes,
    horasTotalesAprobadas: horasAprobadasAggr._sum.horasRegistradas || 0,
    promedioEvaluaciones: parseFloat((evaluacionesCompletadasAggr._avg.resultado || 0).toFixed(2)),
    evaluacionesCompletadas: evaluacionesCompletadasAggr._count.id,
  };
}

export async function obtenerReportePostulaciones() {
  const porEstado = await prisma.postulacion.groupBy({
    by: ['estado'],
    _count: { id: true },
  });

  const postulaciones = await prisma.postulacion.findMany({
    include: {
      estudiante: { include: { usuario: { select: { nombre: true, email: true } } } },
      empresa: { select: { nombre: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return { porEstado, postulaciones };
}

export async function obtenerReporteHoras() {
  const porEstado = await prisma.registroHora.groupBy({
    by: ['estado'],
    _sum: { horasRegistradas: true },
    _count: { id: true },
  });

  return { porEstado };
}

export async function obtenerReporteEvaluaciones() {
  const porEstado = await prisma.evaluacion.groupBy({
    by: ['estado'],
    _count: { id: true },
    _avg: { resultado: true },
  });

  return { porEstado };
}

export async function obtenerReporteConvenios() {
  const convenios = await prisma.convenio.findMany({
    include: { empresa: { select: { nombre: true } } },
    orderBy: { vencimiento: 'asc' },
  });

  return convenios;
}

export async function obtenerSeguimientoEstudiantes() {
  const estudiantes = await prisma.estudiante.findMany({
    include: {
      usuario: { select: { nombre: true, email: true } },
      postulaciones: {
        select: {
          codigo: true,
          estado: true,
          empresa: { select: { nombre: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      registrosHoras: {
        where: { estado: EstadoHoras.APROBADA },
        select: { horasRegistradas: true },
      },
      documentos: {
        select: { id: true, estado: true },
      },
      evaluaciones: {
        select: { estado: true, resultado: true },
        take: 1,
      },
    },
  });

  return estudiantes.map((est: any) => {
    const post = est.postulaciones[0];
    const horasAprobadas = est.registrosHoras.reduce((sum: number, h: any) => sum + h.horasRegistradas, 0);
    const docsTotal = est.documentos.length;
    const docsAprobados = est.documentos.filter((d: any) => d.estado === 'APROBADO').length;
    const evalObj = est.evaluaciones[0];

    return {
      id: est.id,
      codigo: est.codigo,
      nombre: est.usuario.nombre,
      email: est.usuario.email,
      escuela: est.escuela,
      ciclo: est.ciclo,
      empresa: post?.empresa?.nombre || 'Sin asignación',
      estadoPostulacion: post?.estado || 'PENDIENTE',
      horasAprobadas,
      metaHoras: 320,
      porcentajeHoras: Math.min(100, Math.round((horasAprobadas / 320) * 100)),
      docsProgreso: `${docsAprobados}/${Math.max(docsTotal, 5)}`,
      evaluacionEstado: evalObj?.estado || 'PENDIENTE',
      evaluacionResultado: evalObj?.resultado || null,
      retraso: horasAprobadas < 50 && post?.estado === 'APROBADA',
    };
  });
}
