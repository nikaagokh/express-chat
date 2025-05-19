import { usersAbout, usersContacts, usersFilterBy, usersFriends, usersPostLikeAuthors, usersPosts, usersPostUnLikeAuthors, usersSearchBy, usersShares, usersUploadProfile, userUserName } from "../handlers/users.js";

export const UsersSearchBy = async (req, res, next) => {
    try {
        const userId = req.userId;
        const word = req.query.word;
        const offset = req.query.offset;
        const response = await usersSearchBy(userId, word, offset);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const UsersFilterBy = async (req, res, next) => {
    try {
        const userId = req.userId;
        const word = req.query.word;
        const offset = req.query.offset;
        const response = await usersFilterBy(userId, word, offset);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const UserUserName = async (req, res, next) => {
    try {
        const userId = req.userId;
        const response = await userUserName(userId);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const UsersAbout = async (req, res, next) => {
    try {
        const userName = req.params.userName;
        const userId = req.userId;
        const response = await usersAbout(userId, userName);
        res.json(response);
    } catch(err) {
        next(err);
    }
}

export const UsersPosts = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersPosts(userId, userName);
    res.json(response);
}

export const UsersShares = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersShares(userId, userName);
    res.json(response);
}

export const UsersFriends = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersFriends(userId, userName);
    res.json(response);
}

export const UsersPostLikeAuthors = async (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const response = await usersPostLikeAuthors(userId, postId);
    res.json(response);
}

export const UsersPostUnlikeAuthors = async (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const response = await usersPostUnLikeAuthors(userId, postId);
    res.json(response);
}

export const UsersPostReactionAuthors = async (req, res, next) => {
    const userId = req.userId;
    const postId = req.params.postId;
    const likes = await usersPostLikeAuthors(userId, postId);
    const unlikes = await usersPostUnLikeAuthors(userId, postId);
    const reactions = { likes, unlikes }
    res.json(reactions)
}

export const UsersUploadProfile = async (req, res, next) => {
    const userId = req.userId;
    const files = req.files;
    const response = await usersUploadProfile(userId, files);
    res.json(response);
}

export const UsersContacts = async (req, res, next) => {
    const userName = req.params.userName;
    const userId = req.userId;
    const response = await usersContacts(userId, userName);
    res.json(response);
}