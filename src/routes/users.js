import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { UsersAbout, UsersFilterBy, UsersFriends, UsersPostLikeAuthors, UsersPostReactionAuthors, UsersPosts, UsersPostUnlikeAuthors, UsersSearchBy, UsersShares, UsersUploadProfile, UserUserName } from "../controllers/users.js";
import { uploadUser } from "../utils/index.js";

const router = Router();

router.get('/searchby', authenticateJWT, UsersSearchBy);

router.get('/filterby', authenticateJWT, UsersFilterBy);

router.get('/userName', authenticateJWT, UserUserName);

router.get('/about/:userName', authenticateJWT, UsersAbout);

router.get('/posts/:userName', authenticateJWT, UsersPosts);

router.get('/shares/:userName', authenticateJWT, UsersShares);

router.get('/contact-users/:userName', authenticateJWT, UsersFriends);

router.get('/likes/:postId', authenticateJWT, UsersPostLikeAuthors);

router.get('/unlikes/:postId', authenticateJWT, UsersPostUnlikeAuthors);

router.get('/reactions/:postId', authenticateJWT, UsersPostReactionAuthors);

router.post('/profile', authenticateJWT, uploadUser.array('file'), UsersUploadProfile)

export default router;