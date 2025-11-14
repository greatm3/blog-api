import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { isResourceOwner } from '../middlewares/ownership.middleware';
import {
    showAllPosts,
    getPost,
    getOwnerPost,
    createPost,
    updatePost,
    deletePost,
} from '../controllers/post.controller';
import { checkAuthHeader } from '../middlewares/post.checkAuthHeader.middleware'; 

const postRouter = Router();

// the group of middleware handler functions for get post endpoint
const getPostMiddlewars = [checkAuthHeader, authenticate, isResourceOwner];

postRouter.post('/', authenticate, createPost);
postRouter.get('/', showAllPosts);
postRouter.get('/:slug', getPostMiddlewars, getOwnerPost);

postRouter.get('/:slug', getPost); // the next route handler for anonymous clients without authentication

postRouter.patch('/:slug', authenticate, isResourceOwner, updatePost);
postRouter.delete('/:slug', authenticate, deletePost);

export { postRouter };
