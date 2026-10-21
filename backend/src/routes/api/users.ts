const express = require('express')
const { registerUser } = require('../../controllers/userController.ts')

const router = express.Router()

router.post('/', registerUser)

module.exports = router