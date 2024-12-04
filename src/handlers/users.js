import { getMany, getOne } from "../utils/index.js";
import { getUserFriendIds } from "./relations.js";

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