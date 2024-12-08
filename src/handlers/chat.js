import { getOne, getMany, insertRow, updateRow } from "../utils/index.js";
import { throwError } from "../utils/index.js";
import { pool } from "../database/connect.js";
import { Message } from '../model/messages.model.js';
import { getFormatedDate, getFormatedTime } from "../utils/helper.js";
import { MessageMedia } from "../model/message-media.model.js";
import gatewaySessionManager from "../gateway/sessions.js";

export const chatSendMessage = async (userId, content, conversationId,) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError({ message: 'მომხმარებელი ამ ჩათში არ მოიძებნა', slug }, 400);
    const message = await createMessage(content, conversationId, userId);
    if (!message) throwError('მესიჯი ვერ გაიგზავნა', 400);
    const prevMessages = await getMany('select * from messages order by created_at desc limit 2');
    message.time = getFormatedTime(message.created_at);
    message.sent = true;
    message.last = true;
    message.first = isFirstMessage(message, prevMessages);
    conversation.last_message_id = message.message_id;
    updateRow('conversations', { last_message_id: message.message_id }, { conversation_id: conversation.conversation_id });
    seenStateOnSendMessage(userId, conversationId);
    return { message, conversation };
}

export const chatSendFile = async (userId, content, conversationId, files) => {
    if (content.length > 0) {
        const message = new Message(content, 1, userId, conversationId);
        await insertRow('messages', message);
    }
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
        const message = new Message('', 2, userId, conversationId);
        const [qr] = await insertRow('messages', message);
        const message_id = qr.insertId;
        const messageMedia = new MessageMedia(message_id, media_type, media_name, media_size);
        await insertRow('message_media', messageMedia);
    }
    return {a:1};
    return { message: getMessage, conversationId: conversationId };
}

export const chatConversations = async (user_id) => {
    const conversationsSQL = `SELECT * from `
}

/*
export const chatConversations = async (userId) => {
    const conversationsSQL = `select c.id as conversationId, c.couple, c.name, uc.seen, i.path  from conversation as c
                              left join user_conversation as uc on c.id = uc.conversationId
                              left join images as i on c.id = i.conversationId
                              where uc.userId = ? and c.couple = 0;
                             `;
    const conversations = await getMany(conversationsSQL, [userId]);
    const coupleConversationsSQL = ` SELECT DISTINCT u.id, CONCAT(u.firstName, ' ', u.lastName) AS name, u.img
                                     FROM friendships f
                                     JOIN user u ON (f.fromId = u.id OR f.toId = u.id)
                                     WHERE (f.fromId = ? OR f.toId = ?)
                                     AND f.status = 1
                                     AND u.id != ?;
    `;
    const coupleConversations = await getMany(coupleConversationsSQL, [userId, userId, userId]);
    const coupleIds = coupleConversations.map(user => user.id);
    coupleIds.push(userId);
    const blockedByUsers = await getBlockedByUsers(userId);
    const blockedByIds = blockedByUsers.map(user => user.id);
    const blockedUsers = await getBlockedUsers(userId);
    const blockedIds = blockedUsers.map(user => user.id);
    const uniqueArray = mergeUniqueArrays(coupleIds, blockedByIds, blockedIds);
    const couplePlaceholders = uniqueArray.map(() => '?').join(', ');
    const uncoupledConversationsSQL = ` select u.id as userId, concat(u.firstName, ' ', u.lastName) as name from user as u
                                        where u.id not in (${couplePlaceholders});`
    const uncoupledConversations = await getMany(uncoupledConversationsSQL, uniqueArray);

    const fullConversations = generateConversations(conversations, coupleConversations, uncoupledConversations);
    return fullConversations;
}

*/

export const chatMedia = async (userId, conversationId, fileName = '', offset) => {
    const limit = offset * 30;
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const sql = `SELECT m.message_id, m.content, m.message_type, m.created_at, mm.media_type, mm.media_name, mm.media_size
                 FROM messages m
                 LEFT JOIN message_media mm ON mm.message_id = m.message_id
                 WHERE mm.media_type IN (1,2) AND m.conversation_id = ? AND m.message_type = 2
                 ORDER BY m.created_at DESC
                 LIMIT ${limit}`;
    const messages = await getMany(sql, [conversationId]);
                
    let sortedMessages;
    if (fileName !== '') {
        sortedMessages = sortMessagesByPath(messages, fileName);
    } else {
        sortedMessages = messages;
    }
    return sortedMessages;
}

export const chatDocsConversation = async (userId, conversationId) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const sql = `SELECT m.message_id, m.content, m.message_type, m.created_at, mm.media_type, mm.media_name, mm.media_size
                 FROM messages m
                 LEFT JOIN message_media mm ON mm.message_id = m.message_id
                 WHERE mm.media_type = 3 AND m.conversation_id = ? AND m.message_type = 2
                 ORDER BY m.created_at DESC
                 LIMIT 30`;
    const messages = await getMany(sql, [conversationId]);
    return messages;
}

export const chatFiles = async (userId, conversationId, filename) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const sql = `
          select m.id, f.path, f.extension, f.size, f.mime
          from message as m 
          inner join files as f on m.id = f.messageId
          order by f.created desc
          ;
        `;
    const messages = await getMany(sql);
    messages.forEach(message => {
        if (message.mime) {
            message.mime = message.mime.split('/')[0]
        }
    })
    let sortedMessages;
    if (filename !== '') {
        sortedMessages = sortMessagesByPath(messages, filename);
    } else {
        sortedMessages = messages;
    }
    return sortedMessages;
}

export const chatInitConversation = async (user_id, conversation_id, contact_id) => {
    const messagesDate = await getMessagesFromConversation(user_id, conversation_id);
    const online = getStatusByConversationId(conversation_id);
    return { conversation_id, messagesDate, online };
}

export const chatCommunicationReceiver = async (senderId, receiverId) => {
    const { messagesArr, conversationId } = await getCoupleConversation(senderId, receiverId);
    if (!messagesArr) return emptyMessagesWithDefaultDate(conversationId);
    const sql = `select m.id, m.content, m.created, m.userId, m.conversationId, m.type, u.firstName, u.lastName, 
       CONCAT(
        '[',
        GROUP_CONCAT(
             CONCAT(
                '{"path": "', f.path, '", ',
                '"extension": "', f.extension, '", ',
                '"size": ', f.size, ', ', 
                '"mime": "', f.mime, '", ',
                '"name":"', f.fileName, '"}'
              )
            ),
        ']'
    ) AS files
                 from message as m 
                 left join conversation as c on m.conversationId = c.id
                 left join user as u on m.userId = u.id
                 left join files as f on m.id = f.messageId
                 where m.conversationId = ?
                 group by m.id
                 order by m.created desc
                 limit 30;
                 `;
    const messages = await getMany(sql, [conversationId]);
    messages.forEach(message => {
        if (message.hasOwnProperty('files')) {
            message.files = JSON.parse(message.files);
        }
    });
    const online = getStatusByConversationId(conversationId);
    return { conversationId, messages, online };
}

export const chatMessageConversation = async (userId, conversationId) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const sql = `select m.id, m.content, m.created, m.userId, m.conversationId, m.type, u.firstName, u.lastName, 
       CONCAT(
        '[',
       GROUP_CONCAT(
             CONCAT(
                '{"path": "', f.path, '", ',
                '"extension": "', f.extension, '", ',
                '"size": ', f.size, ', ', 
                '"mime": "', f.mime, '", ',
                '"name":"', f.fileName, '"}'
              )
            ),
        ']'
    ) AS files
                 from message as m 
                 left join conversation as c on m.conversationId = c.id
                 left join user as u on m.userId = u.id
                 left join files as f on m.id = f.messageId
                 where m.conversationId = ?
                 group by m.id
                 order by m.created desc
                 limit 30;
                 `;
    const messages = await getMany(sql, [conversationId]);
    messages.forEach(message => {
        if (message.hasOwnProperty('files')) {
            message.files = JSON.parse(message.files);
        }
    })

    const messagesByDate = generateMessages(messages, userId);
    return messagesByDate;
}

export const chatMoreMessages = async (userId, conversationId, offset) => {
    const offsetNumber = offset === 1 ? 30 : offset * 30;
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი მსგავს ჩათში არ მოიძენბა', 400);
    const sql = `select m.id, m.content, m.created, m.userId, m.conversationId, m.type, u.firstName, u.lastName, 
       CONCAT(
        '[',
        GROUP_CONCAT(
             CONCAT(
                '{"path": "', f.path, '", ',
                '"extension": "', f.extension, '", ',
                '"size": ', f.size, ', ', 
                '"mime": "', f.mime, '", ',
                '"name":"', f.fileName, '"}'
              )
            ),
        ']'
    ) AS files
                 from message as m 
                 left join conversation as c on m.conversationId = c.id
                 left join user as u on m.userId = u.id
                 left join files as f on m.id = f.messageId
                 where m.conversationId = ?
                 group by m.id
                 order by m.created desc
                 limit ?;
                 `;
    const messages = await getMany(sql, [conversationId, offsetNumber]);
    messages.forEach(message => {
        if (message.hasOwnProperty('files')) {
            message.files = JSON.parse(message.files);
        }
    })

    //const messages = await getMany(sql, [conversationId, offsetNumber]);
    const messagesByDate = generateMessages(messages, userId);
    return messagesByDate;
}

export const chatSeen = async (userId, conversationId) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    await tryAddSeen(userId, conversationId);
    return { message: 'მესიჯი დასინულია' };
}

export const checkUnseenMessages = async (userId) => {
    const conversation = await getOne('select * from user_conversation where userId = ?', [userId]);
    if (!conversation) throwError('მომხმარებელი ჩათში არ მოიძებნა', 400);
    return conversation.seen;
}



export const getMessagesFromConversation = async (user_id, conversation_id) => {
    const conversation = await userInconversationExists(user_id, conversation_id);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const sql = `select m.message_id, m.content, m.message_type, m.created_at, u.user_id, 
       CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.image, u.user_name,
       IFNULL(medias.medias_json, '[]') AS medias
from messages m
left join users u ON u.user_id = m.user_id
left join (
    SELECT 
            mm.message_id,
            CONCAT('[', GROUP_CONCAT(
                CONCAT('{"media_type":', mm.media_type, '',
                       ',"media_name":"', mm.media_name, '"',
                       ',"media_size":', mm.media_size, '}')
                ORDER BY mm.media_name ASC SEPARATOR ','), ']') AS medias_json
        FROM 
            message_media mm
        GROUP BY 
            mm.message_id
) AS medias ON medias.message_id = m.message_id
WHERE m.conversation_id = ?
ORDER BY m.created_at desc 
LIMIT 30;`
    const messages = await getMany(sql, [conversation_id]);
    messages.forEach(message => {
        if (message.hasOwnProperty('medias')) {
            message.medias = JSON.parse(message.medias);
        }
    })
    const messagesByDate = generateMessages(messages, user_id);
    return messagesByDate;

}

export const getBlockedUsers = async (userId) => {
    const sql = `SELECT f.toId as id,  concat(u.firstName, ' ', u.lastName) AS name, f.status, f.updated
                 FROM friendships f
                 JOIN user u ON f.toId = u.id
                 WHERE f.fromId = ? and f.status = 3;`;
    const users = await getMany(sql, [userId]);
    users.forEach(user => {
        user.date = getFormatedDate(user.updated);
        user.time = getFormatedTime(user.updated);
    })
    return users;
}

export const chatUserConversation = async (userId, conversationId) => {
    const conversation = await userInconversationExists(userId, conversationId);
    if (!conversation) throwError('მომხმარებელი ამ ჩათში არ მოიძებნა', 400);
    const blockedUsers = await getBlockedUsers(userId);
    const blockedIds = blockedUsers.map(user => user.id);
    const blockedByUsers = await getBlockedByUsers(userId);
    const blockedByIds = blockedByUsers.map(user => user.id);
    const uniqueArray = mergeUniqueArrays(blockedByIds, blockedIds);
    const uniquePlaceholders = uniqueArray.join(', ');
    const sql = `select u.id, u.firstName, u.lastName, u.role from user as u
                     left join user_conversation as uc on u.id = uc.userId
                     left join friendships as f on f.fromId = u.id   
                     where ${uniqueArray.length > 0 ? `u.id not in (${uniquePlaceholders}) and` : ''} u.id <> ? and uc.conversationId = ?
                     `;
    const users = await getMany(sql, [userId, conversationId]);
    return users;
}

const tryAddSeen = async (userId, conversationId) => {
    const userConversation = await getOne('select * from user_conversation where conversationId = ? and userId = ?', [conversationId, userId]);
    userConversation.seen = 1;
    await updateRow('user_conversation', userConversation, { id: userConversation.id });
}

const generateMessages = (messages, userId) => {
    const reversed = messages.reverse();
    const messagesByDate = {};
    if (messages.length === 0) {
        const messageObject = {
            date: 'დღეს',
            messages: []
        };
        return [messageObject];
    } else {
        reversed.forEach((message, index) => {
            let date;
            const messageDate = message.created_at;
            const dateUtc = new Date();
            const now = new Date(dateUtc.getTime() - dateUtc.getTimezoneOffset() * 60 * 1000);
            const yesterdayMin = getRangeMin(now);
            const yesterdayMax = getRangeMax(now);
            const lastWeek = getRangeWeek(now);
            date = getMessageDate(messageDate, yesterdayMin, yesterdayMax, lastWeek);

            message = isMessageSent(message, userId);
            message = isMessageLast(message, reversed, index);
            message = isMessageFirst(message, reversed, index);
            message.time = getFormatedTime(messageDate);
            if (!messagesByDate[date]) {
                messagesByDate[date] = [];
                message.first = true;
            }
            messagesByDate[date].push(message);
        })
    }
    const result = [];
    for (const date of Object.keys(messagesByDate)) {
        result.push({ date, messages: messagesByDate[date] });
    }
    return result;
}

const emptyMessagesWithDefaultDate = (conversationId) => {
    let messages = [{
        date: 'დღეს',
        messages: []
    }];
    const online = getStatusByConversationId(conversationId);
    return { messages, conversationId, online }
}

const getCoupleConversation = async (senderId, receiverId) => {
    const conversation = await getOne(`SELECT c.id AS conversation_id, u.id AS user_id, u.firstName AS firstName
                                       FROM conversation c
                                       JOIN user_conversation uc1 ON c.id = uc1.conversationId
                                       JOIN user_conversation uc2 ON uc1.conversationId = uc2.conversationId
                                       JOIN user u ON uc2.userId = u.id
                                       WHERE uc1.userId = ? AND uc2.userId = ?
                                       and c.couple = ?;`, [senderId, receiverId, 1]);
    if (!conversation) throwError('მომხმარებლებს ჩათი არ აქვთ', 400);
    const conversationId = conversation.id;
    const messages = await getMany('select * from message where conversationId = ?', [conversationId]);
    return { messages, conversationId };
}

export const getStatusByConversationId = (conversationId) => {
    const conversationName = `conv-${conversationId}`;
    const sockets = gatewaySessionManager.getRoom(conversationName);
    if (sockets.size === 1 || sockets.size === 0) return false;
    else return true;

}

const sortMessagesByPath = (messages, filename) => {
    return messages.sort((a, b) => {
        if (a.path === filename) return -1;
        if (b.path === filename) return 1;
        return 0;
    })
}

const generateConversations = (conversations, coupleConversations, uncoupledConversations) => {
    coupleConversations.forEach(conversation => {
        if (!conversation.img) {
            conversation.img = 'user.png';
        }
    })

    const fullConversations = [
        {
            name: 'კონტაქტები',
            chats: coupleConversations
        },
        {
            name: 'ჯგუფები',
            chats: conversations
        }
    ];
    return fullConversations;
}

const mergeUniqueArrays = (...arrays) => {
    const uniqueSet = new Set();
    arrays.forEach(arr => {
        arr.forEach(item => {
            uniqueSet.add(item);
        });
    });

    const uniqueArray = Array.from(uniqueSet);
    return uniqueArray;
}

const getBlockedByUsers = async (userId) => {
    const sql = `SELECT f.fromId as id,  concat(u.firstName, ' ', u.lastName) AS name, f.status, f.updated
                 FROM friendships f
                 JOIN user u ON f.toId = u.id
                 WHERE f.toId = ? and f.status = 3;`;
    const users = await getMany(sql, [userId]);
    return users;
}

const getFileMessage = async (messageId) => {
    const [message] = (await pool.query(`
        select m.id, m.content, m.created, m.userId, m.conversationId, m.type, u.firstName, u.lastName,
        CONCAT(
          '[',
           GROUP_CONCAT(
             CONCAT(
                '{"path": "', f.path, '", ',
                '"extension": "', f.extension, '", ',
                '"size": ', f.size, ', ', 
                '"mime": "', f.mime, '", ',
                '"name":"', f.fileName, '"}'
              )
            ),
         ']'
         ) AS files
        from message as m
        inner join files as f on m.id = f.messageId
        left join user as u on u.id = m.userId
        where m.id = ?
        group by m.id;
      `, [messageId]))[0];
    message.files = JSON.parse(message.files);
    message.files.forEach(file => {
        file.size = Math.ceil(file.size / 1024);
    })
    return message;
}

const addFiles = async (files, messageId) => {
    for (const file of files) {
        const { path, size, filename, mimetype, originalname } = file;
        const extension = getFileExtension(path);
        const uFile = new File(filename, messageId, extension, size, mimetype, originalname);
        await insertRow('files', uFile);
    }
}

const getFileExtension = (filePath) => {
    return path.extname(filePath).substring(1);
}

const seenStateOnSendMessage = async (userId, conversationId) => {
    const userConversations = await getMany('select * from user_conversations where conversation_id = ?', [conversationId]);
    userConversations.forEach(userConversation => {
        if (userId === userConversation.user_id) {
            userConversation.seen = 1;
        } else {
            userConversation.seen = 0;
        }
        updateRow('user_conversations', userConversation, { user_conversation_id: userConversation.user_conversation_id });
    });
}


const createMessage = async (content, conversationId, userId) => {
    const messageModel = new Message(content, 1, userId, conversationId);
    const [qr] = await insertRow('messages', messageModel);
    const messageId = qr.insertId;
    const message = await getOne(`SELECT * FROM messages where message_id = ?`, [messageId]);
    return message;
}

const userInconversationExists = async (user_id, conversation_id) => {
    const response = await getOne(`select count(*) as count from user_conversations where user_id = ? and conversation_id = ?`, [user_id, conversation_id]);
    const exist = response.count > 0 ? true : false;
    if (exist) {
        return await getOne(`select * from conversations where conversation_id = ?`, [conversation_id]);
    } else {
        return await Promise.resolve(null);
    }
}

const isFirstMessage = (message, prevMessages) => {
    if (prevMessages.length > 1) {
        let prevMessage = prevMessages[1];
        if (message.user_id !== prevMessage.user_id && message.sent === false) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

const getMessageDate = (messageDate, yesterDayMin, yesterdayMax, lastWeek) => {
    let date;
    if (messageDate >= lastWeek && messageDate < yesterDayMin) {
        const dateString = messageDate.toISOString().substring(0, 10);
        const dateObj = new Date(dateString);
        date = getDayName(dateObj.getDay())
    } else if (messageDate >= yesterDayMin && messageDate < yesterdayMax) {
        date = 'გუშინ'
    } else if (messageDate >= yesterdayMax) {
        date = 'დღეს'
    } else {
        date = getFormatedDateWithYear(messageDate);
    }

    return date;
}

const getDayName = (dayIndex) => {
    const days = ['კვირა', 'ორშაბათი', 'სამშაბათი', 'ოთხშაბათი', 'ხუთშაბათი', 'პარასკევი', 'შაბათი'];
    return days[dayIndex];
}

const getFormatedDateWithYear = (date) => {
    const components = date.toISOString().substring(0, 10).split("-");
    return components[2] + "." + components[1] + "." + components[0]
}

const getRangeMin = (now) => {
    const yesterDayMin = new Date(now);
    yesterDayMin.setDate(now.getDate() - 1);
    yesterDayMin.setUTCHours(0);
    yesterDayMin.setUTCMinutes(0);
    yesterDayMin.setUTCSeconds(0);
    yesterDayMin.setUTCMilliseconds(0);
    return yesterDayMin
}

const getRangeMax = (now) => {
    const yesterdayMax = new Date(now);
    yesterdayMax.setDate(now.getDate());
    yesterdayMax.setUTCHours(0);
    yesterdayMax.setUTCMinutes(0);
    yesterdayMax.setUTCSeconds(0);
    yesterdayMax.setUTCMilliseconds(0);
    return yesterdayMax;
}

const getRangeWeek = (now) => {
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 6);
    lastWeek.setUTCHours(0);
    lastWeek.setUTCMinutes(0);
    lastWeek.setUTCSeconds(0);
    lastWeek.setUTCMilliseconds(0);
    return lastWeek;
}

const isMessageSent = (message, userId) => {
    if (message.user_id === userId) {
        message.sent = true;
    } else {
        message.sent = false;
    }
    return message;
}

const isMessageLast = (message, reversed, index) => {
    if (message.user_id !== reversed[index + 1]?.user_id) {
        message.last = true;
    } else {
        message.last = false;
    }
    return message;
}

const isMessageFirst = (message, reversed, index) => {

    if (message.user_id !== reversed[index - 1]?.user_id && message.sent === false) {
        message.first = true;
    } else {
        message.first = false;
    }
    return message;
}

