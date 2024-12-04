export class User {
    constructor(first_name, last_name, user_name, email, password, image = null, gl_user_role_id = 1) {
        this.first_name = first_name;
        this.last_name = last_name;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
        this.image = image;
        this.gl_user_role_id = gl_user_role_id;
    }
}