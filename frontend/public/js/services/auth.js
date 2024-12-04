import toastService from "./toast.js";
import cookieService from "./cookie.js";
import spinnerService from './spinner.js';
class AuthService {
    constructor() {
        this.cookieService = cookieService;
        this.toastService = toastService;
        this.spinnerService = spinnerService;
        this.accessToken = 'access_token';
        this.host = 'localhost:3005';
        this.adminURL = 'http://localhost:3001';
    }

    async register(first_name, last_name, user_name, password, file) {
        const jsonObject = { first_name, last_name, user_name, password };
        const formData = new FormData();
        formData.append('data', JSON.stringify(jsonObject));
        formData.append('file', file);
        return fetch(`http://${this.host}/api/auth/register`, {
            method: "POST",
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error('Error Ocurred');
            }
            return response.json();
        })
    }

    async login(email, password) {
        const object = { email, password };
        const jsonObject = this.generateOptions(object);
        return fetch(`http://${this.host}/api/auth/login`, jsonObject)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
            .then(_ => {
                this.toastService.createSuccessToast('თქვენ წარმატებით გაიარეთ აუტორიზაცია');
                setTimeout(() => {
                    location.href = '/';
                }, 1000);
            })
            .catch(_ => {
                this.toastService.createDangerToast('მომხმარებლის მონაცემები არასწორია!');
            })
    }

    async changePassword(old_password, new_password) {
        const object = { old_password, new_password };
        const jsonObject = this.generateOptions(object);
        return fetch(`http://${this.host}/api/auth/change-password`, jsonObject)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async sendOtp(email) {
        const object = { email };
        const jsonObject = this.generateOptions(object);
        return fetch(`http://${this.host}/api/auth/register/send-otp`, jsonObject)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async verifyOtp(email, otp) {
        const object = { email, otp };
        const jsonObject = this.generateOptions(object);
        return fetch(`http://${this.host}/api/auth/register/verify-otp`, jsonObject)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            })
    }

    async checkAuth() {
        return fetch(`http://${this.host}/api/auth/isAuthed`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error Ocurred');
                }
                return response.json();
            }).catch(_ => {
                return false;
            })
    }

    async logout() {
        this.cookieService.deleteCookie(this.accessToken);
        this.toastService.createSuccessToast('თქვენ წარმატებით გახვედით სისტემიდან');
        setTimeout(() => {
            location.href = '/';
        }, 1000);
    }

    isAuthed() {
        const token = cookieService.getCookie(this.accessToken);
        return token && !this.tokenExpired(token);
    }

    decodeJwt(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invlid JWT');
        }

        let payload = parts[1];
        payload = payload.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(payload);
        return JSON.parse(decoded);
    }

    tokenExpired(token) {
        try {
            const expiry = this.decodeJwt(token).exp;
            return (Math.floor((new Date).getTime() / 1000)) >= expiry;
        } catch (err) {
            return true;
        }
    }

    isAdmin() {
        const token = this.cookieService.getCookie(this.accessToken);
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const user = JSON.parse(jsonPayload).user;
            return user.gl_user_role_id === 1 || user.gl_user_role_id === 2;
        } else {
            return false;
        }
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

    generatePUTOptions(object) {
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(object)
        };
        return options;
    }
}

const authService = new AuthService();
export default authService;

