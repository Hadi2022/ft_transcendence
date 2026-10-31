import express from 'express'
import * as sessionController from '../../controllers/sessionController.ts'
import { requireAuth } from '../../middleware/auth.ts'
import { authed } from '../../utils/authed.ts'

const   router = express.Router()

router.post('/', sessionController.openSession)
router.get('/', requireAuth, authed(sessionController.listSessions))
router.delete('/current', requireAuth, authed(sessionController.closeCurrentSession))
router.delete('/:id', requireAuth, authed(sessionController.closeSession))
router.delete('/', requireAuth, authed(sessionController.closeAllUserSessions))

export default router
