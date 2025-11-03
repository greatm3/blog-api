import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { showAllPosts, createPost, updatePost, deletePost } from "../controllers/post.controller"

const postRouter = Router();

postRouter.post('/', authenticate, createPost);
postRouter.get('/', showAllPosts);
postRouter.put('/:slug', authenticate, updatePost);
postRouter.delete('/:slug', authenticate, deletePost)

export { postRouter };
