import { OAuth2Client } from 'google-auth-library'

function requiredEnv(name: string): string {
	const value = process.env[name]

	if (!value) {
		throw new Error(`Missing environment variable: ${name}`)
	}
	return value
}

const clientId = requiredEnv('GOOGLE_CLIENT_ID')
const clientSecret = requiredEnv('GOOGLE_CLIENT_SECRET')
const redirectUri = requiredEnv('GOOGLE_CALLBACK_URL')

const client = new OAuth2Client(clientId, clientSecret, redirectUri)

export function getGoogleAuthorizationUrl(state: string): string {
	return client.generateAuthUrl({
		access_type: 'online',
		scope: ['openid', 'email', 'profile'],
		state,
		prompt: 'select_account',
	})
}

export class GoogleInvalidCredentialsError extends Error {
	constructor() {
		super('Google credentials are invalid')
		this.name = 'GoogleInvalidCredentialsError'
	}
}

export class GoogleProviderError extends Error {
	constructor() {
		super('Google authentication provider failed')
		this.name = 'GoogleProviderError'
	}
}

function isInvalidGrant(error: unknown): boolean {
	if (typeof error !== 'object' || error === null) {
		return false
	}

	if (!('response' in error)) {
		return false
	}

	const response = error.response

	if (typeof response !== 'object' || response === null) {
		return false
	}

	if (!('data' in response)) {
		return false
	}

  	const data = response.data

	return (
		typeof data === 'object' &&
		data !== null &&
		'error' in data &&
		data.error === 'invalid_grant'
	)
}

export async function verifyGoogleAuthorizationCode(code: string) {

	let tokens

	try {
		const response = await client.getToken(code)
		tokens = response.tokens
	} catch (error) {
		if (isInvalidGrant(error)) {
			throw new GoogleInvalidCredentialsError()
	}
	throw new GoogleProviderError()
	}


	if (!tokens.id_token) {
		throw new GoogleInvalidCredentialsError()
	}

	let payload

	try {
		const ticket = await client.verifyIdToken({
			idToken: tokens.id_token,
			audience: clientId,
		})

		payload = ticket.getPayload()
	} catch {
		throw new GoogleInvalidCredentialsError()
	}

	if (
		!payload?.sub ||
		!payload.email ||
		payload.email_verified !== true ||
		!['accounts.google.com', 'https://accounts.google.com'].includes(payload.iss)
	) {
		throw new GoogleInvalidCredentialsError()
	}

	return {
		googleId: payload.sub,
		email: payload.email,
		name: payload.name ?? null,
		picture: payload.picture ?? null,
	}
}