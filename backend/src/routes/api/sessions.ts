const express = require('express')
const sessionController = require('../../controllers/sessionController.ts')

const   router = express.Router()

router.post('/', sessionController.openSession)
router.delete('/current', sessionController.closeSession)
router.delete('/:id', sessionController.closeCurrentSession)

module.exports = router
