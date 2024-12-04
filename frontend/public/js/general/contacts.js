import httpService from '../services/http.js';
import overlayService from '../services/overlay.js';
import socketService from '../services/socket.js';

export class Contacts {
    constructor() {
        this.httpService = httpService;
        this.overlayService = overlayService;
        this.socketService = socketService;
        this.debounce = this.debounce.bind(this);
        this.handleInputDebounced = this.handleInputDebounced.bind(this);
        this.contactUsers = document.querySelectorAll('.contacts-list-item');
        this.contactsGroup = document.querySelector('.contacts-group');
        this.contactsInput = document.querySelector('#contactsInput');
        this.contactsAddButton = document.querySelector('#contactsAddButton');
        this.listeners();

    }

    listeners() {
        this.contactsInput.addEventListener("input", this.debounce(this.handleInputDebounced, 500));
        this.contactUsers.forEach(contactUser => {
            contactUser.addEventListener('click', () => {
                this.openUserChat(contactUser);
            });
        });
        this.contactsAddButton.addEventListener('click', () => {
            this.overlayService.openAddGroup();
        });

        this.socketService.socket.on('onOnline', (ev) => {
            const { conversationId, online } = ev;
            const contactItem = document.querySelector(`[data-conversation-id="${conversationId}"]`);
            console.log(ev);
            console.log(contactItem);
            if (online && contactItem) {
                contactItem.classList.add('contacts-list-item-active');
            } else if(!online && contactItem) {
                contactItem.classList.remove('contacts-list-item-active');
            }
        })
    }

    debounce(func, delay) {
        return function (...args) {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        }.bind(this);
    }

    async handleInputDebounced() {
        const input = this.contactsInput.value;
        this.users = await this.httpService.filterUsers(input);
        console.log(this.users);
        this.updateUsers();
    }

    updateUsers() {
        const template = this.users.map(user => `
            
             <div class="contacts-list-item list-hoverable" data-conversation-id="${user.conversation_id}" data-user-id="${user.user_id}" data-user-name="${user.user_name}">
                <img class="contacts-list-item-media" src="/public/images/users/${user.image}">
                <span class="contacts-list-item-content">${user.full_name}</span>
             </div>
            `).join('');
        this.contactsGroup.innerHTML = template;
        this.contactsGroup.querySelectorAll('.contacts-list-item').forEach(contactUser => {
            contactUser.addEventListener('click', () => {
                this.openUserChat(contactUser);
            });
        });
    }

    openUserChat(contactUser) {
        const userId = Number(contactUser.getAttribute('data-user-id'));
        const conversationId = Number(contactUser.getAttribute('data-conversation-id'));
        const userName = contactUser.getAttribute('data-user-name');
        const userFullName = contactUser.querySelector('span').textContent;
        this.overlayService.openChat(conversationId, userId, userFullName, userName);
    }
}