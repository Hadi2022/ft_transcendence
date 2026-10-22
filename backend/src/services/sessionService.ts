
const sessionRepository = require('../repositories/sessionRepository.ts')

const findSessionById = async (id: string) => {
	return await sessionRepository.findSessionById(id)
}

const generateSession = async (user: object /*Should be User later*/) => {
	
	const session = await sessionRepository.saveSession()
	
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