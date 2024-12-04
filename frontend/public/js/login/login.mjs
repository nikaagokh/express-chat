import toastService from '../services/toast.js';
import authService from '../services/auth.js';
import { initListeners } from '../listeners/index.js';

class Login {
    constructor() {
        this.toastService = toastService;
        this.authService = authService;
        this.handleEnter = this.handleEnter.bind(this);
        this.submitButton = document.querySelector('#submitButton');
        this.emailInput = document.querySelector('#emailInput');
        this.passwordInput = document.querySelector('#passwordInput');
        this.listeners();
    }

    listeners() {
        this.submitButton.addEventListener("click", () => {
            const email = this.emailInput.value;
            const password = this.passwordInput.value;
            this.checkIfEmpty(email, password);
            this.loginUser(email, password);
        })

        document.addEventListener('keydown', this.handleEnter);
    }

    checkIfEmpty(email, password) {
        if (email === '' || password === '') {
            this.toastService.showToast('აუცილებელია შეავსოთ ყველა ველი');
            return;
        }
    }

    handleEnter(ev) {
        if(ev.key === 'Enter') {
            const email = this.emailInput.value;
            const password = this.passwordInput.value;
            this.checkIfEmpty(email, password);
            this.loginUser(email, password);
        }
    }

    loginUser(email, password) {
        this.authService.login(email, password);
    }
}

function init() {
    new Login();
    initListeners();
}

document.addEventListener('DOMContentLoaded', init);