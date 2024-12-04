import { Router } from "express";
import { authenticateJWT } from "../middlewares/authenticateJWT.js";
import { RelationsAcceptRequest, RelationsAddRelation, RelationsBlockUser, RelationsBlockUsers, RelationsContactUsers, RelationsDeclineRequest, RelationsReceiveRequests, RelationsSendRequest, RelationsSendRequests, RelationsUnBlockUser, RelationsUnfriend, RelationsUnsendRequest } from "../controllers/relations.js";

const router = Router();

router.get('/send-requests', authenticateJWT, RelationsSendRequests);

router.get('/receive-requests', authenticateJWT, RelationsReceiveRequests);

router.get('/contact-users', authenticateJWT, RelationsContactUsers);

router.get('/blocked-users', authenticateJWT, RelationsBlockUsers);

router.get('/upsert-relation', authenticateJWT, RelationsAddRelation);

router.post('/send-request', authenticateJWT, RelationsSendRequest);

router.post('/accept-request', authenticateJWT, RelationsAcceptRequest);

router.post('/decline-request', authenticateJWT, RelationsDeclineRequest);

router.post('/unsend-request', authenticateJWT, RelationsUnsendRequest);

router.post('/block-user', authenticateJWT, RelationsBlockUser);

router.post('/unblock-user', authenticateJWT, RelationsUnBlockUser);

router.post('/unfriend', authenticateJWT, RelationsUnfriend);


export default router;