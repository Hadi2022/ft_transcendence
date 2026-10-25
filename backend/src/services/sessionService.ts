import { hashToken, generateToken } from "../utils/hash.ts"
import type { Session } from '@prisma/client'

import * as sessionRepository from '../repositories/sessionRepository.ts'
import * as sessionConstants from '../constants/session.ts'

export const findSessionById = async (id: string): Promise<Session> => {
	return await sessionRepository.findById(id)
}

export const findSessionByToken = async (token: string): Promise<Session> => {
	const tokenHash = hashToken(token)
	
	return await sessionRepository.findByTokenHash(tokenHash)
}

export const openSession = async (userId: string) => {

	const token = generateToken()
	const tokenHash = hashToken(token)
	const expiresAt = new Date(Date.now() + sessionConstants.SESSION_DURATION_MS)

	await sessionRepository.create({
		userId,
		tokenHash,
		expiresAt,
	})

	return { token, expiresAt }
}

export const closeSessionById = async (id: string) => {
	return await sessionRepository.deleteById(id)
}

export const closeSessionByToken = async (token: string) => {
	const tokenHash = hashToken(token)
	
	return await sessionRepository.deleteByTokenHash(tokenHash)
}