
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { AuthenticatedRequest } from '../types/express/Request.js';

type AuthenticatedHandler = (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => unknown;

export const authed = (handler: AuthenticatedHandler): RequestHandler => {
	return async (req, res, next) =>{
		try {
            await handler(req as AuthenticatedRequest, res, next);
        } catch (error) {
            next(error); // 👈 CRUCIAL: Esto le dice a Express "ocurrió este error, envíaselo al manejador global"
        }
	}
}
