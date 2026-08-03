import { Router } from 'express';
import authRoutes from './auth.routes';
import empresaRoutes from './empresa.routes';
import convenioRoutes from './convenio.routes';
import postulacionRoutes from './postulacion.routes';
import notificacionRoutes from './notificacion.routes';
import documentoRoutes from './documento.routes';
import horaRoutes from './hora.routes';
import evaluacionRoutes from './evaluacion.routes';
import usuarioRoutes from './usuario.routes';
import reporteRoutes from './reporte.routes';
import seguimientoRoutes from './seguimiento.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/convenios', convenioRoutes);
router.use('/postulaciones', postulacionRoutes);
router.use('/notificaciones', notificacionRoutes);
router.use('/documentos', documentoRoutes);
router.use('/horas', horaRoutes);
router.use('/evaluaciones', evaluacionRoutes);
router.use('/usuarios', usuarioRoutes);
router.use('/reportes', reporteRoutes);
router.use('/seguimiento', seguimientoRoutes);

export default router;
