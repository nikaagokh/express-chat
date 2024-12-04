export class Message {
    constructor(content='', message_type, user_id, conversation_id) {
        this.content = content;
        this.message_type = message_type;
        this.user_id = user_id;
        this.conversation_id = conversation_id;
    } 
    
    addTime(time) {
        this.time = time;
    }
}