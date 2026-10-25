
import crypto from 'node:crypto'

export const hashToken = (token: string): string =>
	crypto.createHash('sha256').update(token).digest('hex')

export const generateToken = (bytes = 32): string =>
	crypto.randomBytes(bytes).toString('hex')
