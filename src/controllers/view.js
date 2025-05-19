import { getAccountBlocksView, getAccountContactsView, getAccountInfoView, getAccountRelationsView, getBlocksView, getFriendsView, getIndexView, getIngoingRequestsView, getIngoingUserRequestsView, getOutgoingRequestsView, getOutgoingUserRequestsView, getSharesView, getUserBlocksView, getUserFriendsView, getUserNameView, getUserSharesView } from "../handlers/view.js";

export const GetIndexView = async (req, res, next) => {
    const mode = req.mode;
    const { contacts, user_name, posts, groups } = await getIndexView(req.cookies);
    const pathname = 'index';
    console.log(contacts, 'contactrs')
    res.render('index', { contacts, pathname, user_name, posts, mode, groups });
}

export const GetLoginView = async (req, res, next) => {
    res.render('login');
}

export const GetVerifyEmailView = async (req, res, next) => {
    res.render('verify-email');
}

export const GetFriendsView = async (req, res, next) => {
    const { friends, contacts, user_name } = await getFriendsView(req.cookies);
    const pathname = 'friends';
    const mode = req.mode;
    res.render('friends', { friends, pathname, contacts, user_name, mode });
}

export const GetUserFriendsView = async (req, res, next) => {
    const user_name = req.params.userName;
    const { friends, user, contacts } = await getUserFriendsView(req.cookies, user_name);
    const pathname = 'friends';
    const mode = req.mode;
    res.render('user-friends', { friends, pathname, contacts, user_name, user, mode });
}

export const GetOutgoingRequestsView = async (req, res, next) => {
    const { requests, contacts, user_name } = await getOutgoingRequestsView(req.cookies);
    const pathname = 'outgoing-requests';
    const mode = req.mode;
    res.render('outgoing-requests', { requests, pathname, contacts, user_name, mode });
}

export const GetOutgoingUserRequestsView = async (req, res, next) => {
    const { requests, contacts, user_name, user } = await getOutgoingUserRequestsView(req.cookies);
    const pathname = 'outgoing-requests';
    const mode = req.mode;
    console.log(user);
    res.render('user-outgoing-requests', { user, requests, pathname, contacts, user_name, mode });
}

export const GetIngoingRequestsView = async (req, res, next) => {
    const { requests, contacts, user_name } = await getIngoingRequestsView(req.cookies);
    const pathname = 'ingoing-requests';
    console.log(requests, 'requests');
    const mode = req.mode;
    res.render('ingoing-requests', { requests, pathname, contacts, user_name, mode });
}

export const GetIngoingUserRequestsView = async (req, res, next) => {
    const { requests, contacts, user_name, user } = await getIngoingUserRequestsView(req.cookies);
    const pathname = 'ingoing-requests';
    console.log(requests, 'requests');
    const mode = req.mode;
    res.render('user-ingoing-requests', { user, requests, pathname, contacts, user_name, mode });
}

export const GetBlocksView = async (req, res, next) => {
    const { blocks, contacts, user_name } = await getBlocksView(req.cookies);
    const pathname = 'blocks';
    console.log(blocks, 'blocks')
    const mode = req.mode;
    res.render('blocks', { blocks, pathname, contacts, user_name, mode });
}

export const GetUserBlocksView = async (req, res, next) => {
    const { blocks, contacts, user_name, user } = await getUserBlocksView(req.cookies);
    const pathname = 'blocks';
    console.log(blocks, 'blocks')
    const mode = req.mode;
    res.render('user-blocks', { user, blocks, pathname, contacts, user_name, mode });
}

export const GetUserNameView = async (req, res, next) => {
    const user_name = req.params.userName;
    const { user, posts, contacts } = await getUserNameView(req.cookies, user_name);
    console.log(posts);
    const mode = req.mode;
    res.render('user-page', { user, posts, contacts, mode, user_name });
}

export const GetSharesView = async (req, res, next) => {
    const { posts, contacts, user_name } = await getSharesView(req.cookies);
    const pathname = 'shares';
    const mode = req.mode;
    console.log(posts, 'posts');
    res.render('shares', { pathname, contacts, user_name, posts, mode });
}

export const GetUserSharesView = async (req, res, next) => {
    const user_name = req.params.userName;
    const { posts, contacts, user } = await getUserSharesView(req.cookies, user_name);
    const pathname = 'shares';
    const mode = req.mode;
    console.log(posts, 'posts');
    console.log(user);
    res.render('user-shares', { pathname, contacts, posts, mode, user, user_name });
}

export const GetAccountView = async (req, res, next) => {
    res.redirect('/account/info');
}

export const GetAccountInfoView = async (req, res, next) => {
    const { sendRequests, receiveRequests, contacts, blocks } = await getAccountInfoView(req.cookies);
    res.render('account', { sendRequests, receiveRequests, contacts, blocks });
}

export const GetAccountAboutView = async (req, res, next) => {
    const showAbout = true;
    res.render('account', { showAbout });
}

export const GetAccountPasswordView = async (req, res, next) => {
    const showPassword = true;
    res.render('account', { showPassword });
}

export const GetAccountContactsView = async (req, res, next) => {
    const contacts = await getAccountContactsView(req.cookies);
    const showContacts = true;
    const JSFile = 'contacts';
    res.render('account', { contacts, showContacts, JSFile })
}

export const GetAccountRelationsView = async (req, res, next) => {
    const { sendRequests, receiveRequests } = await getAccountRelationsView(req.cookies);
    const showRelations = true;
    const JSFile = 'relations';
    res.render('account', { sendRequests, receiveRequests, showRelations, JSFile });
}

export const GetAccountBlocksView = async (req, res, next) => {
    const blocks = await getAccountBlocksView(req.cookies);
    const showBlocks = true;
    const JSFile = 'blocks';
    res.render('account', { blocks, showBlocks, JSFile })
}