import express from 'express'
import * as sessionController from '../../controllers/sessionController.ts'
import { requireAuth } from '../../middleware/auth.ts'

const   router = express.Router()

router.post('/', sessionController.openSession)
router.get('/', requireAuth, sessionController.listSessions)
router.delete('/current', requireAuth, sessionController.closeCurrentSession)
router.delete('/:id', requireAuth, sessionController.closeSession)
router.delete('/', requireAuth, sessionController.closeAllUserSessions)

export default router
