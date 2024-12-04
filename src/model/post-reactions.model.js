export class PostReaction {
    constructor(reaction_type, post_id, user_id) {
        this.reaction_type = reaction_type;
        this.post_id = post_id;
        this.user_id = user_id;
    }
}