import { Router } from "express";
import viewRouter from './view.js';
import relationRouter from './relations.js';
import chatRouter from './chat.js';
import authRouter from './auth.js';
import usersRouter from './users.js';
import postRouter from './post.js';

const router = Router();

router.use(viewRouter);
router.use('/api/relations', relationRouter);
router.use('/api/chat', chatRouter);
router.use('/api/auth', authRouter);
router.use('/api/users', usersRouter);
router.use('/api/post', postRouter);

export default router;
