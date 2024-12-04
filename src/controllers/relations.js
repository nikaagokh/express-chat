import { relationsAcceptRequest, relationsAddRelation, relationsBlockUser, relationsBlockUsers, relationsContactUsers, relationsDeclineRequest, relationsReceiveRequests, relationsSendRequest, relationsSendRequests, relationsUnBlockUser, relationsUnfriend, relationsUnsendRequest } from "../handlers/relations.js";

export const RelationsSendRequests = async (req, res, next) => {
    const userId = req.userId;
    const response = await relationsSendRequests(userId);
    res.json(response);
}

export const RelationsReceiveRequests = async (req, res, next) => {
    const userId = req.userId;
    const response = await relationsReceiveRequests(userId);
    res.json(response);
}

export const RelationsContactUsers = async (req, res, next) => {
    const userId = req.userId;
    const response = await relationsContactUsers(userId);
    console.log(response);
    res.json(response);
}

export const RelationsBlockUsers = async (req, res, next) => {
    const userId = req.userId;
    const response = await relationsBlockUsers(userId);
    res.json(response);
}

export const RelationsAddRelation = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.query.user_id);
    const relationStatus = Number(req.query.relation_status);
    /*
    const toId = Number(req.body.user_id);
    const relationStatus = Number(req.body.relation_status);
    */
    const response = await relationsAddRelation(fromId, toId, relationStatus);
    res.json(response);

}

export const RelationsSendRequest = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsSendRequest(fromId, toId);
    res.json(response);
}

export const RelationsAcceptRequest = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsAcceptRequest(fromId, toId);
    res.json(response);
}

export const RelationsDeclineRequest = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsDeclineRequest(fromId, toId);
    res.json(response);
}


export const RelationsUnsendRequest = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsUnsendRequest(fromId, toId);
    res.json(response);
}


export const RelationsBlockUser = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsBlockUser(fromId, toId);
    res.json(response);
}

export const RelationsUnBlockUser = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsUnBlockUser(fromId, toId);
    res.json(response);
}

export const RelationsUnfriend = async (req, res, next) => {
    const fromId = req.userId;
    const toId = Number(req.body.user_id);
    const response = await relationsUnfriend(fromId, toId);
    res.json(response);
}