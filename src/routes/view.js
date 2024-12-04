import { Router } from "express";
import { getMode } from "../middlewares/getMode.js";
import { authenticatePage } from "../middlewares/authenticatePage.js";
import { GetAccountAboutView, GetAccountBlocksView, GetAccountContactsView, GetAccountInfoView, GetAccountPasswordView, GetAccountRelationsView, GetAccountView, GetBlocksView, GetFriendsView, GetIndexView, GetIngoingRequestsView, GetLoginView, GetOutgoingRequestsView, GetUserNameView, GetVerifyEmailView } from "../controllers/view.js";

const router = Router();

router.get('/', getMode, authenticatePage, GetIndexView);

router.get('/login', getMode, GetLoginView);

router.get('/verify-email', getMode, GetVerifyEmailView);

router.get('/friends', getMode, authenticatePage, GetFriendsView);

router.get('/outgoing-requests', getMode, authenticatePage, GetOutgoingRequestsView);

router.get('/ingoing-requests', getMode, authenticatePage, GetIngoingRequestsView);

router.get('/blocks', getMode, authenticatePage, GetBlocksView);

router.get('/user/:userName', getMode, authenticatePage, GetUserNameView);

router.get('/account', GetAccountView);

router.get('/account/info', getMode, authenticatePage, GetAccountInfoView);

router.get('/account/about', getMode, authenticatePage, GetAccountAboutView);

router.get('/account/password', getMode, authenticatePage, GetAccountPasswordView);

router.get('/account/contacts', getMode, authenticatePage, GetAccountContactsView);

router.get('/account/relations', getMode, authenticatePage, GetAccountRelationsView);

router.get('/account/blocks', getMode, authenticatePage, GetAccountBlocksView);

export default router;