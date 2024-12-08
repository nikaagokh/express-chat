import axios from 'axios';
import { serializeCookies } from "../utils/index.js";

export const getIndexView = async (cookies) => {
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    const postsResponse = await axios.get('http://localhost:3005/api/post/all-posts', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const posts = postsResponse.data;
    return { contacts, user_name, posts };
}

export const getFriendsView = async (cookies) => {
    const friendsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const friends = friendsResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    return { friends, contacts, user_name };
}

export const getUserFriendsView = async (cookies, userName) => {
    const friendsResponse = await axios.get(`http://localhost:3005/api/users/contact-users/${userName}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const friends = friendsResponse.data;
    console.log(friends);
    const userResponse = await axios.get(`http://localhost:3005/api/users/about/${userName}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const user = userResponse.data;
    console.log(user);

    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    console.log(contacts);
    return { user, friends, contacts }

}

export const getOutgoingRequestsView = async (cookies) => {
    const requestsResponse = await axios.get('http://localhost:3005/api/relations/send-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const requests = requestsResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    return { requests, contacts, user_name };
}

export const getOutgoingUserRequestsView = async (cookies) => {
    const requestsResponse = await axios.get('http://localhost:3005/api/relations/send-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const requests = requestsResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    const userResponse = await axios.get(`http://localhost:3005/api/users/about/${user_name}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const user = userResponse.data;
    return { requests, contacts, user_name, user };
}

export const getIngoingRequestsView = async (cookies) => {
    const requestsResponse = await axios.get('http://localhost:3005/api/relations/receive-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const requests = requestsResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    return { requests, contacts, user_name, user };
}

export const getIngoingUserRequestsView = async (cookies) => {
    const requestsResponse = await axios.get('http://localhost:3005/api/relations/receive-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const requests = requestsResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    const userResponse = await axios.get(`http://localhost:3005/api/users/about/${user_name}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const user = userResponse.data;
    return { requests, contacts, user_name, user };
}

export const getBlocksView = async (cookies) => {
    const blocksResponse = await axios.get('http://localhost:3005/api/relations/blocked-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const blocks = blocksResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    return { blocks, contacts, user_name };
}

export const getUserBlocksView = async (cookies) => {
    const blocksResponse = await axios.get('http://localhost:3005/api/relations/blocked-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const blocks = blocksResponse.data;
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    const userResponse = await axios.get(`http://localhost:3005/api/users/about/${user_name}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const user = userResponse.data;
    return { blocks, contacts, user_name, user };
}

export const getUserNameView = async (cookies, user_name) => {
    const userResponse = await axios.get(`http://localhost:3005/api/users/about/${user_name}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const user = userResponse.data;
    const postsResponse = await axios.get(`http://localhost:3005/api/users/posts/${user_name}`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const posts = postsResponse.data;
    const contactsResponse = await axios.get(`http://localhost:3005/api/relations/contact-users`, {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    return { user, posts, contacts };
}

export const getSharesView = async (cookies) => {
    const postsResponse = await axios.get('http://localhost:3005/api/post/shared-posts', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const posts = postsResponse.data;
    console.log(posts, 'posts')
    const contactsResponse = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = contactsResponse.data;
    const userNameResponse = await axios.get('http://localhost:3005/api/users/userName', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const { user_name } = userNameResponse.data;
    return { posts, contacts, user_name };
}

export const getAccountInfoView = async (cookies) => {
    const requestPromises = [
        axios.get('http://localhost:3005/api/relations/send-requests', {
            headers: {
                Cookie: serializeCookies(cookies)
            }
        }),
        axios.get('http://localhost:3005/api/relations/receive-requests', {
            headers: {
                Cookie: serializeCookies(cookies)
            }
        }),
        axios.get('http://localhost:3005/api/relations/contact-users', {
            headers: {
                Cookie: serializeCookies(cookies)
            }
        }),
        axios.get('http://localhost:3005/api/relations/blocked-users', {
            headers: {
                Cookie: serializeCookies(cookies)
            }
        }),
    ];
    const [sendRequestsResponse, receiveRequestsResponse, contactsResponse, blocksResponse] = await Promise.all(requestPromises);
    const sendRequests = sendRequestsResponse.data;
    const receiveRequests = receiveRequestsResponse.data;
    const contacts = contactsResponse.data;
    const blocks = blocksResponse.data;
    return { sendRequests, receiveRequests, contacts, blocks };
}

export const getAccountContactsView = async (cookies) => {
    const response = await axios.get('http://localhost:3005/api/relations/contact-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const contacts = response.data;
    return contacts;
}

export const getAccountRelationsView = async (cookies) => {
    const sendRequestsResponse = await axios.get('http://localhost:3005/api/relations/send-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const receiveRequestsResponse = await axios.get('http://localhost:3005/api/relations/receive-requests', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });

    const sendRequests = sendRequestsResponse.data;
    const receiveRequests = receiveRequestsResponse.data;
    return { sendRequests, receiveRequests };
}

export const getAccountBlocksView = async (cookies) => {
    const blocksResponse = await axios.get('http://localhost:3005/api/relations/blocked-users', {
        headers: {
            Cookie: serializeCookies(cookies)
        }
    });
    const blocks = blocksResponse.data;
    return blocks;
}