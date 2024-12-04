export class ReceiveRequestsMenu {
    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
        this.notifier = document.createElement('div');
        this.accept$ = document.createElement('div');
        this.decline$ = document.createElement('div');
        this.element = this._createElement();
        this.requestDecline = this.element.querySelector('#requestDecline');
        this.requestAccept = this.element.querySelector('#requestAccept');
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.listeners();
    }
    
    _createElement() {
        const template = `
          <div class="menu-append">
            <a class="button menu-append-item" href="/users/${this.userName}">
               <i class="material-symbols-outlined settings-icon">manage_accounts</i>
                <span>დეტალურად</span>
            </a>
            <button class="button menu-append-item" id="requestAccept">
                <i class="material-symbols-outlined settings-icon">check</i>
                <span>დათანხმება</span>
            </button>
            <button class="button menu-append-item" id="requestDecline">
                <i class="material-symbols-outlined settings-icon">delete</i>
                <span>წაშლა</span>
            </button>
          </div>
        `
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }
    
    listeners() {
        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 0);
        this.requestDecline.addEventListener('click', () => {
            this.decline$.dispatchEvent(new CustomEvent('declined'));
        })
        this.requestAccept.addEventListener('click', () => {
            this.accept$.dispatchEvent(new CustomEvent('accepted'));
        })
    }
    
    handleOutsideClick(ev) {
        console.log(ev.composedPath())
        const inside = ev.composedPath().some(el => {
            return this.element === el;
        });
        if (!inside) {
            this.detach();
        }
    }
    
    detach() {
        document.removeEventListener("click", this.handleOutsideClick);
        this.notifier.dispatchEvent(new CustomEvent("detach"));
    }
}