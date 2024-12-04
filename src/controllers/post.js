import { getAllPosts, getMyPosts, getPostById, getSharedPosts, postAddComment, postBasic, postDeleteComment, postFile, postManageLike, postManageUnLike, sharePost, unSharePost } from "../handlers/post.js";

export const GetAllPosts = async (req, res, next) => {
    const userId = req.userId;
    const response = await getAllPosts(userId);
    res.json(response);
}

export const GetMyPosts = async (req, res, next) => {
    const userId = req.userId;
    const response = await getMyPosts(userId);
    res.json(response);
}

export const GetSharedPosts = async (req, res, next) => {
    const userId = req.userId;
    const response = await getSharedPosts(userId);
    res.json(response); 
}

export const GetPostById = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.params.postId);
    const response = await getPostById(userId, postId);
    res.json(response); 
}

export const SharePost = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.body.postId);
    const response = await sharePost(userId, postId);
    res.json(response);
}

export const UnSharePost = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.body.postId);
    const response = await unSharePost(userId, postId);
    res.json(response);
}

export const PostBasic = async (req, res, next) => {
    const userId = req.userId;
    const content = req.body.content;
    const response = await postBasic(userId, content);
    res.json(response);
}

export const PostFile = async (req, res, next) => {
    const userId = req.userId;
    const content = JSON.parse(req.body.data).content;
    const files = req.files;
    const response = await postFile(userId, content, files);
    res.json(response);
}

export const PostManageLike = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.body.post_id);
    const response = await postManageLike(userId, postId);
    res.json(response);
}

export const PostManageUnLike = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.body.post_id);
    const response = await postManageUnLike(userId, postId);
    res.json(response);
}

export const PostAddComment = async (req, res, next) => {
    const userId = req.userId;
    const postId = Number(req.body.post_id);
    const content = req.body.content;
    const response = await postAddComment(userId, postId, content);
    res.json(response);
}

export const PostDeleteComment = async (req, res, next) => {
    const userId = req.userId;
    const postCommentId = Number(req.body.postCommentId);
    const response = await postDeleteComment(userId, postCommentId);
    res.json(response);
}