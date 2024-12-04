import { initListeners } from "../listeners/index.js";
import overlayService from "../services/overlay.js";
class IngoingRequests {
    constructor() {
        this.overlayService = overlayService;
        this.requestsList = document.querySelector('#ingoingRequestsList');
        this.menuButtons = this.requestsList.querySelectorAll('button');
        this.listeners();
    }

    listeners() {
        this.menuButtons.forEach(menuButton => {
            menuButton.addEventListener('click', () => {
                const listItem = menuButton.closest('.list-item');
                const userId = Number(listItem.getAttribute('data-user-id'));
                const userName = listItem.getAttribute('data-user-name');
                this.overlayService.openReceiveRequestsMenu(listItem, userId, userName);
            })
        });
    }
}

function init() {
    initListeners();
    new IngoingRequests();
}

document.addEventListener('DOMContentLoaded', init);