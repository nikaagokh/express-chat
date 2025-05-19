export class YouSure {
    constructor(text, decline, accept) {
        this.text = text;
        this.accept = accept;
        this.decline = decline;
        this.enterHandler = this.enterHandler.bind(this);
        this.element = this._createElement();
        this.accept$ = document.createElement('div');
        this.decline$ = document.createElement('div');
        this.acceptButton = this.element.querySelector('#acceptButton');
        this.declineButton = this.element.querySelector('#declineButton');
        this.listeners();
    }

    _createElement() {
        const template = `
        <div class="yousure-container">
        <div class="toast slide-down toast-info toast-no">
            <div class="toast-message">
                <button class="button button-icon">
                    <i class="material-symbols-outlined toaster-icon">info</i>
                </button>
                <div class="toast-content">
                    ${this.text}
                </div>
                
            </div>
          </div>
           <div class="yousure-actions">
            <button class="button toast-decline-button" id="declineButton">
               ${this.decline}
            </button>
            <button class="button toast-accept-button" id="acceptButton">
                ${this.accept}
            </button>
          </div>
    </div>
        `
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = template;
        return tempContainer.firstElementChild;
    }

    enterHandler(ev) {
        if(ev.key === 'Enter') {
            this.accepted();
        } else if(ev.key === 'Esc') {
            this.declined();
        }
    }

    listeners() {
        document.addEventListener('keydown', this.enterHandler);
        this.acceptButton.addEventListener("click", () => {
            this.accepted();
        })
        this.declineButton.addEventListener("click", () => {
            this.declined();
        })
    }

    accepted() {
        this.accept$.dispatchEvent(new CustomEvent('accepted'));
    }

    declined() {
        this.decline$.dispatchEvent(new CustomEvent('declined'));
    }
}