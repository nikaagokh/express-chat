export class SendRequestsMenu {
    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
        console.log(this.userId);
        console.log(this.userName);
        this.notifier = document.createElement('div');
        this.unsend$ = document.createElement('div');
        this.element = this._createElement();
        this.userUnsend = this.element.querySelector('#userUnsend');
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
            <button class="button menu-append-item" id="userUnsend">
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
        this.userUnsend.addEventListener('click', () => {
            this.unsend$.dispatchEvent(new CustomEvent('unsended'));
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