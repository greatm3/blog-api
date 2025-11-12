import { NextFunction, Request, Response, Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { isResourceOwner } from '../middlewares/ownership.middleware';
import {
    showAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
} from '../controllers/post.controller';
import { checkAuthHeader } from '../middlewares/post.checkAuthHeader.middleware';

const postRouter = Router();

// the group of middleware handler functions for get endpoint
const getPostMiddlewars = [checkAuthHeader, authenticate, isResourceOwner];

postRouter.post('/', authenticate, createPost);
postRouter.get('/', showAllPosts);
postRouter.get('/:slug', getPost, getPostMiddlewars);
postRouter.put('/:slug', authenticate, updatePost);
postRouter.delete('/:slug', authenticate, deletePost);

export { postRouter };
