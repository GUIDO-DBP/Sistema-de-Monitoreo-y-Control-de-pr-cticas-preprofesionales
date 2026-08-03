import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  createEmpresaSchema,
  updateEmpresaSchema,
  idParamSchema,
} from '../validators/empresa.validator';
import { list, getById, create, update } from '../controllers/empresa.controller';

const router = Router();

// All empresa routes require authentication
router.use(authenticate);

/** GET /api/empresas — All authenticated roles */
router.get('/', list);

/** GET /api/empresas/:id — All authenticated roles */
router.get('/:id', validate(idParamSchema), getById);

/** POST /api/empresas — Coordinador / Administrador only */
router.post(
  '/',
  authorizeRoles('COORDINADOR', 'ADMINISTRADOR'),
  validate(createEmpresaSchema),
  create,
);

/** PUT /api/empresas/:id — Coordinador / Administrador only */
router.put(
  '/:id',
  authorizeRoles('COORDINADOR', 'ADMINISTRADOR'),
  validate(updateEmpresaSchema),
  update,
);

export default router;
