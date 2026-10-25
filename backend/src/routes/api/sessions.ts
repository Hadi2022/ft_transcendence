import express from 'express'
import * as sessionController from '../../controllers/sessionController.ts'

const   router = express.Router()

router.post('/', sessionController.openSession)
router.delete('/current', sessionController.closeCurrentSession)
router.delete('/:id', sessionController.closeSession)

export default router
