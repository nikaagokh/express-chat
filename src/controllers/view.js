import { getAccountBlocksView, getAccountContactsView, getAccountInfoView, getAccountRelationsView, getBlocksView, getFriendsView, getIndexView, getIngoingRequestsView, getOutgoingRequestsView, getUserNameView } from "../handlers/view.js";

export const GetIndexView = async (req, res, next) => {
    const { contacts,  userName, posts } = await getIndexView(req.cookies);
    const pathname = 'index';
    console.log(contacts, 'cont');
    res.render('index', { contacts, pathname, userName, posts });
}

export const GetLoginView = async (req, res, next) => {
    res.render('login');
}

export const GetVerifyEmailView = async (req, res, next) => {
    res.render('verify-email');
}

export const GetFriendsView = async (req, res, next) => {
    const { friends, contacts, userName } = await getFriendsView(req.cookies);
    const pathname = 'friends';
    res.render('friends', { friends, pathname, contacts, userName });
}

export const GetOutgoingRequestsView = async (req, res, next) => {
    const { requests, contacts, userName } = await getOutgoingRequestsView(req.cookies);
    const pathname = 'outgoing-requests';
    console.log(requests, 'requests');
    res.render('outgoing-requests', { requests, pathname, contacts, userName });
}

export const GetIngoingRequestsView = async (req, res, next) => {
    const { requests, contacts, userName } = await getIngoingRequestsView(req.cookies);
    const pathname = 'ingoing-requests';
    console.log(requests, 'requests');
    res.render('ingoing-requests', { requests, pathname, contacts, userName });
}

export const GetBlocksView = async (req, res, next) => {
    const { blocks, contacts, userName } = await getBlocksView(req.cookies);
    const pathname = 'blocks';
    console.log(blocks, 'blocks')
    res.render('blocks', { blocks, pathname, contacts, userName });
}

export const GetUserNameView = async (req, res, next) => {
    const { about, shares } = await getUserNameView(req.cookies);
    res.render('user-page', {about, shares});
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