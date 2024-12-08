import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { UsersAbout, UsersContacts, UsersFilterBy, UsersFriends, UsersPosts, UsersSearchBy, UserUserName } from "../controllers/users.js";

const router = Router();

router.get('/searchby', authenticateJWT, UsersSearchBy);

router.get('/filterby', authenticateJWT, UsersFilterBy);

router.get('/userName', authenticateJWT, UserUserName);

router.get('/about/:userName', authenticateJWT, UsersAbout);

router.get('/posts/:userName', authenticateJWT, UsersPosts);

router.get('/contact-users/:userName', authenticateJWT, UsersFriends);

export default router;