import toastService from "./toast.js";
import authService from "./auth.js";
import cookieService from "./cookie.js";
class HttpService {
    constructor() {
        this.cookieService = cookieService;
        this.toastService = toastService;
        this.authService = authService;
        this.host = 'localhost:3005';
        /*
        this.authService.authStateChange.subscribe(x => {
            this.authed = x;
        })
        this.authService.isAuthenticated().then(x => this.authed = x);
        */
    }

    async downloadPostFile(filename) {
        const token = this.cookieService.getCookie();
        console.log(filename);
        window.open(`http://${this.host}/files/posts/${filename}?access_token=${token}`);
    }

    async downloadChatFile(filename) {
        const token = this.cookieService.getCookie();
        window.open(`http://${this.host}/files/chats/${filename}?access_token=${token}`);
    }

    /* start chat */

    async createGroupChat(groupName, userIds) {
        const object = this.generateOptions({ groupName, userIds });
        return fetch(`http://${this.host}/api/chat/create/group`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async getChatMessages(conversationId, userId) {
        return fetch(`http://${this.host}/api/chat/init?conversation_id=${conversationId}&user_id=${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async addBasicMessage(content, conversation_id) {
        const object = this.generateOptions({ content, conversation_id });
        return fetch(`http://${this.host}/api/chat/basic`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async addFileMessage(content, conversation_id, files) {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ content, conversation_id }));
        files.forEach(file => {
            formData.append('file', file);
        });

        return fetch(`http://${this.host}/api/chat/file`, {
            method: "POST",
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error Ocurred');
            }
            return response.json();
        })
    }
    /* end chat */

    /* start users */

    async unBlockUser(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/unblock-user`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }


    async blockUser(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/block-user`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async declineRequest(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/decline-request`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async acceptRequest(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/accept-request`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async sendRequest(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/send-request`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async unSendRequest(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/unsend-request`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async unfriendUser(user_id) {
        const options = this.generateOptions({ user_id });
        return fetch(`http://${this.host}/api/relations/unfriend`, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async getFriendUsers() {
        return fetch(`http://${this.host}/api/relations/contact-users`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async searchUsers(word, offset = 1) {
        return fetch(`http://${this.host}/api/users/searchby?word=${word}&offset=${offset}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async filterUsers(word, offset = 1) {
        return fetch(`http://${this.host}/api/users/filterby?word=${word}&offset=${offset}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async uploadProfile(files) {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('file', file);
        });

        return fetch(`http://${this.host}/api/users/profile`, {
            method: "POST",
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error Ocurred');
            }
            return response.json();
        })
    }
    /* end users */

    /* start post */

    async getPostLikes(post_id) {
        return fetch(`http://${this.host}/api/users/likes/${post_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async getPostUnLikes(post_id) {
        return fetch(`http://${this.host}/api/users/unlikes/${post_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async getPostComments(post_id) {
        return fetch(`http://${this.host}/api/post/comments/${post_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async getPostReactions(post_id) {
        return fetch(`http://${this.host}/api/users/reactions/${post_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async sharePost(post_id) {
        const object = this.generateOptions({ post_id });
        return fetch(`http://${this.host}/api/post/share`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async manageLike(post_id) {
        const object = this.generateOptions({ post_id });
        return fetch(`http://${this.host}/api/post/manage-like`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async manageUnLike(post_id) {
        const object = this.generateOptions({ post_id });
        return fetch(`http://${this.host}/api/post/manage-unlike`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async addComment(post_id, content) {
        const object = this.generateOptions({ post_id, content });
        return fetch(`http://${this.host}/api/post/comment`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async addBasicPost(content) {
        const object = this.generateOptions({ content });
        return fetch(`http://${this.host}/api/post/basic`, object)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async addFilePost(content, files) {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ content }));
        files.forEach(file => {
            formData.append('file', file);
        });

        return fetch(`http://${this.host}/api/post/file`, {
            method: "POST",
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error Ocurred');
            }
            return response.json();
        })
    }

    /* end post */

    /* chat */



    async initChat(conversationId) {
        return fetch(`http://localhost:3005/api/chat/init/${conversationId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            })
    }
    /*
    async initChat() {
        return fetch('http://localhost:3005/api/chat/init')
        .then(res => {
            if(!res.ok) {
                throw new Error('Error Ocurred');
            }
            return res.json();
        });
    }
    */

    async sendFile(filesInf, conversationId) {
        const formData = new FormData();
        formData.append('data', JSON.stringify({ conversationId }));
        filesInf.forEach((file, i) => {
            formData.append('file', file);
        })
        return fetch('http://localhost:3005/api/chat/send/file', {
            method: "POST",
            body: formData
        }).then(res => {
            if (!res.ok) {
                throw new Error('Error Ocurred');
            }
            return res.json();
        })
    }

    async sendMessage(content, conversationId, slug) {

        const sendObject = { content, conversationId, slug };
        return fetch('http://localhost:3005/api/chat/send/message', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendObject)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('');
                }
                return response.json();
            })
    }

    async getMoreMessages(offset, conversationId) {
        return fetch(`http://localhost:3005/api/chat/more/messages?offset=${offset}&conversationId=${conversationId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });
    }

    async getMediaFiles(conversationId, filename, offset = 1) {
        return fetch(`http://localhost:3005/api/chat/media?fileName=${filename}&conversationId=${conversationId}&offset=${offset}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            })
    }

    async getDocsFiles(conversationId) {
        return fetch(`http://localhost:3005/api/chat/docs?conversationId=${conversationId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            })
    }

    async getFileMessages(filename, conversationId, offset) {
        return fetch(`http://localhost:3005/api/chat/files?offset=${offset}&conversationId=${conversationId}&filename=${filename}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });
    }

    async getDownloadedFile(fileName, file_type = 1) {
        return fetch(`http://${this.host}/api/chat/download?fileName=${fileName}&file_type=${file_type}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error ocurred');
                }
                return res.blob();
            })
    }

    async addSeenToConversation(conversationId) {
        return fetch(`http://localhost:3005/api/chat/seen`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ conversationId })
        }).then(res => {
            if (!res.ok) {
                throw new Error('Error Ocurred');
            }
            return res.json();
        })
    }

    async getUnseenMessages() {
        return fetch(`http://localhost:3005/api/chat/unseen/messages`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });
    }

    async getChatUsers(conversationId) {
        console.log(conversationId)
        return fetch(`http://localhost:3005/api/chat/users/${conversationId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });

    }

    async getCommunication(userId) {
        console.log(userId)
        return fetch(`http://localhost:3005/api/chat/communication/${userId}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });
    }

    async manageFriendShip(toId) {

        return fetch(`http://localhost:3005/api/chat/friendship`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ toId })
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Error Ocurred');
                }
                return res.json();
            });
    }

    async changeFriendshipStatus(userId, status) {
        const object = { userId, status };
        return fetch('http://localhost:3005/api/chat/status-friendship', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Error Ocurred');
            }
            return res.json();
        });
    }

    async changeBlockStatus(userId, status) {
        const object = { userId, status };
        return fetch('http://localhost:3005/api/chat/status-block', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        }).then(res => {
            if (!res.ok) {
                throw new Error('Error Ocurred');
            }
            return res.json();
        });
    }

    async addGroup(userIds, adminId, groupName) {
        const object = { userIds, adminId, groupName };
        return fetch('http://localhost:3005/api/chat/create/group', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(object)
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error Ocurred');
            }
            return response.json();
        })
    }

    generateOptions(object) {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object)
        };
        return options;
    }
}

const httpService = new HttpService();
export default httpService;