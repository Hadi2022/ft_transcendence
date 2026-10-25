import { prisma } from '../db/prisma/prisma.ts'

type CreateSessionData = {
	userId: string
	tokenHash: string
	expiresAt: Date
	ipOrigin?: string
	userAgent?: string
}

export const create = async (data: CreateSessionData) => {
	return prisma.session.create({ data })
}

export const findById = async (id: string) => {
	return prisma.session.findUnique({ where: { id } })
}

export const findByTokenHash = async (tokenHash: string) => {
	return prisma.session.findUnique({ where: { tokenHash } })
}

export const deleteById = async (id: string) => {
	return prisma.session.deleteMany({ where: { id } })
}

export const deleteByTokenHash = async (tokenHash: string) => {
	return prisma.session.deleteMany({ where: { tokenHash } })
}