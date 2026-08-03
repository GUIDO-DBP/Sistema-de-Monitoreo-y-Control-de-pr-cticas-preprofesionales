import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { patchLeidaSchema } from '../validators/notificacion.validator';
import { list, patchLeida } from '../controllers/notificacion.controller';

const router = Router();

router.use(authenticate);

/** GET /api/notificaciones */
router.get('/', list);

/** PATCH /api/notificaciones/:id/leida */
router.patch('/:id/leida', validate(patchLeidaSchema), patchLeida);

export default router;
