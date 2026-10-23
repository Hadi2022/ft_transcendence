
const sessionService = require('../services/sessionService.ts')
const userService = require('../services/userService.ts')

const sessionConstants = require('../constants/session.ts')

import type { Request, Response } from 'express';

const openSession = async (req: Request, res: Response) => {

	// if (req.session)
		// throw new ConflictError('Session already exists') // will be implemented with /types/errors.ts


	const {username, password} = req.body

	const user = await userService.isValidCredentials(username, password) /* Somthing like this */

	const session = await sessionService.generateSession(user)

	res.cookie(sessionConstants.COOKIE_NAME, session.id, {
		httpOnly: true,
		expires: session.expiresAt,
		// Will add more later, currently just for production and testing
	})

	res.status(201).json({
		"data": {
			"authenticated": true
		}
	})
}

const closeSession = async (req: Request, res: Response) => {

	await sessionService.removeSession(req.params.id);

	res.status(204).end();
}

const closeCurrentSession = async (req: Request, res: Response) => {

	const sessionID = req.session?.userId

	if (!sessionID)
	{
		res.status(204).end()
		return ;
	}

	await sessionService.removeSession(sessionID);

	res.status(204).end();
}

module.exports = {
	openSession,
	closeSession,
	closeCurrentSession,
}