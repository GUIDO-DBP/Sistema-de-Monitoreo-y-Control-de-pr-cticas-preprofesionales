import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createPostulacionSchema,
  patchEstadoSchema,
  addObservacionSchema,
  idParamSchema,
} from '../validators/postulacion.validator';
import {
  list,
  getById,
  create,
  patchEstado,
  addObservacion,
} from '../controllers/postulacion.controller';

import { uploadSinglePdf } from '../middlewares/upload.middleware';
import * as documentoController from '../controllers/documento.controller';

const router = Router();

router.use(authenticate);

/** GET /api/postulaciones — All authenticated roles (filtered by role in service) */
router.get('/', list);

/** GET /api/postulaciones/:id — All authenticated roles */
router.get('/:id', validate(idParamSchema), getById);

/** POST /api/postulaciones — Estudiante or Coordinador/Admin */
router.post('/', validate(createPostulacionSchema), create);

/** GET /api/postulaciones/:id/documentos — List documents for postulation */
router.get('/:id/documentos', documentoController.listarDocumentosPostulacion);

/** POST /api/postulaciones/:id/documentos — Upload PDF document for postulation */
router.post('/:id/documentos', uploadSinglePdf, documentoController.subirDocumento);

/** PATCH /api/postulaciones/:id/estado — Coordinador / Admin only */
router.patch(
  '/:id/estado',
  authorizeRoles('COORDINADOR', 'ADMINISTRADOR'),
  validate(patchEstadoSchema),
  patchEstado,
);

/** POST /api/postulaciones/:id/observaciones — Coordinador / Admin only */
router.post(
  '/:id/observaciones',
  authorizeRoles('COORDINADOR', 'ADMINISTRADOR'),
  validate(addObservacionSchema),
  addObservacion,
);

export default router;

