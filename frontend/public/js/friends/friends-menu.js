export class FriendsMenu {
    constructor(userId, userName) {
        this.userId = userId;
        this.userName = userName;
        console.log(this.userId);
        console.log(this.userName);
        this.notifier = document.createElement('div');
        this.unfriend$ = document.createElement('div');
        this.block$ = document.createElement('div');
        this.element = this._createElement();
        this.userUnfriend = this.element.querySelector('#userUnfriend');
        this.userBlock = this.element.querySelector('#userBlock');
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
            <button class="button menu-append-item" id="userUnfriend">
                <i class="material-symbols-outlined settings-icon">person_remove</i>
                <span>წაშლა</span>
            </button>
             <button class="button menu-append-item" id="userBlock">
                <i class="material-symbols-outlined settings-icon">block</i>
                <span>დაბლოკვა</span>
            </button>
          </div>
        `
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }
    
    listeners() {
        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 0);
        this.userUnfriend.addEventListener('click', () => {
            this.unfriend$.dispatchEvent(new CustomEvent('unfriended'));
        });
        this.userBlock.addEventListener('click', () => {
            this.block$.dispatchEvent(new CustomEvent('blocked'));
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