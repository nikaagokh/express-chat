import { Conversation } from "../model/conversations.model.js";
import { InitConversation } from "../model/init-conversation.model.js";
import { UserConversation } from "../model/user-conversations.model.js";
import { UserRelation } from "../model/user-relations.model.js";
import { getFormatedDate, getFormatedTime } from "../utils/helper.js";
import { deleteRow, getMany, getOne, insertRow, updateRow } from "../utils/index.js";
import { getStatusByConversationId } from "./chat.js";


export const relationsSendRequests = async (p_user_id) => {
    const sql = `SELECT ur.user_relation_id, ur.relation_status, ur.created_at, ur.updated_at, u.user_id, concat(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image
                 FROM user_relations ur
                 JOIN users u ON ur.to_id = u.user_id
                 WHERE ur.from_id = ? and ur.relation_status = ?`;
    const requests = await getMany(sql, [p_user_id, 2]);
    return requests;
}

export const relationsReceiveRequests = async (p_user_id) => {
    const sql = `SELECT ur.user_relation_id, ur.relation_status, ur.created_at, ur.updated_at, u.user_id, concat(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image 
                 FROM user_relations ur
                 JOIN users u ON ur.from_id = u.user_id
                 WHERE ur.to_id = ? and ur.relation_status = ?`;
    const requests = await getMany(sql, [p_user_id, 2]);
    return requests;
}

export const relationsContactUsers = async (p_user_id) => {
    const sql = `SELECT DISTINCT u.user_id, CONCAT(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image, ur.relation_status, ur.updated_at
                 FROM user_relations ur
                 JOIN users u ON ur.from_id = u.user_id
                 WHERE (ur.from_id = ? OR ur.to_id = ?)
                 AND ur.relation_status = ?
                 AND u.user_id != ?`;

    const users = await getMany(sql, [p_user_id, p_user_id, 1, p_user_id]);
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

export const relationsBlockUsers = async (p_user_id) => {
    const sql = `SELECT ur.user_relation_id, ur.relation_status, ur.created_at, ur.updated_at, u.user_id, concat(u.first_name, ' ', u.last_name) as full_name, u.user_name, u.image 
                 FROM user_relations ur
                 JOIN users u ON ur.to_id = u.user_id
                 WHERE ur.from_id = ? and ur.relation_status = ?`;
    const users = await getMany(sql, [p_user_id, 3]);
    users.forEach(user => {
        user.date = getFormatedDate(user.updated_at);
        user.time = getFormatedTime(user.updated_at);
    })
    return users;
}


export const relationsAddRelation = async (p_from_id, p_to_id, p_relation_status) => {
    const relation = await userInFriendship(p_from_id, p_to_id);
    if (relation) {
        if (p_relation_status === 0) {
            deleteFriendship(p_from_id, p_to_id);
        } else if (p_relation_status === 3) {
            updateBlockUser(p_from_id, p_to_id);
        }
    } else {
        if (p_relation_status === 2) {
            const relation = await getHisRelation(p_from_id, p_to_id);
            if (!relation) {
                const userRelation = new UserRelation(p_from_id, p_to_id, 2);
                await insertRow('user_relations', userRelation);
            } else {
                if (relation.relation_status === 2) {

                }
            }
        }
    }
}

export const relationsSendRequest = async (p_from_id, p_to_id) => {
    const relation = await getHisRelation(p_from_id, p_to_id);
    if (!relation) {
        const userRelation = new UserRelation(p_from_id, p_to_id, 2);
        await insertRow('user_relations', userRelation);
        return { done: true, message: 'მოთხოვნა წარმატებით გაიგზავნა' };
    } else if (relation.relation_status === 2) {
        updateRow('user_relations', { relation_status: 1 }, { user_relation_id: relation.user_relation_id });
        const userRelation = new UserRelation(p_from_id, p_to_id, 1);
        await insertRow('user_relations', userRelation);
        return { done: true, message: 'თქვენ წარმატებით დამეგობრდით' };
    }

    return { done: false, message: 'შეიქმნა პრობლემა' };
}

export const relationsAcceptRequest = async (p_from_id, p_to_id) => {
    const relation = await getHisRelation(p_from_id, p_to_id);
    console.log(relation, 'reations');
    if (relation && relation.relation_status === 2) {
        updateRow('user_relations', { relation_status: 1 }, { user_relation_id: relation.user_relation_id });
        const userRelation = new UserRelation(p_from_id, p_to_id, 1);
        await insertRow('user_relations', userRelation);
        addUsersInConversation(p_from_id, p_to_id);
        return { done: true, message: 'თქვენ წარმატებით დამეგობრდით' };
    }
    return { done: false, message: 'მეგობრობის დათანხმება ვერ მოხერხდა' };
}

export const relationsDeclineRequest = async (p_from_id, p_to_id) => {
    const relation = await getHisRelation(p_from_id, p_to_id);
    if (relation && relation.relation_status === 2) {
        deleteRow('user_relations', { user_relation_id: relation.user_relation_id });
        return { done: true, message: 'თქვენ წარმატებით გააუქმეთ მეგობრობის მოთხოვნა' };
    }
    return { done: false, message: 'მეგობრობის გაუქმება ვერ მოხერხდა' };
}

export const relationsUnsendRequest = async (p_from_id, p_to_id) => {
    const relation = await getMyRelation(p_from_id, p_to_id);
    if (relation && relation.relation_status === 2) {
        deleteRow('user_relations', { user_relation_id: relation.user_relation_id });
        return { done: true, message: 'თქვენ წარმატებით გააუქმეთ მეგობრობის მოთხოვნა' };
    }
    return { done: false, message: 'მეგობრობის გაუქმება ვერ მოხერხდა' };
}

export const relationsBlockUser = async (p_from_id, p_to_id) => {
    const friendship = await userInFriendship(p_from_id, p_to_id);
    if (!friendship) {
        const myRelation = await getMyRelation(p_from_id, p_to_id);
        if (!myRelation) {
            const userRelation = new UserRelation(p_from_id, p_to_id, 3);
            await insertRow('user_relations', userRelation);
        } else {
            await updateRow('user_relations', { relation_type: 3 }, { user_relation_id: myRelation.user_relation_id });
        }
    } else {
        updateBlockUser(p_from_id, p_to_id);
    }
    return { done: true };
}

export const relationsUnBlockUser = async (p_from_id, p_to_id) => {
    const myRelation = await getMyRelation(p_from_id, p_to_id);
    if (myRelation && myRelation.relation_status === 3) {
        deleteRow('user_relations', { user_relation_id: myRelation.user_relation_id });
        return { done: true, message: 'თქვენ წარმატებით მოხსენით ბლოკი' };
    }
    return { done: false, message: 'ბლოკის მოხსნისას შეიქმნა პრობლემა' };
}

export const relationsUnfriend = async (p_from_id, p_to_id) => {
    const myRelation = await getMyRelation(p_from_id, p_to_id);
    const hisRelation = await getHisRelation(p_from_id, p_to_id);
    await deleteRow('user_relations', { user_relation_id: myRelation.user_relation_id });
    await deleteRow('user_relations', { user_relation_id: hisRelation.user_relation_id });
    return { done: true };
}

const addUsersInConversation = async (p_from_id, p_to_id) => {
    const exists = await checkIfConversationExists(p_from_id, p_to_id);
    if (!exists) {
        const conversation = new Conversation('', 1);
        const [qr] = await insertRow('conversations', conversation);
        const conversationId = qr.insertId;
        const userConversation1 = new UserConversation(p_from_id, conversationId);
        const userConversation2 = new UserConversation(p_to_id, conversationId);
        insertRow('user_conversations', userConversation1);
        insertRow('user_conversations', userConversation2);
        const initConversation = new InitConversation(p_from_id, p_to_id, conversationId);
        insertRow('init_conversation', initConversation);
    }
}

const checkIfConversationExists = async (p_from_id, p_to_id) => {
    const sql = `SELECT * FROM init_conversation where (from_id = ? and to_id = ?) OR (from_id = ? and to_id = ?)`;
    const userConversation = await getOne(sql, [p_from_id, p_to_id, p_to_id, p_from_id]);
    return userConversation;
}


const getMyRelation = async (p_from_id, p_to_id) => {
    const sql = `SELECT * FROM user_relations where from_id = ? and to_id = ?`;
    const relation = await getOne(sql, [p_from_id, p_to_id]);
    return relation;
}

const getHisRelation = async (p_from_id, p_to_id) => {
    const sql = `SELECT * FROM user_relations where from_id = ? and to_id = ?`;
    const relation = await getOne(sql, [p_to_id, p_from_id]);
    return relation;
}

const updateBlockUser = async (p_from_id, p_to_id) => {
    const myrelation = await getMyRelation(p_from_id, p_to_id);
    const user_relation_id = myrelation.user_relation_id;
    updateRow('user_relations', { relation_status: 3 }, { user_relation_id });
    const hisrelation = await getHisRelation(p_from_id, p_to_id);
    deleteRow('user_relations', { user_relation_id: hisrelation.user_relation_id });
}

const addBlockUser = async (p_from_id, p_to_id) => {
    const userRelation = new UserRelation(p_from_id, p_to_id, 3);
    await insertRow('user_relations', userRelation);
}

const deleteFriendship = async (p_from_id, p_to_id) => {
    const sql = `SELECT * FROM user_relations where (from_id = ? and to_id = ?) or (from_id = ? and to_id = ?)`;
    const relations = await getMany(sql, [p_from_id, p_to_id, p_to_id, p_from_id]);
    for (let i = 0; i < relations.length; i++) {
        console.log(relations[i].user_relation_id);
        await deleteRow('user_relations', { user_relation_id: relations[i].user_relation_id });
    }
}

const manageCoupleConversation = async (p_from_id, p_to_id) => {
    const conversation = await coupleConversation(p_from_id, p_to_id);
    if (!conversation) await addCoupleConversation(p_from_id, p_to_id);
}

const coupleConversation = async (p_from_id, p_to_id) => {
    const conversation = await getOne(`select distinct c.* from conversation as c
        left join user_conversation as uc on uc.conversationId = c.id
        where (uc.userId = ? or uc.userId = ?) and c.couple = ?;`, [p_from_id, p_to_id, 1]);
    if (!conversation) return null;
}

const addCoupleConversation = async (p_from_id, p_to_id) => {
    const conversation = new Conversation('', 1, 0);
    const [resultSet] = await insertRow('conversation', conversation);
    const conversationId = resultSet.insertId;
    const userConversation1 = new UserConversation(p_from_id, conversationId, 0);
    const userConversation2 = new UserConversation(p_to_id, conversationId, 0);
    await insertRow('user_conversation', userConversation1);
    await insertRow('user_conversation', userConversation2);
}

export const userInFriendship = async (p_from_id, p_to_id) => {
    if(p_from_id === p_to_id) {
        return false;
    }
    const sql = `SELECT * FROM user_relations where (from_id = ? and to_id = ?) OR (from_id = ? and to_id = ?)`;
    const relation = await getOne(sql, [p_from_id, p_to_id, p_to_id, p_from_id]);
    return relation;
}

export const getUserFriendIds = async (user_id) => {
    const sql = `    SELECT 
                     CASE
                        WHEN from_id = ? THEN to_id
                        WHEN to_id = ? THEN from_id
                     END AS user_id
                     FROM user_relations
                     WHERE (from_id = ? OR to_id = ?) 
                     AND relation_status = ?
                     AND (from_id != to_id); `;
    const relations = await getMany(sql, [user_id, user_id, user_id, user_id, 1]);
    const friendIds = [...new Set(relations.map(relation => relation.user_id))];
    return friendIds;

}
