import { Header } from "../general/header.js";
import { initListeners } from "../listeners/index.js";
import httpService from "../services/http.js";
class Blocks {
    constructor() {
        this.httpService = httpService;
        this.blocksList = document.querySelector('#blocksList');
        console.log(this.blocksList);
        this.unBlocks = this.blocksList.querySelectorAll('button');
        console.log(this.unBlocks)
        this.listeners();
    }

    listeners() {
        this.unBlocks.forEach(unBlock => {
            unBlock.addEventListener('click', () => {
                const listItem = unBlock.closest('.list-item');
                const userId = Number(listItem.getAttribute('data-user-id'));
                this.httpService.unBlockUser(userId)
                .then(_ => {
                    this.toastService.showToast(`თქვენ მოხსენით ბლოკი მომხმარებელს`);
                    listItem.remove();
                })
            })
        })
    }
}

function init() {
    initListeners();
    new Blocks();
    new Header();
}

document.addEventListener('DOMContentLoaded', init);