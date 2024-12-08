import overlayService from "../services/overlay.js";

export class ChatInfo {
    constructor(chatType = 1, userName) {
        this.overlayService = overlayService;
        this.chatType = chatType;
        this.userName = userName;
        this.close$ = document.createElement('div');
        this.chatImages$ = document.createElement('div');
        this.chatDocs$ = document.createElement('div');
        this.chatProfile$ = document.createElement('div');
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.element = this._createElement();
        this.chatImages = this.element.querySelector('#chatImages');
        this.chatDocs = this.element.querySelector('#chatDocs');
        this.listeners();
    }

    _createElement() {
        let template;
        if (this.chatType === 1) {
            template = this.OneToOneChat();
        } else {
            template = this.OneToMoreChat();
        }

        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    OneToOneChat() {
        const template = `
             <div class="chat-info-append">
               <a class="button chat-more-button" id="chatProfile" href="/users/${this.userName}">
                 <i class="material-symbols-outlined settings-icon">person</i>
                 <span>პროფილი</span>
               </a>
               <button class="button chat-more-button" id="chatImages">
                 <i class="material-symbols-outlined settings-icon">image</i>
                 <span>გალერია</span>
               </button>
               <button class="button chat-more-button" id="chatDocs">
                <i class="material-symbols-outlined settings-icon">text_snippet</i>
                <span>ფაილები</span>
               </button>
             </div>
        `;

        return template;
    }

    OneToMoreChat() {
        const template = `
             <div class="chat-info-append">
               <a class="button chat-more-button" id="chatProfile">
                 <i class="material-symbols-outlined settings-icon">person</i>
                 <span>პროფილი</span>
               </a>
               <button class="button chat-more-button" id="chatImages">
                 <i class="material-symbols-outlined settings-icon">image</i>
                 <span>გალერია</span>
               </button>
               <button class="button chat-more-button" id="chatDocs">
                <i class="material-symbols-outlined settings-icon">text_snippet</i>
                <span>ფაილები</span>
               </button>
             </div>
        `;

        return template;
    }

    listeners() {
        setTimeout(() => document.addEventListener('click', this.handleOutsideClick), 0);
        
        this.chatImages.addEventListener('click', () => {
            this.chatImages$.dispatchEvent(new CustomEvent('images'));
        })
        this.chatDocs.addEventListener('click', () => {
            this.chatDocs$.dispatchEvent(new CustomEvent('docs'));
        })

    }

    handleOutsideClick(ev) {
        const inside = ev.composedPath().some(el => {
            return this.element === el;
        });

        if (!inside) {
            this.detach();
        }
    }

    detach() {
        document.removeEventListener("click", this.handleOutsideClick);
        this.close$.dispatchEvent(new CustomEvent('closed'));
    }


}