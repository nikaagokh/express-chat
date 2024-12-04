import { authChangePassword, authCheckEmail, authLogin, authRegister, authRegisterSendOtp, authRegisterVerifyOtp, authRenewPassword, authRenewSendOtp, authVerifySentOtp } from '../handlers/auth.js';

export const AuthRegister = async (req, res, next) => {
    try {
        const file = req.file;
        const { first_name, last_name, user_name, password } = JSON.parse(req.body.data);
        const email = req.email;
        const response = await authRegister(first_name, last_name, user_name, email, password, file);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const AuthLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const response = await authLogin(email, password);
        res.cookie('access_token', response);
        res.json({ done: true });
    } catch(err) {
        next(err);
    }
}

export const AuthChangePassword = async (req, res, next) => {
    try {
        const userId = req.userId;
        const { old_password, new_password } = req.body;
        const response = await authChangePassword(userId, old_password, new_password);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const AuthRenewSendOtp = async (req, res, next) => {
    const email = req.body.email;
    const response = await authRenewSendOtp(email);
    res.json(response);
}

export const AuthRenewVerifyOtp = async (req, res, next) => {
    let { email, otp } = req.body;
    otp = Number(otp);
    const response = await authVerifySentOtp(email, otp);
    res.json(response);
}

export const AuthRenewPassword = async (req, res, next) => {
    const { email, old_password, new_password } = req.body;
    const response = await authRenewPassword(email, old_password, new_password);
    res.json(response);
}

export const AuthCheckEmail = async (req, res, next) => {
    try {
        const email = req.params.email;
        const response = await authCheckEmail(email);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const AuthRegisterSendOtp = async (req, res, next) => {
    try {
        const email = req.body.email;
        const response = await authRegisterSendOtp(email);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const AuthRegisterVerifyOtp = async (req, res, next) => {
    try {
        let { email, otp } = req.body;
        otp = Number(otp);
        const response = await authRegisterVerifyOtp(email, otp);
        if (response) {
            res.cookie('email', email);
        }
        res.json({ response });
    } catch(err) {
        next(err);
    }
}

export const AuthIsAuthed = async (req, res, next) => {
    try {
        const user = req.user;
        res.json({ user });
    } catch(err) {
        next(err);
    }
}