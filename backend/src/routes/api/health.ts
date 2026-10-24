import express from 'express';
import * as healthController from '../../controllers/healthController.ts';

const router = express.Router();

router.get('/', healthController.getHealth);

export default router;