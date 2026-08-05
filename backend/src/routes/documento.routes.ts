import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { uploadSinglePdf } from '../middlewares/upload.middleware';
import * as documentoController from '../controllers/documento.controller';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

// General documents
router.get('/', documentoController.listarTodosDocumentos);
router.get('/:id', documentoController.obtenerDocumento);
router.get('/:id/descargar', documentoController.descargarDocumento);

// Status and Observations (Coordinator / Admin)
router.patch('/:id/estado', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), documentoController.cambiarEstado);
router.post('/:id/observaciones', authorizeRoles(Rol.COORDINADOR, Rol.ADMINISTRADOR), documentoController.agregarObservacion);

export default router;

