import httpService from "../services/http.js";
import overlayService from "../services/overlay.js";
import { SearchBox } from '../general/search-box.js';

export class Header {
    constructor() {
        this.overlayService = overlayService;
        this.httpService = httpService;
        this.searchBox = null;
        this.debounce = this.debounce.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.element = document.querySelector('.header');
        this.headerInput = document.querySelector('#headerInput');
        this.listeners();
    }

    listeners() {
        this.headerInput.addEventListener('input', this.debounce(this.handleInputDebounced, 500));
    }

    debounce(func, delay) {
        return function(...args) {
          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(() => {
            func.apply(this, args);
          }, delay);
        }.bind(this);
    }

    handleInputDebounced(ev) {
      console.log('aeeaerr');
        const word = ev.target.value;
        if (word.length !== 0) {
          if (this.searchBox === null) {
            this.createOverlay(word);
          } else {
            this.changeOverlayInput(word);
          }
        } else {
          this.searchBox.detach();
        }
    }

    createOverlay(word) {
        this.searchBox = new SearchBox();
        this.searchBox.changeInput = word;
        this.searchBox.close$.addEventListener('closed', () => {
          this.searchBox = null;
        })
    }

    changeOverlayInput(word) {
        this.searchBox.changeInput = word;
    }

    handleOutsideClick(ev) {

    }
}