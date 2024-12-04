import httpService from "../services/http.js";
import overlayService from "../services/overlay.js";
export class ChatDocs {
    constructor(conversationId) {
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.conversationId = conversationId;
        this.moreOptions = null;
        this.close$ = document.createElement('div');
        this.element = this._createElement();
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.docsContainer = this.element.querySelector('.modal-content');
        this.spinnerContainer = this.element.querySelector('.spinner-container');
        this.closeButton = this.element.querySelector('#chatGroupClose');
        this.fetchData();
        this.listeners();
    }

    _createElement() {
        const template = `
         <div class="modal-container">
            <div class="modal-header">
                <div class="modal-desc">
                    <h3>ფაილები</h3>
                    <button class="button button-icon" id="chatGroupClose">
                      <i class="material-symbols-outlined">close</i>
                    </button>
                </div>    
            </div>
            <div class="modal-body">
              <div class="spinner-container">
                 <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                   <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                 </svg>
              </div>
              <div class="modal-content"></div>
            </div>
         </div>
         
        `;
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    async fetchData() {
        this.loaded = false;
        this.handleLoadingState();
        this.docs = await this.httpService.getDocsFiles(this.conversationId);
        console.log(this.docs);
        this.renderDocs();
        this.loaded = true;
        this.handleLoadingState();
        
    }

    listeners() {
        /*
        const moreButtons = this.element.querySelectorAll('.chatgroup-more');
        moreButtons.forEach(moreButton => {
            moreButton.addEventListener('click', () => {
                this.openMoreOptions(moreButton);
            })
        })
        */
       const downloadButtons = this.element.querySelectorAll('.chat-file-download');
       downloadButtons.forEach((downloadButton, i) => {
           downloadButton.addEventListener('click', () => {
             const fileName = this.docs[i].media_name;
             console.log(fileName);
             this.httpService.getDownloadedFile(fileName)
                .then(blob => {
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = downloadUrl;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(downloadUrl);
                    document.body.removeChild(a);
                })
           })
       })

        this.closeButton.addEventListener('click', () => {
            this.close$.dispatchEvent(new CustomEvent('closed'));
        })
    }

    getFileName(downloadButton) {
       

    }

    handleLoadingState() {
        if(this.loaded) {
            this.spinnerContainer.style.display = 'none';
            this.docsContainer.style.display = 'block';
        } else {
            this.spinnerContainer.style.display = 'block';
            this.docsContainer.style.display = 'none';
        }
    }

    renderDocs() {
        this.docsContainer.innerHTML = '';
        console.log(this.docs);
        const template = this.docs.map(doc => `
         <div class="list-item chat-file-item list-divider" tabindex="0" data-id="${doc.id}">
            <i class="material-symbols-outlined chatgroup-user-icon">description</i>
            <span class="list-item-content">
                <h4 class="list-item-title">${doc.media_name}</h4>
                <p class="list-item-line">${(doc.media_size / 1024).toFixed(2) } kb</p>
            </span>
            <button class="button button-icon chat-file-download" data-id="${doc.file_id}">
                <i class="material-symbols-outlined">download</i>
            </button>
        </div>
        `).join('');
        this.docsContainer.innerHTML = template;
        this.listeners();
    }

    openMoreOptions(moreButton) {
        if(!this.moreOptions) {
            this.moreOptions = this._createMoreOptions();
            moreButton.appendChild(this.moreOptions);
            const userId = Number(moreButton.getAttribute('data-id'));
            const userIdentity = moreButton.previousElementSibling.querySelector('.list-item-title').textContent;
            
            this.closeButton.previousElementSibling
            this.moreButtonListeners(userId, userIdentity);
        }
    }

    _createMoreOptions() {
        const template = `
          <div class="chat-group-append">
               <button class="button chat-more-button" id="chatMessage">
                 <i class="material-symbols-outlined settings-icon">chat</i>
                 <span>შეტყობინება</span>
               </button>
               <button class="button chat-more-button" id="chatBlock">
                 <i class="material-symbols-outlined settings-icon">block</i>
                 <span>დაბლოკვა</span>
               </button>
             </div>
        `;
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    moreButtonListeners(userId, userIdentity) {
        const chatMessage = this.moreOptions.querySelector('#chatMessage');
        const chatBlock = this.moreOptions.querySelector('#chatBlock');
        chatMessage.addEventListener('click', () => {
            this.comm$.dispatchEvent(new CustomEvent('commed', {detail:{userId, userIdentity}}));
        });

        chatBlock.addEventListener('click', () => {
           this.overlayService.openQuestion('ნამდვილად გსურთ ამ იუზერის დაბლოკვა?', 'დახურვა', 'დაბლოკვა');
        })

        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 0);
    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.moreOptions === el;
        });
        if (!inside) {
            this.detachMoreOptions();
        }
    }

    detachMoreOptions() {
        this.moreOptions.remove();
        this.moreOptions = null;
        document.removeEventListener('click', this.handleOutsideClick);
    }

    detach() {}
}