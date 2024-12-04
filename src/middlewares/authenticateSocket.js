import jwt from 'jsonwebtoken';
import { getMany, SECRET_KEY } from '../utils/index.js';

export const authenticateSocket = (socket, next) => {
    const token = socket.handshake.query?.access_token;

    if (!token) {
        return next(new Error('ტოკენი ვერ მოიძებნა'));
    }

    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return next(new Error('ტოკენი ვერ მოიძებნა'));
        }

        const user = decoded.user;
        const user_id = user.user_id;
        const conversations = await getMany('select c.conversation_id from conversations c left join user_conversations uc ON uc.conversation_id = c.conversation_id WHERE uc.user_id = ?', [user_id]);
        const conversationIds = conversations.map(conversation => conversation.conversation_id);
        socket.conversationIds = conversationIds;
        socket.user = user;
        socket.userId = user_id;
        next(); // Proceed to the next middleware or handler
    });
};