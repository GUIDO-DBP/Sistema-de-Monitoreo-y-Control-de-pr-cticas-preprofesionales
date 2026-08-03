import { Router } from 'express';
import authRoutes from './auth.routes';
import empresaRoutes from './empresa.routes';
import convenioRoutes from './convenio.routes';
import postulacionRoutes from './postulacion.routes';
import notificacionRoutes from './notificacion.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/empresas', empresaRoutes);
router.use('/convenios', convenioRoutes);
router.use('/postulaciones', postulacionRoutes);
router.use('/notificaciones', notificacionRoutes);

export default router;
