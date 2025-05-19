import eventEmitter from "../utils/event-emitter.js";
import { chatCommunicationReceiver, chatConversations, chatCreateGroup, chatDocsConversation, chatFiles, chatGroups, chatInitConversation, chatInitGroup, chatMedia, chatMessageConversation, chatMoreMessages, chatSeen, chatSendFile, chatSendMessage, chatUserConversation, checkUnseenMessages } from "../handlers/chat.js";
import path from 'path';
import { __dirname } from '../../dirname.js';
import e from "express";


export const ChatSendMessage = async (req, res, next) => {
    const userId = req.userId;
    const content = req.body.content;
    const conversationId = req.body.conversation_id;
    console.log(userId);
    console.log(content);
    console.log(conversationId);
    const response = await chatSendMessage(userId, content, conversationId);
    eventEmitter.emit('message.send', response);
    res.json({ message: response.message });
}

export const ChatSendFile = async (req, res, next) => {
    const userId = req.userId;
    const files = req.files;
    const dataObject = JSON.parse(req.body.data);
    const content = dataObject.content;
    const conversationId = Number(dataObject.conversation_id);
    const response = await chatSendFile(userId, content, conversationId, files);
    eventEmitter.emit('file.send', response);
    res.json(response);
}

export const ChatDownloadFile = async (req, res, next) => {
    const filename = req.query.fileName;
    const fileType = Number(req.query.fileType);
    const type = fileType === 1 ? 'chats' : 'posts';
    const filePath = path.join(__dirname, 'files', type, filename);
    res.download(filePath)
}

export const ChatConversations = async (req, res, next) => {
    const userId = req.userId;
    const response = await chatConversations(userId);
    res.json(response);
}

export const ChatMedia = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.query.conversationId);
    const fileName = req.query.fileName;
    const offset = Number(req.query.offset);
    const response = await chatMedia(userId, conversationId, fileName, offset);
    res.json(response);
}

export const ChatDocsConversation = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.query.conversationId);
    const response = await chatDocsConversation(userId, conversationId);
    res.json(response);
}

export const ChatFiles = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.query.conversationId);
    const filename = req.query.filename;
    const response = await chatFiles(userId, conversationId, filename);
    res.json(response);
}

export const ChatInitConversation = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = req.query.conversation_id;
    const contactId = req.query.user_id;
    const response = await chatInitConversation(userId, conversationId, contactId);
    console.log(response, 'responsea');
    res.json(response);
}

export const ChatInitGroup = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = req.params.conversationId;
    const response = await chatInitGroup(userId, conversationId);
    res.json(response);
}

export const ChatCommunicationReceiver = async (req, res, next) => {
    const senderId = req.userId;
    const receiverId = Number(req.params.receiverId);
    const response = await chatCommunicationReceiver(senderId, receiverId);
    res.json(response);
}

export const ChatMessageConversation = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.params.conversationId);
    const response = await chatMessageConversation(userId, conversationId);
    res.json(response);
}

export const ChatMoreMessages = async (req, res, next) => {
    const userId = req.userId;
    const offset = Number(req.query.offset);
    const conversationId = Number(req.query.conversationId);
    const response = await chatMoreMessages(userId, conversationId, offset);
    res.json(response);
}

export const ChatSeen = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.body.conversationId);
    const response = await chatSeen(userId, conversationId);
    res.json(response);
}

export const ChatUnseenMessages = async (req, res, next) => {
    const userId = req.userId;
    const response = await checkUnseenMessages(userId);
    res.json(response);
}

export const ChatAllConversations = async (req, res, next) => {
    const userId = req.userId;
    const response = await chatConversations(userId);
    res.json(response);
}

export const ChatUserConversation = async (req, res, next) => {
    const userId = req.userId;
    const conversationId = Number(req.params.conversationId);
    const response = await chatUserConversation(userId, conversationId);
    res.json(response);
}

export const ChatGroups = async (req, res, next) => {
    const userId = req.userId;
    const response = await chatGroups(userId);
    res.json(response);
}

export const ChatCreateGroup = async (req, res, next) => {
    const adminId = req.userId;
    const userIds = req.body.userIds;
    const groupName = req.body.groupName;
    const response = await chatCreateGroup(adminId, groupName, userIds);
    res.json(response);
}