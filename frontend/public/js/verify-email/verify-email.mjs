import { initListeners } from "../listeners/index.js";
import authService from "../services/auth.js";
import toastService from "../services/toast.js";
export class Verify {
    constructor() {
        this.authService = authService;
        this.toastService = toastService;
        this.renew$ = document.createElement('div');
        this.loaded = false;
        this.error = false;
        this.emailInput = document.querySelector('#emailInput');
        this.otpInput = document.querySelector('#otpInput');
        this.errorMessage = document.querySelector('.error-message');
        this.submitOtpButton = document.querySelector('#submitOtpButton');
        this.submitButton = document.querySelector('#submitButton');
        this.listeners();
    }


    listeners() {
        this.emailInput.addEventListener('blur', () => {
            if (this.emailInput.value === '') {
                this.emailInput.classList.add('border-error');
              
                this.error = true;
            } else if (this.emailInput.value.length < 9) {
                this.emailInput.classList.add('border-error');
  
                this.error = true;
            } else {
                this.emailInput.classList.remove('border-error');
                this.error = false;
            }
        })

        this.emailInput.addEventListener('input', () => {
            if (this.emailInput.value !== '') {
                this.emailInput.classList.remove('border-error');
                this.errorMessage.style.display = 'none';
                this.error = false;
            } else {
                this.emailInput.classList.add('border-error');
                this.errorMessage.style.display = 'block';
                this.error = true;
            }
        })

        this.sendOtpButton.addEventListener("click", () => {
            const email = this.emailInput.value;
            if(!this.error && email.length > 0) {
                this.authService.sendOtp(email).then(otp => {
                    console.log(otp);
                    this.toastService.createSuccessToast('მითითებულ ნომერზე გამოიგზავნა ერთჯერადი კოდი');
                }).catch(e => {
                    this.toastService.createDangerToast('მსგავსი ნომერი უკვე არსებობს');
                })
                
            }
        })

        this.sendButton.addEventListener('click', () => {
            const phone = this.emailInput.value;
            const otp = this.otpInput.value;
            if(phone.length > 0 && otp.length > 0) {
                this.authService.verifyOtp(phone, otp)
                .then(_ => {
                    this.toastService.createSuccessToast('თქვენი ნომერი ავთენტურია, გთხოვთ შეავსოთ დამატებითი ველები რეგისტრაციისთვის');
                    setTimeout(() => {
                        location.href = '/register';
                    }, 500);
                }).catch(e => {
                    this.toastService.createDangerToast('ნომრის ავთენტიფიკაციის დროს შეიქმნა პრობლემა, გთხოვთ მოგვიანებით სცადოთ');
                })
            }
        })
    }

}

function init() {
    new Verify();
    initListeners();
}

window.addEventListener('DOMContentLoaded', init);