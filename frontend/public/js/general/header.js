import httpService from "../services/http.js";
import overlayService from "../services/overlay.js";
import cookieService from "../services/cookie.js";
import { SearchBox } from '../general/search-box.js';

export class Header {
  constructor() {
    this.overlayService = overlayService;
    this.httpService = httpService;
    this.cookieService = cookieService;
    this.searchBox = null;
    this.debounce = this.debounce.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.themeContainer = document.querySelector('.toggle-container');
    this.element = document.querySelector('.header');
    this.headerInput = document.querySelector('#headerInput');
    this.listeners();
  }

  listeners() {
    this.headerInput.addEventListener('input', this.debounce(this.handleInputDebounced, 500));
    if (this.themeContainer) {
      const input = this.themeContainer.querySelector('input');
      const icons = this.themeContainer.querySelectorAll('i');
      const span = this.themeContainer.querySelector('span');
      input.addEventListener('change', (ev) => {
        const checked = ev.target.checked;
        cookieService.toggleMode();
        icons.forEach((icon, i) => {
          if (i === 0) {
            icon.classList.remove('toggle-first-activated');
          } else {
            icon.classList.remove('toggle-second-activated');
          }
        });

        icons.forEach((icon, i) => {
          if (checked && i === 0) {
            icon.style.opacity = 0;
          } else if (checked && i === 1) {
            icon.style.opacity = 1;
            icon.style.left = '29px';
          } else if (!checked && i === 0) {
            icon.style.opacity = 1;
            icon.style.left = '2px';
          } else if (!checked && i === 1) {
            icon.style.opacity = 0;
          }
        })

        if (checked) {
          span.style.left = '27px';
        } else {
          span.style.left = '1px';
        }
      })
    }
  }

  debounce(func, delay) {
    return function (...args) {
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