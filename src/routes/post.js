import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { GetAllPosts, GetMyPosts, GetPostById, GetSharedPosts, PostAddComment, PostBasic, PostComments, PostDeleteComment, PostFile, PostManageLike, PostManageUnLike, SharePost, UnSharePost } from "../controllers/post.js";
import { uploadPost } from "../utils/index.js";


const router = Router();

router.get('/all-posts', authenticateJWT, GetAllPosts);

router.get('/my-posts', authenticateJWT, GetMyPosts);

router.get('/shared-posts', authenticateJWT, GetSharedPosts);

router.get('/:postId', authenticateJWT, GetPostById);

router.post('/share', authenticateJWT, SharePost);

router.post('/unshare', authenticateJWT, UnSharePost);

router.post('/basic', authenticateJWT, PostBasic);

router.post('/file', authenticateJWT, uploadPost.array('file'), PostFile);

router.post('/manage-like', authenticateJWT, PostManageLike);

router.post('/manage-unlike', authenticateJWT, PostManageUnLike);

router.get('/comments/:postId', authenticateJWT, PostComments);

router.post('/comment', authenticateJWT, PostAddComment);

router.delete('/comment', authenticateJWT, PostDeleteComment);

export default router;