import { Router } from "express";
import { getMode } from "../middlewares/getMode.js";
import { authenticatePage } from "../middlewares/authenticatePage.js";
import { GetAccountAboutView, GetAccountBlocksView, GetAccountContactsView, GetAccountInfoView, GetAccountPasswordView, GetAccountRelationsView, GetAccountView, GetBlocksView, GetFriendsView, GetIndexView, GetIngoingRequestsView, GetIngoingUserRequestsView, GetLoginView, GetOutgoingRequestsView, GetOutgoingUserRequestsView, GetSharesView, GetUserBlocksView, GetUserFriendsView, GetUserNameView, GetUserSharesView, GetVerifyEmailView } from "../controllers/view.js";

const router = Router();

router.get('/', getMode, authenticatePage, GetIndexView);

router.get('/login', getMode, GetLoginView);

router.get('/verify-email', getMode, GetVerifyEmailView);

router.get('/friends', getMode, authenticatePage, GetFriendsView);

router.get('/friends/:userName', getMode, authenticatePage, GetUserFriendsView);

router.get('/outgoing-requests', getMode, authenticatePage, GetOutgoingRequestsView);

router.get('/outgoing-requests/:userName', getMode, authenticatePage, GetOutgoingUserRequestsView);

router.get('/ingoing-requests', getMode, authenticatePage, GetIngoingRequestsView);

router.get('/ingoing-requests/:userName', getMode, authenticatePage, GetIngoingUserRequestsView);

router.get('/blocks', getMode, authenticatePage, GetBlocksView);

router.get('/blocks/:userName', getMode, authenticatePage, GetUserBlocksView);

router.get('/users/:userName', getMode, authenticatePage, GetUserNameView);

router.get('/shares', getMode, authenticatePage, GetSharesView);

router.get('/shares/:userName', getMode, authenticatePage, GetUserSharesView);

router.get('/account', GetAccountView);

router.get('/account/info', getMode, authenticatePage, GetAccountInfoView);

router.get('/account/about', getMode, authenticatePage, GetAccountAboutView);

router.get('/account/password', getMode, authenticatePage, GetAccountPasswordView);

router.get('/account/contacts', getMode, authenticatePage, GetAccountContactsView);

router.get('/account/relations', getMode, authenticatePage, GetAccountRelationsView);

router.get('/account/blocks', getMode, authenticatePage, GetAccountBlocksView);

export default router;