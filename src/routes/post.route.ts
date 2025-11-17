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

postRouter.post('/', authenticate, createPost);

postRouter.get('/', showAllPosts); // get all the posts that matches queryparam metadata

postRouter.get(
    '/:slug',
    checkAuthHeader,
    authenticate,
    isResourceOwner,
    getOwnerPost
);
postRouter.get('/:slug', getPost); // the next route handler for anonymous clients without authentication

postRouter.patch('/:slug', authenticate, isResourceOwner, updatePost);

postRouter.delete('/:slug', authenticate, isResourceOwner, deletePost);

export { postRouter };
