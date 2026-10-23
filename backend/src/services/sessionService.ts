const nodeCrypto = require("node:crypto")
const sessionRepository = require('../repositories/sessionRepository.ts')

const sessionConstants = require('../constants/session.ts')

const findSessionById = async (id: string) => {
	return await sessionRepository.findSessionById(id)
}

const generateSession = async (userID: string /*Should be User later*/) => {

	const id = nodeCrypto.randomUUID()

	const expiresAt = new Date(Date.now() + sessionConstants.SESSION_DURATION_MS)

	const session = await sessionRepository.saveSession({
		id,
		userID,
		expiresAt,
	})

	return session
}

const removeSession = async (id: string) => {
	await sessionRepository.deleteSessionById(id)
}

module.exports = {
	findSessionById,
	generateSession,
	removeSession,
}