export class UserConversation {
    constructor(user_id, conversation_id, seen = 0) {
        this.user_id = user_id;
        this.conversation_id = conversation_id;
        this.seen = seen;
    }
}