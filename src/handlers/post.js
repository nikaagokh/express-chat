import { Post } from '../model/posts.model.js';
import { PostMedia } from '../model/post-media.model.js';
import { PostReaction } from '../model/post-reactions.model.js';
import { PostShare } from '../model/post-shares.model.js';
import { deleteRow, getMany, getOne, insertRow, throwError } from '../utils/index.js';
import { Comment } from '../model/comments.model.js';
import { PostComment } from '../model/post-comments.model.js';
import { getUserFriendIds } from './relations.js';


/*
SELECT 
    p.post_id, p.content, p.post_type, p.created_at, u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.image,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"comment_id":', c.comment_id, 
               ',"content":"', c.content, '"',
               ',"user_id":', c.user_id, ''
               ',"created_at":"', c.created_at,'"}')
    ), ']') AS comments,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"media_type":', pm.media_type,
               ',"media_name":"', pm.media_name, '"',
               ',"media_size":', pm.media_size, '}')
    ), ']') AS medias
FROM 
    posts p
LEFT JOIN 
    comments c ON c.post_id = p.post_id
LEFT JOIN 
    users u ON u.user_id = p.user_id
LEFT JOIN 
    post_media pm ON pm.post_id = p.post_id
${friendIds.length > 0 ? 'WHERE p.user_id IN(${friendPlaceholders})': ''}
GROUP BY 
    p.post_id,
    p.content, 
    p.post_type, 
    p.created_at, 
    u.user_id, 
    full_name, 
    u.image
ORDER BY p.created_at DESC 
*/
export const getAllPosts = async (user_id) => {
    const friendIds = await getUserFriendIds(user_id);
    const friendPlaceholders = friendIds.map(_ => '?');
    const sql = `SELECT 
    p.post_id, 
    p.content, 
    p.post_type, 
    p.created_at, 
    u.user_id, 
    CONCAT(u.first_name, ' ', u.last_name) AS full_name, 
    u.image,
    u.user_name,
    IFNULL(comments.comments_json, '[]') AS comments,
    IFNULL(medias.medias_json, '[]') AS medias,
    MAX(CASE 
        WHEN pr.user_id = ${user_id} AND pr.reaction_type = 1 THEN 1 
        ELSE 0 
    END) AS liked,
    MAX(CASE 
        WHEN pr.user_id = ${user_id} AND pr.reaction_type = 0 THEN 1 
        ELSE 0 
    END) AS unliked
FROM 
    posts p
LEFT JOIN 
    users u ON u.user_id = p.user_id
LEFT JOIN 
    (
        SELECT 
            c.post_id,
            CONCAT('[', GROUP_CONCAT(
                CONCAT('{"comment_id":', c.comment_id, 
                       ',"content":"', c.content, '"',
                       ',"user_id":', c.user_id, '',
                       ',"created_at":"', c.created_at,'"}')
                ORDER BY c.created_at ASC SEPARATOR ','), ']') AS comments_json
        FROM 
            comments c
        GROUP BY 
            c.post_id
    ) AS comments ON comments.post_id = p.post_id
LEFT JOIN 
    (
        SELECT 
            pm.post_id,
            CONCAT('[', GROUP_CONCAT(
                CONCAT('{"media_type":"', pm.media_type, '"',
                       ',"media_name":"', pm.media_name, '"',
                       ',"media_size":', pm.media_size, '}')
                ORDER BY pm.media_name ASC SEPARATOR ','), ']') AS medias_json
        FROM 
            post_media pm
        GROUP BY 
            pm.post_id
    ) AS medias ON medias.post_id = p.post_id
LEFT JOIN 
    post_reactions pr ON pr.post_id = p.post_id
${friendIds.length > 0 ? `WHERE p.user_id IN(${friendPlaceholders})` : ''}
GROUP BY 
    p.post_id, 
    p.content, 
    p.post_type, 
    p.created_at, 
    u.user_id, 
    full_name, 
    u.image
ORDER BY 
    p.created_at DESC;
`;

    const posts = await getMany(sql, friendIds);
    for(var i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (post.hasOwnProperty('comments')) {
            post.comments = JSON.parse(post.comments);
        }
        if(post.hasOwnProperty('medias')) {
            post.medias = JSON.parse(post.medias);
        }

        post.likes = await getPostLikes(post.post_id);
        post.unlikes = await getPostUnlikes(post.post_id);
    }
    return posts;
}

export const getMyPosts = async (user_id) => {
    const sql = `SELECT 
    p.post_id, p.content, p.post_type, p.created_at, u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.image,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"comment_id":', c.comment_id, 
               ',"content":"', c.content, '"',
               ',"user_id":', c.user_id, ''
               ',"created_at":"', c.created_at,'"}')
    ), ']') AS comments
FROM 
    posts p
LEFT JOIN 
    comments c ON c.post_id = p.post_id
LEFT JOIN 
    users u ON u.user_id = p.user_id
LEFT JOIN 
    users cu ON cu.user_id = c.user_id
WHERE p.user_id = ?
GROUP BY 
    p.post_id
ORDER BY p.created_at DESC`;

    const posts = await getMany(sql, [user_id]);
    posts.forEach(post => {
        if (post.hasOwnProperty('comments')) {
            post.comments = JSON.parse(post.comments);
        }
    })
    return { posts };
}

export const getSharedPosts = async (user_id) => {
    const sql = `SELECT 
    p.post_id, p.content, p.post_type, p.created_at, u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.image,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"comment_id":', c.comment_id, 
               ',"content":"', c.content, '"',
               ',"user_id":', c.user_id, ''
               ',"created_at":"', c.created_at,'"}')
    ), ']') AS comments
FROM 
    posts p
LEFT JOIN 
    comments c ON c.post_id = p.post_id
LEFT JOIN 
    users u ON u.user_id = p.user_id
LEFT JOIN 
     post_shares ps ON ps.post_id = p.post_id
WHERE ps.user_id = ?
GROUP BY 
    p.post_id
ORDER BY p.created_at DESC`;
    const posts = await getMany(sql, [user_id]);
    posts.forEach(post => {
        if (post.hasOwnProperty('comments')) {
            post.comments = JSON.parse(post.comments);
        }
    })
    return { posts };
}

export const getPostById = async (user_id, post_id) => {
    const sql = `SELECT 
    p.post_id, p.content, p.post_type, p.created_at, u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.image,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"comment_id":', c.comment_id, 
               ',"content":"', c.content, '"',
               ',"user_id":', c.user_id, ''
               ',"created_at":"', c.created_at,'"}')
    ), ']') AS comments
FROM 
    posts p
LEFT JOIN 
    comments c ON c.post_id = p.post_id
LEFT JOIN 
    users u ON u.user_id = p.user_id
WHERE p.post_id = ?
GROUP BY 
    p.post_id
ORDER BY p.created_at DESC`;
    const posts = await getMany(sql, [user_id]);
    posts.forEach(post => {
        if (post.hasOwnProperty('comments')) {
            post.comments = JSON.parse(post.comments);
        }
    })
    return { posts };
}

export const sharePost = async (user_id, post_id) => {
    const sql = `SELECT * FROM post_shares WHERE post_id = ? AND user_id = ?`;
    const postShared = await getOne(sql, [post_id, user_id]);
    if (postShared) throwError('მსგავსი პოსტი უკვე გაზიარებული გაქვთ', 400);
    const postShare = new PostShare(post_id, user_id);
    await insertRow('post_shares', postShare);
    return { shared: true };
}

export const unSharePost = async (user_id, post_id) => {
    const sql = `SELECT * FROM post_shares WHERE post_id = ? AND user_id = ?`;
    const postShared = await getOne(sql, [post_id, user_id]);
    if (!postShared) throwError('მსგავსი პოსტი არ გაქვთ გაზიარებული', 400);
    const post_share_id = postShared.post_share_id;
    await deleteRow('post_shares', { post_share_id });
    return { unshared: true };
}

export const postBasic = async (user_id, content) => {
    const post = new Post(content, 1, user_id);
    const [qr] = await insertRow('posts', post);
    const post_id = qr.insertId;
    const sql = `SELECT * FROM posts WHERE post_id = ?`;
    return await getOne(sql, [post_id]);
}

export const postFile = async (user_id, content, files) => {
    const post = new Post(content, 2, user_id);
    const [qr] = await insertRow('posts', post);
    const post_id = qr.insertId;
    for (var i = 0; i < files.length; i++) {
        let media_type;
        const mime_type = files[i].mimetype;
        const media_name = files[i].filename;
        const media_size = files[i].size;
        if (mime_type.startsWith('image/')) {
            media_type = 1;
        } else if (mime_type.startsWith('video/')) {
            media_type = 2;
        } else {
            media_type = 3;
        }
        const postMedia = new PostMedia(post_id, media_type, media_name, media_size);
        await insertRow('post_media', postMedia);
    }
    const sql = `SELECT 
    p.post_id, p.content, p.post_type, p.created_at,
    CONCAT('[', GROUP_CONCAT(
        CONCAT('{"post_media_id":', pm.post_media_id, 
               ',"media_type":', pm.media_type, '',
               ',"media_name":"', pm.media_name,  '"',
               ',"media_size":"', pm.media_size, '"}')
    ), ']') AS medias
FROM 
    posts p
LEFT JOIN 
    post_media pm ON pm.post_id = p.post_id
WHERE p.post_id = ?
GROUP BY 
    p.post_id;`;
    const row = await getOne(sql, [post_id]);
    row.medias = JSON.parse(row.medias);
    return row;

}

export const postManageLike = async (user_id, post_id) => {
    const sql = `SELECT pr.post_reaction_id FROM post_reactions pr 
                 LEFT JOIN posts p ON p.post_id = pr.post_id
                 WHERE pr.post_id = ? AND pr.user_id = ? AND pr.reaction_type = 1
                 `;
    const postReaction = await getOne(sql, [post_id, user_id]);
    if (postReaction) {
        deleteRow('post_reactions', { post_reaction_id: postReaction.post_reaction_id });
        return { like: false};
    } else {
        const postReaction = new PostReaction(1, post_id, user_id);
        insertRow('post_reactions', postReaction);
        return { like: true };
    }
}

export const postManageUnLike = async (user_id, post_id) => {
    const sql = `SELECT pr.post_reaction_id FROM post_reactions pr 
                 LEFT JOIN posts p ON p.post_id = pr.post_id
                 WHERE pr.post_id = ? AND pr.user_id = ? AND pr.reaction_type = 0
                 `;
    const postReaction = await getOne(sql, [post_id, user_id]);
    if (postReaction) {
        deleteRow('post_reactions', { post_reaction_id: postReaction.post_reaction_id });
        return { unlike: false };
    } else {
        const postReaction = new PostReaction(0, post_id, user_id);
        insertRow('post_reactions', postReaction);
        return { unlike: true };
    }
}

export const postAddComment = async (user_id, post_id, content) => {
    const comment = new Comment(content, post_id, user_id);
    const [qr1] = await insertRow('comments', comment);
    const comment_id = qr1.insertId;
    const postComment = new PostComment(post_id, comment_id);
    const [qr2] = await insertRow('post_comments', postComment);
    const post_comment_id = qr2.insertId;
    const sql = `SELECT c.comment_id, c.content, pc.post_id, pc.created_at, pc.post_comment_id FROM comments c
                 LEFT JOIN post_comments pc ON pc.comment_id = c.comment_id
                 WHERE pc.post_comment_id = ?`;
    const commenti = await getOne(sql, [post_comment_id]);
    return commenti;

}

export const postDeleteComment = async (user_id, post_comment_id) => {
    const sql = `SELECT * FROM post_comments pc
                 LEFT JOIN comments c ON c.comment_id = pc.comment_id
                 WHERE c.user_id = ? AND pc.post_comment_id = ?`;
    const postComment = await getOne(sql, [user_id, post_comment_id]);
    if (!postComment) throwError('მსგავსი კომენტარი პოსტში არ მოიძებნა!', 400);
    const pc_id = postComment.post_comment_id;
    deleteRow('post_comments', { post_comment_id: pc_id });
    return { post_comment_id: pc_id };
}

const getPostLikes = async (post_id) => {
    const sql = `SELECT COUNT(*) as likes FROM post_reactions WHERE post_id = ? AND reaction_type = 1`;
    const likesObject = await getOne(sql, [post_id]);
    return likesObject.likes;
}

const getPostUnlikes = async (post_id) => {
    const sql = `SELECT COUNT(*) as unlikes FROM post_reactions WHERE post_id = ? AND reaction_type = 0`;
    const unlikesObject = await getOne(sql, [post_id]);
    return unlikesObject.unlikes;
}