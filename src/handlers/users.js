import { getFormatedDate, getFormatedTime } from "../utils/helper.js";
import { getMany, getOne } from "../utils/index.js";
import { getStatusByConversationId } from "./chat.js";
import { getPostLikes, getPostUnlikes } from "./post.js";
import { getUserFriendIds, userInFriendship } from "./relations.js";

const limit = 20;

export const usersSearchBy = async (p_user_id, p_word, p_offset) => {
    const offset = (p_offset - 1) * limit;
    const sql = `SELECT u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, gl_user_role_id FROM users u
                 WHERE (u.first_name like '%${p_word}%' or u.last_name like '%${p_word}%') AND u.user_id <> ? limit ? offset ?`;
    const users = await getMany(sql, [p_user_id, limit, offset]);
    return users;
}

export const usersFilterBy = async (p_user_id, p_word, p_offset) => {
    const offset = (p_offset - 1) * limit;
    const friendIds = await getUserFriendIds(p_user_id);
    const friendsIn = friendIds.join(',');
    const sql = `SELECT u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, gl_user_role_id, uc.user_conversation_id, uc.conversation_id, uc.seen
                 FROM users u
                 JOIN user_conversations uc ON uc.user_id = u.user_id
                 WHERE (u.first_name like '%${p_word}%' or u.last_name like '%${p_word}%') AND u.user_id <> ? ${friendIds.length > 0 ? `AND u.user_id IN(${friendsIn})` : ''} limit ? offset ?`;
    const users = await getMany(sql, [p_user_id, limit, offset]);
    return users;
}

export const userUserName = async (p_user_id) => {
    const sql = `SELECT user_name FROM users where user_id = ?`;
    const user_name = await getOne(sql, [p_user_id]);
    return user_name;
}

export const usersAbout = async (p_user_id, p_user_name) => {
    const sql = `SELECT u.user_id, u.first_name, u.last_name, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, gl_user_role_id
                 FROM users u
                 WHERE u.user_name = ?`;
    const user = await getOne(sql, [p_user_name]);
    const user_id = user.user_id;
    const friendship = await userInFriendship(user_id, p_user_id);
    if (friendship) {
        user.friendship = 1;
    } else {
        user.friendship = 0;
    }
    if (user_id !== p_user_id) {
        const initConversation = await getOne('select * from init_conversation where (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?);', [p_user_id, user_id, user_id, p_user_id]);
        const conversation_id = initConversation.conversation_id;
        user.conversation_id = conversation_id;
        user.myself = 0;
    } else {
        user.conversation_id = 0;
        user.myself = 1;
    }

    return user;
}

export const usersPosts = async (p_user_id, p_user_name) => {
    const user = await getOne('SELECT user_id FROM users WHERE user_name = ?', [p_user_name]);
    const user_id = user.user_id;
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
        WHEN pr.user_id = ? AND pr.reaction_type = 1 THEN 1 
        ELSE 0 
    END) AS liked,
    MAX(CASE 
        WHEN pr.user_id = ? AND pr.reaction_type = 0 THEN 1 
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
WHERE p.user_id = ?
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

    const posts = await getMany(sql, [user_id, user_id, user_id]);
    for (var i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (post.hasOwnProperty('comments')) {
            post.comments = JSON.parse(post.comments);
        }
        if (post.hasOwnProperty('medias')) {
            post.medias = JSON.parse(post.medias);
        }

        post.likes = await getPostLikes(post.post_id);
        post.unlikes = await getPostUnlikes(post.post_id);
    }
    return posts;
}

export const usersFriends = async (p_user_id, p_user_name) => {
    const user = await getOne('SELECT user_id FROM users WHERE user_name = ?', [p_user_name]);
    const user_id = user.user_id;
    const sql = `SELECT DISTINCT u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, ur.relation_status, ur.updated_at
                 FROM user_relations ur
                 JOIN users u ON ur.from_id = u.user_id
                 WHERE (ur.from_id = ? OR ur.to_id = ?)
                 AND ur.relation_status = ?
                 AND u.user_id != ?`;

    const users = await getMany(sql, [user_id, user_id, 1, user_id]);
    console.log(users);
    for (var i = 0; i < users.length; i++) {
        const user = users[i];
        const u_id = user.user_id;
        user.date = getFormatedDate(user.updated_at);
        user.time = getFormatedTime(user.updated_at);
        console.log(user_id);
        console.log(p_user_id);
        const initConversation = await getOne('select * from init_conversation where (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?);', [u_id, user_id, user_id, u_id]);
        console.log(initConversation);
        const conversation_id = initConversation.conversation_id;
        user.conversation_id = conversation_id;
        user.online = getStatusByConversationId(conversation_id);
    }
    return users;
}

export const usersContacts = async (p_user_id, p_user_name) => {
    const user = await getOne('SELECT user_id FROM users WHERE user_name = ?', [p_user_name]);
    const user_id = user.user_id;
    const sql = `SELECT DISTINCT u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, ur.relation_status, ur.updated_at
                 FROM user_relations ur
                 JOIN users u ON ur.from_id = u.user_id
                 WHERE (ur.from_id = ? OR ur.to_id = ?)
                 AND ur.relation_status = ?
                 AND u.user_id != ?`;

    const users = await getMany(sql, [user_id, user_id, 1, user_id]);
    for (var i = 0; i < users.length; i++) {
        const user = users[i];
        const user_id = user.user_id;
        user.date = getFormatedDate(user.updated_at);
        user.time = getFormatedTime(user.updated_at);
        const initConversation = await getOne('select * from init_conversation where (from_id = ? AND to_id = ?) OR (from_id = ? AND to_id = ?);', [p_user_id, user_id, user_id, p_user_id]);
        const conversation_id = initConversation.conversation_id;
        user.conversation_id = conversation_id;
        user.online = getStatusByConversationId(conversation_id);
    }
    return users;
}