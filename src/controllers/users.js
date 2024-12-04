import { usersFilterBy, usersSearchBy, userUserName } from "../handlers/users.js";

export const UsersSearchBy = async (req, res, next) => {
    const userId = req.userId;
    const word = req.query.word;
    const offset = req.query.offset;
    const response = await usersSearchBy(userId, word, offset);
    res.json(response);
}

export const UsersFilterBy = async (req, res, next) => {
    const userId = req.userId;
    const word = req.query.word;
    const offset = req.query.offset;
    const response = await usersFilterBy(userId, word, offset);
    res.json(response);
}

export const UserUserName = async (req, res, next) => {
    const userId = req.userId;
    const response = await userUserName(userId);
    res.json(response);
}