import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createConvenioSchema,
  updateConvenioSchema,
  patchEstadoSchema,
} from '../validators/convenio.validator';
import { list, create, update, patchEstado } from '../controllers/convenio.controller';

const router = Router();

router.use(authenticate);

/** GET /api/convenios — All roles */
router.get('/', list);

/** POST /api/convenios — Coordinador / Administrador */
router.post('/', authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), validate(createConvenioSchema), create);

/** PUT /api/convenios/:id — Coordinador / Administrador */
router.put('/:id', authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), validate(updateConvenioSchema), update);

/** PATCH /api/convenios/:id/estado — Coordinador / Administrador */
router.patch('/:id/estado', authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), validate(patchEstadoSchema), patchEstado);

export default router;
