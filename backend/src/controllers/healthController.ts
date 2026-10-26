import type { Request, Response } from 'express';

export const getHealth = (req: Request, res: Response): void => {
    res.status(200).send('ok');
};
