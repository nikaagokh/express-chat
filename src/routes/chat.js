import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { ChatCommunicationReceiver, ChatConversations, ChatDocsConversation, ChatDownloadFile, ChatFiles, ChatInitConversation, ChatMedia, ChatMessageConversation, ChatMoreMessages, ChatSeen, ChatSendFile, ChatSendMessage, ChatUnseenMessages, ChatUserConversation } from "../controllers/chat.js";
import { uploadChat } from "../utils/index.js";

const router = Router();

router.post('/basic', authenticateJWT, ChatSendMessage);

router.post('/file', authenticateJWT, uploadChat.array('file'), ChatSendFile);

router.get('/download', authenticateJWT, ChatDownloadFile);

router.get('/conversations', authenticateJWT, ChatConversations);

router.get('/media', authenticateJWT, ChatMedia);

router.get('/docs', authenticateJWT, ChatDocsConversation);

router.get('/files', authenticateJWT, ChatFiles);

router.get('/init', authenticateJWT, ChatInitConversation);

router.get('/init/:conversationId', authenticateJWT, ChatInitConversation);

router.get('/communication/:receiverId', authenticateJWT, ChatCommunicationReceiver);

router.get('/messages/:conversationId', authenticateJWT, ChatMessageConversation);

router.get('/more/messages', authenticateJWT, ChatMoreMessages);

router.get('/seen', authenticateJWT, ChatSeen);

router.get('/unseen/messages', authenticateJWT, ChatUnseenMessages);

router.get('/all/conversations', authenticateJWT, ChatConversations);

router.get('/users/:conversationId', authenticateJWT, ChatUserConversation);

export default router;