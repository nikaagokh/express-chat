class ToastService {
    constructor() {
        this.toastTimeoutId = null;
        this.actionStateTimeoutId = null;
        this.toastContainer = document.querySelector(".toast-container");
    }

    showToast(message) {
        this.closeToast();
        const template = `
        <div class="toast-wrapper">
          <div class="toast-label">
           ${message}
          </div>
          <button class="button toast-action">
            <i class="material-symbols-outlined" style="color: white;">close</i>
          </button>
        </div>`;
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        const actionButton = tempContainer.querySelector(".toast-action");
        actionButton.addEventListener("click", () => {
            this.closeToast();
        });
        this.toastContainer.appendChild(tempContainer.firstElementChild);
        this.toastTimeoutId = setTimeout(() => {
            this.closeToast();
        }, 3000);
    }

    closeToast() {
        while(this.toastContainer.firstChild) {
            this.toastContainer.removeChild(this.toastContainer.firstChild)
        }
        clearTimeout(this.toastTimeoutId);
    }

    createSuccessToast(message) {
        this.closeToast();
        const template = `
        <div class="toast-welldone slide-down toast-wrapper">
          <div class="toast-message">
            <button class="button button-icon">
              <i class="material-symbols-outlined success-icon">done</i>
            </button>
            <div class="toast-label toast-welldone-content">
                ${message}
            </div>
            <button class="button button-icon toast-action">
               <i class="material-symbols-outlined success-icon icon-sm">close</i>
            </button>
          </div>
        </div>
        `

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        const actionButton = tempContainer.querySelector(".toast-action");
        actionButton.addEventListener("click", () => {
            this.closeToast();
        })

        this.toastContainer.appendChild(tempContainer.firstElementChild);

        this.toastTimeoutId = setTimeout(() => {
            this.closeToast();
        }, 3000);
    }

    createDangerToast(message) {
        this.closeToast();
        const template = `
        <div class="toast-warning slide-down toast-wrapper">
          <div class="toast-message">
            <button class="button button-icon">
              <i class="material-symbols-outlined warning-icon">warning</i>
            </button>
            <div class="toast-label toast-warning-content">
                ${message}
            </div>
            <button class="button button-icon toast-action">
               <i class="material-symbols-outlined warning-icon icon-sm">close</i>
            </button>
          </div>
        </div>
        `

        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        const actionButton = tempContainer.querySelector(".toast-action");
        actionButton.addEventListener("click", () => {
            this.closeToast();
        })

        this.toastContainer.appendChild(tempContainer.firstElementChild);

        this.toastTimeoutId = setTimeout(() => {
            this.closeToast();
        }, 3000);
    }
}
const toastService = new ToastService();
export default toastService;