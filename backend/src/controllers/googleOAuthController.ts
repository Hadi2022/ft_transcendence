import { randomBytes, timingSafeEqual } from 'node:crypto'
import type { Request, Response } from 'express'
import { ErrorCodes as E } from '@transcendence/shared/errors/error-codes'

import {
	getGoogleAuthorizationUrl,
	verifyGoogleAuthorizationCode
} from '../services/googleOAuthService.ts'

import {
	GoogleAuthError,
	GoogleInvalidCredentialsError,
	GoogleProviderError,
} from '../errors/googleOAuthErrors.ts'

import {
	BadRequestError,
	UnauthorizedError,
	BadGatewayError,
	ConflictError,
	InternalError
} from '../errors/HttpErrors.ts'

import { createGoogleUser } from '../services/userService.ts'
import type { GoogleProfile } from '../types/user.ts'
import { emailSchema } from '@transcendence/shared/schemas/user'
import { formatZodErrors } from '../utils/zod.ts'
import * as sessionService from '../services/sessionService.ts'
import { setSessionCookie } from '../utils/sessionCookie.ts'

const STATE_COOKIE = 'google_oauth_state'
const STATE_MAX_AGE = 10 * 60 * 1000

const cookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: 'lax' as const,
	path: '/api/auth/google',
}

export function authorizeGoogle(_req: Request, res: Response) {
	const state = randomBytes(32).toString('hex')

	res.cookie(STATE_COOKIE, state, {
		...cookieOptions,
		maxAge: STATE_MAX_AGE,
	})

	res.redirect(getGoogleAuthorizationUrl(state))
}


export async function googleCallback(req: Request, res: Response) {
	const storedState = req.cookies[STATE_COOKIE]

	// Clear the temporary state cookie on every callback.
	res.clearCookie(STATE_COOKIE, cookieOptions)
	
	if (req.session) {
		throw new ConflictError({
			message: 'You are already logged in',
		})
	}

	const state = req.query.state
	const code = req.query.code

	if (
		typeof storedState !== 'string' ||
		typeof state !== 'string' ||
		!/^[a-f0-9]{64}$/.test(storedState) ||
		!/^[a-f0-9]{64}$/.test(state) ||
		!timingSafeEqual(
			Buffer.from(storedState, 'hex'),
			Buffer.from(state, 'hex')
		)
	) {
		throw new BadRequestError({
		code: E.INVALID_OAUTH_STATE,
		message: 'Invalid or missing OAuth state',
		})
	}

	if (req.query.error) {
		throw new BadRequestError({
		code: E.GOOGLE_AUTHORIZATION_DENIED,
		message: 'Google authorization was not completed',
		})
	}

	if (typeof code !== 'string' || !code) {
		throw new BadRequestError({
		code: E.MISSING_AUTHORIZATION_CODE,
		message: 'Missing Google authorization code',
		})
	}

	let googleProfileResponse;
	let googleProfile: GoogleProfile;
	try {
		googleProfileResponse = await verifyGoogleAuthorizationCode(code);
		const parsed = emailSchema.safeParse({
			email: googleProfileResponse.email,
		})
		if (parsed.error) {
			throw new BadRequestError({
				message: "Input contains invalid fields",
				details: formatZodErrors(parsed.error),
			})
		}
		googleProfile = {
			googleId: googleProfileResponse.googleId,
			email: parsed.data.email,
			name: googleProfileResponse.name,
			picture: googleProfileResponse.picture,
			passwordHash: null,
			emailVerified: true,
		}
	} catch (error) {
	if (error instanceof GoogleInvalidCredentialsError) {
		throw new UnauthorizedError({
		code: E.GOOGLE_AUTHENTICATION_FAILED,
		message: 'Google authentication could not be completed',
		})
	}

	if (error instanceof GoogleProviderError) {
		throw new BadGatewayError({
			code: E.GOOGLE_PROVIDER_ERROR,
			message: 'Google authentication service is unavailable',
		})
	}

	throw error;
	}

	let user;
	try {
		user = await createGoogleUser(googleProfile)
	} catch (error) {
		if (error instanceof GoogleAuthError) {
			throw new BadRequestError({
				message: error.message,
			})
		}
		throw error;
	}
	if (!user) {
		throw new InternalError({
			message: 'Google user could not be retrieved or created',
		})
	}

	const session = await sessionService.openSession(user.id, {
		ipOrigin: req.ip ?? null,
		userAgent: req.get('user-agent')?.slice(0, 255) ?? null,
	})

	setSessionCookie(res, session)

	res.redirect(303, '/')
}


