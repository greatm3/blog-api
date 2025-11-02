import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { showAllPosts } from "../controllers/post.controller"

const postRouter = Router();

postRouter.post('/', authenticate, showAllPosts);

export { postRouter };
