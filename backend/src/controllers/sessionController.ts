
const argon2 = require('argon2')

const sessionService = require('../services/sessionService.ts')
const userService = require('../services/userService.ts')

import type { Request, Response } from 'express';

const openSession = async (req: Request, res: Response) => {

	if (req.session)
	{
		// 409 conflict
	}

	const {username, password} = req.body

	const user = await userService.isValidCredentials(username, password) /* Somthing like this */

	const session = await sessionService.generateSession(user)

	res.cookie('sessionID', session.id, {
		httpOnly: true,
		// Will add more later, currently just for production and testing
	})

	res.status(201).json({
		"data": {
			"authenticated": true
		}
	})
}

const closeSession = (req: Request, res: Response) => {

	sessionService.removeSession(req.params.id);

	res.status(204).end();
}

const closeCurrentSession = (req: Request, res: Response) => {

	const sessionID = req.session?.id

	if (!sessionID)
	{
		res.status(204).end()
		return ;
	}

	sessionService.removeSession(sessionID);

	res.status(204).end();
}

module.exports = {
	openSession,
	closeSession,
	closeCurrentSession,
}