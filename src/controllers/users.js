import { usersAbout, usersContacts, usersFilterBy, usersFriends, usersPosts, usersSearchBy, userUserName } from "../handlers/users.js";

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

export const UsersAbout = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersAbout(userId, userName);
    res.json(response);
}

export const UsersPosts = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersPosts(userId, userName);
    res.json(response);
}

export const UsersFriends = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersFriends(userId, userName);
    res.json(response);
}

export const UsersContacts = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersContacts(userId, userName);
    res.json(response);
}