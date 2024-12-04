import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { UsersFilterBy, UsersSearchBy, UserUserName } from "../controllers/users.js";

const router = Router();

router.get('/searchby', authenticateJWT, UsersSearchBy);

router.get('/filterby', authenticateJWT, UsersFilterBy);

router.get('/userName', authenticateJWT, UserUserName);



export default router;