const express = require('express')
const sessionController = require('../../contollers/sessionController.ts')

const   router = express.Router()

router.post('/', sessionController.openSession)
router.delete('/', sessionController.closeSession)

module.exports = router
