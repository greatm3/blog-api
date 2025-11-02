import { Router, Request, Response } from 'express';

const postRouter = Router();

postRouter.post('/posts', (req: Request, res: Response) => {
    res.status(200).json({ test: 'working' });
});

export { postRouter };
