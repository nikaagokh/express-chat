export class Conversation {
    constructor(title, conversation_type, last_message_id = null, admin_id = null, image = 'group.png') {
        this.title = title;
        this.conversation_type = conversation_type;
        this.last_message_id = last_message_id;
        this.admin_id = admin_id;
        this.image = image;
    }
}