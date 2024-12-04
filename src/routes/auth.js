import { Router } from "express";
import { AuthChangePassword, AuthCheckEmail, AuthIsAuthed, AuthLogin, AuthRegister, AuthRegisterSendOtp, AuthRegisterVerifyOtp, AuthRenewPassword, AuthRenewSendOtp, AuthRenewVerifyOtp } from "../controllers/auth.js";
import { mailVerified } from "../middlewares/mailVerified.js";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { uploadUser } from "../utils/index.js";
import { authLogin } from "../handlers/auth.js";

const router = Router();

router.post('/register', mailVerified, uploadUser.single('file'), AuthRegister);

router.post('/login', AuthLogin);

router.get('/login', async (req, res, next) => {
    const email = req.query.email;
    const password = req.query.password;
    const response = await authLogin(email, password);
    res.cookie('access_token', response);
    res.json({ done: true });
});

router.put('/change-password', authenticateJWT, AuthChangePassword);

router.post('/renew/send-otp', AuthRenewSendOtp);

router.post('/renew/verify-otp', AuthRenewVerifyOtp);

router.post('/renew/password', AuthRenewPassword);

router.post('/register/send-otp', AuthRegisterSendOtp);

router.post('/register/verify-otp', AuthRegisterVerifyOtp);

router.get('/check-email/:email', AuthCheckEmail);

router.get('/isAuthed', authenticateJWT, AuthIsAuthed);

export default router;