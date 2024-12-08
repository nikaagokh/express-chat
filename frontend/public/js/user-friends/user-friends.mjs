import { initListeners } from "../listeners/index.js";
import { initSocket } from "../socket/socket.js";
import { Header } from "../general/header.js";
import overlayService from "../services/overlay.js";
import { UserPageAbout } from "../user-page/user-page-about.js";

class Friends {
    constructor() {
        this.overlayService = overlayService;
        this.friendsList = document.querySelector('#friendsList');
        this.menuButtons = this.friendsList.querySelectorAll('button');
        this.listeners();
    }

    listeners() {
        this.menuButtons.forEach(menuButton => {
            menuButton.addEventListener('click', () => {
                const listItem = menuButton.closest('.list-item');
                const userId = Number(listItem.getAttribute('data-user-id'));
                const userName = listItem.getAttribute('data-user-name');
                this.overlayService.openFriendsMenu(listItem, userId, userName);
            })
        });
    }
}

function init() {
    initListeners();
    initSocket();
    new Friends();
    new Header();
    new UserPageAbout();
}

document.addEventListener('DOMContentLoaded', init);