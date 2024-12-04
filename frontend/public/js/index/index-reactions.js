export class IndexReactions {
    constructor(type) {
        this.type = type;
        this.loaded = false;
        this.close$ = document.createElement('div');
        this.element = this._createElement();
        this.closeButton = this.element.querySelector('#closeButton');
        this.modalBody = this.element.querySelector('.modal-body');
        this.spinnerContainer = this.element.querySelector('.spinner-container');
        this.listeners();
        this.fetchData();
    }

    listeners() {
        this.closeButton.addEventListener('click', () => {
            this.close$.dispatchEvent(new CustomEvent('closed'));
        })
    }

    fetchData() {

    }

    handleLoadingState() {

    }

    _createElement() {
        const template = `
              <div class="modal-container">
                <div class="modal-header">
                    <div class="modal-desc">
                        <div style="display:flex;">
                          <button class="button button-link button-link-active" id="likeReactions">
                            <i class="material-symbols-outlined smaller-icon">thumb_up</i>
                            მოწონებები
                          </button>
                          <button class="button button-link" id="unlikeReactions">
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
                   <div class="modal-content">
                     <div class="list">
                       <div class="list-item list-divider">
                         <img src="/public/images/users/user.png" class="list-item-avatar">
                       <span class="list-item-content">
                <h4 class="list-item-title">სალამი ჯიგარ</h4>
                <p class="list-item-line"> ~ დღემდე</p>
            </span>
            <button class="button button-icon" data-tooltip="მეგობრებში დამატება">
                <i class="material-symbols-outlined">person_add</i>
            </button>
        </div>
        <div class="list-item list-divider">
                         <img src="/public/images/users/user.png" class="list-item-avatar">
                       <span class="list-item-content">
                <h4 class="list-item-title">სალამი ჯიგარ</h4>
                <p class="list-item-line"> ~ დღემდე</p>
            </span>
            <button class="button button-icon" data-tooltip="მეგობრებში დამატება">
                <i class="material-symbols-outlined">person_add</i>
            </button>
        </div>
        <div class="list-item list-divider">
                         <img src="/public/images/users/user.png" class="list-item-avatar">
                       <span class="list-item-content">
                <h4 class="list-item-title">სალამი ჯიგარ</h4>
                <p class="list-item-line"> ~ დღემდე</p>
            </span>
            <button class="button button-icon" data-tooltip="მეგობრებში დამატება">
                <i class="material-symbols-outlined">person_add</i>
            </button>
        </div>
                     </div>
                   </div>
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