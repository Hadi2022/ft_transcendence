import crypto from "node:crypto"
import type { Session } from '@prisma/client'

import * as sessionRepository from '../repositories/sessionRepository.ts'
import * as sessionConstants from '../constants/session.ts'

export const findSessionById = async (id: string): Promise<Session> => {
	return await sessionRepository.findById(id)
}

export const openSession = async (userId: string) => {

	const token = crypto.randomBytes(32).toString('hex')
	const tokenHash = crypto.createHash('sha256').update(token).digest("hex")
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

export const closeSessionByTokenHash = async (tokenHash: string) => {
	return await sessionRepository.deleteByTokenHash(tokenHash)
}