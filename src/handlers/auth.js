import jwt from 'jsonwebtoken';
import argon from 'argon2';
import nodemailer from 'nodemailer';
import { deleteRow, SECRET_KEY } from '../utils/index.js';
import { getOne, insertRow, throwError, updateRow } from "../utils/index.js";
import { UserOtp } from '../model/user-otps.model.js';
import { User } from '../model/users.model.js';


const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "vgparts.info@gmail.com",
        pass: "jtbv qckw whtm fuwf",
    }
})

export const authRegister = async (first_name, last_name, user_name, email, password, file) => {
    const fileName = checkUserAvatar(file);
    const user = await userExists(email);
    if (user) throwError('მომხმარებელი მსგავსი მეილით უკვე არსებობს');
    const hashedPassword = await hashPassword(password);
    const newUser = new User(first_name, last_name, user_name, email, hashedPassword, fileName);
    await insertRow('users', newUser);
    await deleteRow('user_otps', { email });
    return { done: true };
}

export const authLogin = async (email, password) => {
    const validate = await validateUser(email, password);
    const jwt = generateJWT(validate);
    return jwt;
}

export const authChangePassword = async (userId, oldPassword, newPassword) => {
    const user = await getOne('select * from users where user_id = ?', [userId]);
    if (!user) throwError('მომხმარებელი ვერ მოიძებნა', 400);
    const match = await comparePassword(oldPassword, user.password);
    if (!match) throwError('პაროლი არასწორია', 400);
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await updateRow('users', user, { id: userId });
    return { updated: true };
}

export const authRenewSendOtp = async (email) => {
    const userExist = await userExists(email);
    if (!userExist) throwError('მომხმარებელი მსგავსი მეილით ვერ მოიძებნა', 400);
    const otp = generateOtpCode();
    const sendEmail = await sendOtp(email, otp);
    if (sendEmail) {
        const otpExist = await otpEmailExist(email);
        if (otpExist) {
            updateRow('user_otps', { otp }, { user_otp_id: otpExist.user_otp_id })
        } else {
            const userOtp = new UserOtp(email, otp);
            await insertRow('user_otps', userOtp);
        }
    }
}

export const authVerifySentOtp = async (email, otp) => {
    const userOtp = await userOtpExist(email, otp);
    if (!userOtp) {
        return false;
    } else {
        const object = { verified: 1 };
        updateRow('user_otps', object, { user_otp_id: userOtp.user_otp_id });
        return true;
    }
}

export const authRenewPassword = async (email, old_password, new_password) => {
    const otpEmail = await verifyOtpEmail(email);
    if (!otpEmail) throwError('ეს მეილი არაა ვერიფიცირებული', 400);
    const user = await userExists(email);
    if (!user) throwError('მომხმარებელი მსგავსი მეილით ვერ მოიძებნა', 400);
    const match = await comparePassword(old_password, user.password);
    if (!match) throwError('პაროლი არასწორია', 400);
    const hashedPassword = await hashPassword(new_password);
    const user_id = user.user_id;
    user.password = hashedPassword;
    await updateRow('users', user, { user_id });
    return { updated: true };
}

export const authCheckEmail = async (email) => {
    const otpEmail = await verifyOtpEmail(email);
    if (!otpEmail) throwError('ეს მეილი არაა ვერიფიცირებული', 400);
    return { done: true };
}

export const authRegisterSendOtp = async (email) => {
    const userExist = await userExists(email);
    if (userExist) throwError('მომხმარებელი მსგავსი მეილით უკვე არსებობს', 400);
    const otp = generateOtpCode();
    const sendEmail = await sendOtp(email, otp);
    if (sendEmail) {
        const otpExist = await otpEmailExist(email);
        if (otpExist) {
            updateRow('user_otps', { otp }, { user_otp_id: otpExist.user_otp_id })
        } else {
            const userOtp = new UserOtp(email, otp);
            await insertRow('user_otps', userOtp);
        }
    }
}

export const authRegisterVerifyOtp = async (email, otp) => {
    const userOtp = await userOtpExist(email, otp);
    if (!userOtp) {
        return false;
    } else {
        const object = { verified: 1 };
        updateRow('user_otps', object, { user_otp_id: userOtp.user_otp_id });
        return true;
    }
}

const sendOtp = async (email, otp) => {
    const info = await transporter.sendMail({
        from: 'vgparts.info@gmail.com',
        to: `${email}`,
        subject: "ვერიფიკაცია",
        text: `თქვენი ვერიფიკაციის კოდია - ${otp}`
    });
    if (info.rejected.length > 0) throwError('პრობლემა შეიქმნა მეილის გაგზავნისას, მოგვიანებით სცადეთ', 400);
    return { done: true };
}

const generateOtpCode = () => {
    const otp = Math.floor(10000000 + Math.random() * 90000000);
    return otp;
}

const userExists = async (email) => {
    const user = await getOne('select * from users where email = ?', [email]);
    return user;
}

const otpEmailExist = async (email) => {
    const otpUser = await getOne('select * from user_otps where email = ?', [email]);
    return otpUser;
}

const userOtpExist = async (email, otp) => {
    const userOtp = await getOne('select * from user_otps where email = ? and otp = ?', [email, otp]);
    return userOtp;
}

const validateUser = async (email, pass) => {
    const exist = await userExists(email);
    if (!exist) throwError('მომხმარებელი მსგავსი მეილით ვერ მოიძებნა', 400);
    const match = await comparePassword(pass, exist.password);
    if (!match) throwError('მომხმარებლის პაროლი არასწორია', 400);
    const { password, ...result } = exist;
    return result;
}

const verifyOtpEmail = async (email) => {
    const sql = `SELECT * FROM user_otps WHERE email = ? AND verified = ?`;
    const userOtp = await getOne(sql, [email, 1]);
    return userOtp;
}

const checkUserAvatar = (file) => {
    if (file) {
        const { mimetype, filename, size } = file;
        if (!mimetype.startsWith('image/')) throwError('აუცილებელია, რომ ფოტო იყოს png ან jpg გაფართოების');
        const maxSize = 1 * 1024 * 1024;
        if (size > maxSize) throwError('ფოტოს მოცულობა არ უნდა იყოს 1 მეგაბაიტზე მეტი', 400);
        return filename;
    } else {
        return 'user.png';
    }
}

const generateJWT = async (value) => {
    const accessToken = jwt.sign({ user: value }, SECRET_KEY, {
        expiresIn: '366000s'
    });
    return accessToken;

}

const hashPassword = async (password) => {
    return await argon.hash(password);
}

const comparePassword = async (password, hashedpassword) => {
    console.log(await argon.hash(password));
    return await argon.verify(hashedpassword, password)
}