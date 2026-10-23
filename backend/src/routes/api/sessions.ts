const express = require('express')
const sessionController = require('../../controllers/sessionController.ts')

const   router = express.Router()

router.post('/', sessionController.openSession)
router.delete('/current', sessionController.closeCurrentSession)
router.delete('/:id', sessionController.closeSession)

module.exports = router
