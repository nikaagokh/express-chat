export class InitConversation {
    constructor(from_id, to_id, conversation_id = null) {
        this.from_id = from_id;
        this.to_id = to_id;
        this.conversation_id = conversation_id;
    }
}