import httpService from "../services/http.js";

export class SearchBox {
    constructor() {
        this.word = '';
        this.loaded = false;
        this.httpService = httpService;
        this.products = [];
        this.offset = 0;
        this.close$ = document.createElement('div');
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.parent = document.querySelector('.header-content');
        this.element = this._createElement();
        this.listContainer = this.element.querySelector('.header-search-box-list');
        this.spinnerContainer = this.element.querySelector('.header-search-spinner');
        this.attach();
        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 500);
    }

    _createElement() {
        const template = `
    <div class="header-search-box">
    <div class="header-search-box-list"></div>
    <div class="header-search-spinner">
      <div class="header__input-centered">
        <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
          <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
        </svg>
      </div>
    </div>
      </div>
    `
        const tempContainer = document.createElement("div");
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    /**
     * @param {string} word
     */
    set changeInput(word) {
        if (this.word !== word) {
            this.word = word;
            this.searchByWord();

        }
    }

    async searchByWord() {
        this.loaded = false;
        this.handleLoadingState();
        this.users = await this.httpService.searchUsers(this.word);
        this.loaded = true;
        this.handleLoadingState();
        this.renderList();
    }

    handleLoadingState() {
        if (!this.loaded) {
            this.listContainer.style.display = 'none';
            this.spinnerContainer.style.display = 'block';
        } else {
            this.listContainer.style.display = 'block';
            this.spinnerContainer.style.display = 'none';
        }
    }

    renderList() {
        this.listContainer.innerHTML = '';
        let template;
        if (this.users.length > 0) {
            template = this.users.map(user => `
                 <a class="contacts-list-item list-hoverable" href="/users/${user.user_name}">
                    <i class="material-symbols-outlined list-item-avatar">account_circle</i>
                   <span class="contacts-list-item-content">${user.full_name}</h4></span>
                 </a>
                `).join('');
        } else {
            template = ` <div class="empty-list-wrapper">
                            <img src="/public/images/empty.webp" width="150" height="150">
                            <div class="empty-search-suggestion">
                               <h3>მსგავსი მომხმარებელი ვერ მოიძებნა ! </h3>
                            </div>
                         </div>`;
        }
        this.listContainer.innerHTML = template;

    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.element === el ||
                   this.parent === el;
        });
        if(!inside) {
            this.detach();
        }
    }

    attach() {
        this.parent.appendChild(this.element);
    }

    detach() {
        if (this.element) {
            this.element.remove();
            this.close$.dispatchEvent(new CustomEvent('closed'));
        }
    }
}