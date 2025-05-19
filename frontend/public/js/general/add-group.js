import httpService from "../services/http.js";
import toastService from "../services/toast.js";
export class AddGroup {
    constructor() {
        this.httpService = httpService;
        this.toastService = toastService;
        this.loaded = false;
        this.activeSelect = null;
        this.userIds = [];
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.close$ = document.createElement('div');
        this.element = this._createElement();
        this.groupInput = this.element.querySelector('#groupInput');
        this.submitButton = this.element.querySelector('#submitButton');
        this.closeButton = this.element.querySelector('#closeButton');
        this.modalBody = this.element.querySelector('.modal-body');
        this.modalContent = this.element.querySelector('.modal-content');
        this.spinnerContainer = this.element.querySelector('.spinner-container');
        this.addGroupForm = {
            button: this.element.querySelector('#addGroupButton'),
            dropdown: this.element.querySelector('#addGroupList'),
            isOpen: false,
            active: null,
            placeholder: 'აირჩიეთ წევრები',
            valueChanges: document.createElement('div')
        };
        this.listeners();
        this.fetchData();
    }

    listeners() {
        this.closeButton.addEventListener('click', () => {
            this.close$.dispatchEvent(new CustomEvent('closed'));
        });

        this.submitButton.addEventListener('click', () => {
            const groupName = this.groupInput.value;
            if(this.userIds.length > 0 && groupName.length > 0) {
                this.httpService.createGroupChat(groupName, this.userIds)
                .then(conversation => {
                    console.log(conversation);
                    this.toastService.createSuccessToast('თქვენს მიერ ჩათი წარმატებით შეიქმნა');
                }).catch(_ => {
                    this.toastService.createDangerToast('ჩათი მსგავსი სახელით უკვე არსებობს');
                })
            }
        })

        this.addGroupForm.button.addEventListener('click', () => {
            if (!this.activeSelect) {
                this.addGroupForm.isOpen = true;
                this.activeSelect = this.addGroupForm;
                this.activeSelect.dropdown.classList.add('ul-active');
                setTimeout(() => document.addEventListener('click', this.handleOutsideClick));
            } else {
                console.log('ae');
                this.detachList();
            }
        })

        this.addGroupForm.valueChanges.addEventListener('changed', (ev) => {
            this.userIds = ev.detail;
        })
    }

    async fetchData() {
        this.loaded = false;
        this.handleLoadingState();
        this.users = await this.httpService.getFriendUsers();
        this.loaded = true;
        this.handleLoadingState();
        this.updateSelectItems();
    }

    handleLoadingState() {
        if(!this.loaded) {
            this.spinnerContainer.style.display = 'block';
            this.modalContent.style.display = 'none';
        } else {
            this.spinnerContainer.style.display = 'none';
            this.modalContent.style.display = 'flex';
        }
    }

    updateSelectItems() {
        const template = this.users.map(user => `
             <div class="list-item list-item-mini list-item-cursor" data-user-id="${user.user_id}">
                <span class="checkbox__mark"></span>
                <img class="list-item-media" src="/public/images/users/${user.image}">
                <span class="list-item-content">${user.full_name}</span>
             </div>
            `).join('');
        this.addGroupForm.dropdown.innerHTML = template;
    }

    _createElement() {
        const template = `
              <div class="modal-container" style="height:350px;">
                <div class="modal-header">
                    <div class="modal-desc">
                        <span>ჯგუფის შექმნა</span>
                        <button class="button button-icon" id="closeButton">
                           <i class="material-symbols-outlined smaller-icon">close</i>
                        </button>
                    </div>    
                </div>
                <div class="modal-body" style="height:calc(350px - 5rem);">
                   <div class="modal-content">
                      <div class="custom-select margin-bottom w100">
                         <button class="select-button" role="combobox" aria-labelledby="select button" aria-haspopup="listbox"
                         aria-expanded="false" aria-controls="listbox" id="addGroupButton">
                           <span class="select-value">აირჩიეთ წევრები</span>
                           <i class="material-symbols-outlined">arrow_drop_down</i>
                         </button>
                         <ul role="listbox" class="select-dropdown" id="addGroupList" aria-multiselectable="true"></ul>
                      </div>
                     <div class="input-wrapper" id="groupInputWrapper">
                        <input type="text" id="groupInput" class="input-self contacts-input" placeholder="ჯგუფის სახელი" style="padding-left:0.5rem;">
                     </div> 
                     <button class="button modal-button" id="submitButton">ჯგუფის შექმნა</button>
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

    handleOutsideClick(ev) {
        console.log(this.activeSelect);
        const inside = ev.composedPath().some(el => {
            return this.activeSelect.dropdown === el
        });
        if (!inside) {
            this.detachList();
        } else {
            const multiple = Boolean(this.activeSelect.dropdown.getAttribute('aria-multiselectable'));
            if (!multiple) {
                const children = this.activeSelect.dropdown.children;
                for (let i = 0; i < children.length; i++) {
                    children[i].classList.remove('active');
                };
                const listItem = ev.target.closest('.list-item');
                listItem.classList.add('active');
                this.activeSelect.button.querySelector('.select-value').textContent = listItem.querySelector('.list-item-content').textContent;
                this.activeSelect.active = listItem.value;
                this.activeSelect.valueChanges.dispatchEvent(new CustomEvent('changed', { detail: listItem.value }));
                this.detachList();
            } else {
                let selectedValues = [];
                let selectedRefs = [];
                if (this.activeSelect.active === null) {
                    this.activeSelect.active = [];
                }
                const listItem = ev.target.closest('.list-item');
                listItem.classList.toggle('active');
                //this.activeSelect.active.push(listItem.value);
                Array.from(this.activeSelect.dropdown.children).forEach(li => {
                    if (li.classList.contains('active')) {
                        selectedValues.push(li.querySelector('.list-item-content').textContent);
                        selectedRefs.push(Number(li.getAttribute("data-user-id")));
                    }
                })
                if (selectedValues.length !== 0) {
                    this.activeSelect.button.querySelector('.select-value').textContent = selectedValues.join(', ');
                } else {
                    this.activeSelect.button.querySelector('.select-value').textContent = this.activeSelect.placeholder;
                }

                this.activeSelect.valueChanges.dispatchEvent(new CustomEvent('changed', { detail: selectedRefs }));
            }
        }

    }

    detachList() {
        this.activeSelect.dropdown.classList.remove('ul-active');
        this.activeSelect.isOpen = false;
        this.activeSelect = null;
        document.removeEventListener("click", this.handleOutsideClick);
    }

    detach() {
        this.close$.dispatchEvent(new CustomEvent('closed'));
        document.removeEventListener("click", this.handleOutsideClick);
    }
}