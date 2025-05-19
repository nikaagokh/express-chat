import httpService from "../services/http.js";
export class IndexReactions {
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
      this.close$.dispatchEvent(new CustomEvent('closed'));
    })
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
    let template;
    if (this.type === 1) {
      template = this.likedUsers.map(user => `
          <a class="contacts-list-item list-hoverable" href="/users/${user.user_name}">
             <img src="/public/images/users/${user.image}" class="contacts-list-item-media">
             <span class="contacts-list-item-content">${user.full_name}</span>
          </a>
         `).join('');
    } else {
      template = this.unlikedUsers.map(user => `
           <a class="contacts-list-item list-hoverable" href="/users/${user.user_name}">
             <img src="/public/images/users/${user.image}" class="contacts-list-item-media">
             <span class="contacts-list-item-content">${user.full_name}</span>
          </a>
         `).join('');
    };
    this.modalContent.innerHTML = template;
  }

  handleLoadingState() {

  }

  _createElement() {
    const template = `
              <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-desc">
                        <div style="display:flex;">
                          <button class="button button-link ${this.type === 1 ? 'button-link-active' : ''}" id="likeReactions">
                            <i class="material-symbols-outlined smaller-icon">thumb_up</i>
                            მოწონებები
                          </button>
                          <button class="button button-link ${this.type === 0 ? 'button-link-active' : ''}" id="unlikeReactions">
                            <i class="material-symbols-outlined smaller-icon">thumb_down</i>
                            დაწუნებები
                          </button>
                        </div>
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
}