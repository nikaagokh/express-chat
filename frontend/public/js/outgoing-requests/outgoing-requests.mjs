import { initListeners } from '../listeners/index.js';
import overlayService from '../services/overlay.js';

class OutgoingRequests {
    constructor() {
        this.overlayService = overlayService;
        this.requestsList = document.querySelector('#outgoingRequestsList');
        this.menuButtons = this.requestsList.querySelectorAll('button');
        this.listeners();
    }

    listeners() {
        this.menuButtons.forEach(menuButton => {
            menuButton.addEventListener('click', () => {
                const listItem = menuButton.closest('.list-item');
                const userId = Number(listItem.getAttribute('data-user-id'));
                const userName = listItem.getAttribute('data-user-name');
                this.overlayService.openSendRequestsMenu(listItem, userId, userName);
            })
        });
    }
}

function init() {
    initListeners();
    new OutgoingRequests();
}

document.addEventListener('DOMContentLoaded', init);