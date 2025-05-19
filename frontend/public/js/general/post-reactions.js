import httpService from "../services/http.js";
export class PostReactions {
    constructor(type, post_id) {
        this.httpService = httpService;
        this.type = type;
        this.post_id = post_id;
        this.loaded = false;
        this.close$ = document.createElement('div');
        this.element = this._createElement();
        this.closeButton = this.element.querySelector('#closeButton');
        this.modalBody = this.element.querySelector('.modal-body');
        this.modalContent = this.element.querySelector('.modal-content');
        this.spinnerContainer = this.element.querySelector('.spinner-container');
        this.listeners();
        this.fetchData();
    }

    listeners() {
        this.closeButton.addEventListener('click', () => {
            this.detach();
        });

    }

    async fetchData() {
        this.loaded = false;
        this.handleLoadingState();
        this.userReactions = await this.httpService.getPostReactions(this.post_id);
        this.likedUsers = this.userReactions.likes;
        this.unlikedUsers = this.userReactions.unlikes;
        this.loaded = true;
        this.handleLoadingState();
        this.renderUsers();
    }

    renderUsers() {
        const template = this.likedUsers.map(user => `
              <a class="contacts-list-item list-hoverable" href="/users/${user.user_name}">
                 <img src="/public/images/users/${user.image}" class="contacts-list-item-media">
                 <span class="contacts-list-item-content">${user.full_name}</span>
              </a>
             `).join('');
        this.modalContent.innerHTML = template;
    }

    handleLoadingState() {
        if (this.loaded) {
            this.spinnerContainer.style.display = 'none';
            this.modalContent.style.display = 'flex';
        } else {
            this.spinnerContainer.style.display = 'block';
            this.modalContent.style.display = 'none';
        }
    }

    _createElement() {
        const template = `
              <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-desc">
                        <h3>პოსტის მოწონებები</h3>
                        <button class="button button-icon" id="closeButton">
                           <i class="material-symbols-outlined smaller-icon">close</i>
                        </button>
                    </div>    
                </div>
                <div class="modal-body">
                   <div class="modal-content"></div>
                   <div class="spinner-container">
                     <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                        <circle class="spinner-path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30">
                        </circle>
                     </svg>
                   </div>
                </div>

              </div>
            `
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    detach() {
        this.close$.dispatchEvent(new CustomEvent('closed'));
    }
}