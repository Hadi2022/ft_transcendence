
import { prisma } from '../db/prisma.ts'

type CreateSessionData = {
	userID: string
	tokenHash: string
	expiresAt: Date
	ipOrigin?: string
	userAgent?: string
}

export const create = async (data: CreateSessionData) => {
	return prisma.session.create({ data })
}

export const findById = async (id: string)=> {
	return prisma.session.where({ id: id })
}

export const deleteById = async (id: string) => {
	return prisma.session.where({ id: id }).delete()
}

export const deleteByTokenHash = async (tokenHash: string) => {
	return prisma.session.where({ tokenHash: tokenHash }).delete()
}
