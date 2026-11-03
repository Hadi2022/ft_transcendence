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

export async function verifyGoogleAuthorizationCode(code: string) {
  const { tokens } = await client.getToken(code)

  if (!tokens.id_token) {
    throw new Error('Google did not return an ID token')
  }

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: clientId,
  })

  const payload = ticket.getPayload()

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true ||
    !['accounts.google.com', 'https://accounts.google.com'].includes(
      payload.iss
    )
  ) {
    throw new Error('Invalid Google identity')
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? null,
    picture: payload.picture ?? null,
  }
}