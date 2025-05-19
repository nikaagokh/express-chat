import httpService from "../services/http.js";
import { getDate } from "../utils/shared.js";
export class PostComments {
    constructor(post_id) {
        this.httpService = httpService;
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
        this.comments = await this.httpService.getPostComments(this.post_id);
        console.log(this.comments);
        this.loaded = true;
        this.handleLoadingState();
        this.renderComments();
    }

    renderComments() {
        const template = this.comments.map(comment => `
            <div class="list-item">
               <img class="list-item-avatar" src="/files/users/${comment.image}">
               <span class="list-item-content">
                  <div class="flexing">
                  <a class="list-item-user-title" href="/users/${comment.user_name}">~ ${comment.full_name}</a>
                  <div class="list-item-date">${getDate(comment.created_at)}</div>
                  </div>
                  <div class="list-item-line list-item-comment-line">${comment.content}</div>
               </span>
            </div>
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
              <div class="modal-container post-comments-container">
                <div class="modal-header">
                    <div class="modal-desc">
                       <h3>პოსტის კომენტარები</h3>
                       <button class="button button-icon" id="closeButton">
                          <i class="material-symbols-outlined">close</i>
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