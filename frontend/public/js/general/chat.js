import cookieService from "../services/cookie.js";
import httpService from "../services/http.js";
import overlayService from "../services/overlay.js";
import socketService from "../services/socket.js";
import { Intersect } from "./intersect.js";

export class Chat {
  constructor(conversationId, userId, userFullName, userName) {
    this.cookieService = cookieService;
    this.overlayService = overlayService;
    this.httpService = httpService;
    this.socketService = socketService;
    this.conversationId = conversationId;
    this.userFullName = userFullName
    this.userId = userId;
    this.userName = userName;
    this.sendMessageHandler = this.sendMessageHandler.bind(this);
    this.enterHandler = this.enterHandler.bind(this);
    this.close$ = document.createElement('div');
    this.loaded = false;
    this.firstOpen = true;
    this.offset = 1;
    this.images = [];
    this.filesInf = [];
    this.filesArr = [];
    this.filePreviewBox = null;
    this.timeoutId = 0;
    this.chatType = 1;
    this.element = this._createElement();
    this.chatHeader = this.element.querySelector('.chat-header');
    this.chatWrapper = this.element.querySelector('.chat-wrapper');
    this.messagesContainer = this.element.querySelector('#messagesContainer');
    this.fileContainer = this.element.querySelector('#filePreviews');
    this.chatInput = this.element.querySelector('#chatInput');
    this.uploadFileInput = this.element.querySelector('#upload-chat-file');
    this.sendButton = this.element.querySelector('#messageSend');
    this.closeButton = this.element.querySelector('#chatCloseButton');
    this.optionsButton = this.element.querySelector('#chatOptionsButton');
    this.chatStatusIcon = this.element.querySelector('#chatStatus');
    this.previewsClose = this.element.querySelector('#messagePreviewsClose');
    this.listeners();
    this.socketListeners();
    this.fetchData();
  }

  async fetchData() {
    this.loaded = false;
    this.handleLoadingState();
    this.chatObject = await this.httpService.getChatMessages(this.conversationId, this.userId);
    this.messages = this.chatObject.messagesDate;
    this.online = this.chatObject.online;
    console.log(this.chatObject);
    this.loaded = true;
    this.updateChatStatus();
    this.handleLoadingState();
    this.renderMessages();
    setTimeout(() => {
      this.scrollBottom();
    }, 0);
  }

  updateChatStatus() {
    if (this.online) {
      this.chatStatusIcon.classList.remove('chat-inactive');
      this.chatStatusIcon.classList.add('chat-active');
    } else {
      this.chatStatusIcon.classList.remove('chat-active');
      this.chatStatusIcon.classList.add('chat-inactive');
    }
  }

  renderMessages() {
    this.messagesContainer.innerHTML = '';
    const template = this.chatObject.messagesDate.map(item => `
       <div class="chat-date">${item.date}</div>
       ${item.messages.map(message => `
        ${message.message_type === 1 ? `
          <div class="message-wrapper ${this.isLastMessage(message.message_id) ? 'slide-up' : ''} ${message.sent ? 'send' : 'receive'} ${(message.last && message.sent) ? 'sendlast' : ''} ${(message.last && !message.sent) ? 'receivelast' : ''}" style="margin-top: ${message.first ? '6px' : ''}">
                  <div class="text-wrapper">${message.content}</div>
                  <div class="message-inf">
                  <span>${message.time}</span>
                  <div class="check-container" style="display:${message.sent ? 'block' : 'none'}">
                    <i class="material-symbols-outlined check-icon">check</i>
                 </div>
             </div>
         </div>
        `: `${message.medias && message.message_type === 2 ? message.medias.map(file => `
         <div class="message-wrapper message-image-wrapper ${message.sent ? 'chat-img-sent' : 'chat-img-receive'}">
          <div class="chat-img-wrapper ${message.sent ? 'justify-end' : 'justify-start'}">
            ${this.createFileTemplate(file, message)}
          </div>
        </div>
      `).join('') : ''}
       `}
        `).join('')}
      `).join('');

    this.messagesContainer.innerHTML = template;
    this.messagesContainer.querySelectorAll('.message-img').forEach(messageImg => {
      messageImg.addEventListener('click', (ev) => {
        const src = messageImg.getAttribute('src');
        const fileName = src.split('/')[2];
        this.overlayService.openChatZoom(this.conversationId, fileName);
      })
    })
  }

  handleLoadingState() { }

  listeners() {
    document.addEventListener('keydown', this.enterHandler);
    this.closeButton.addEventListener('click', () => {
      this.detach();
    })

    this.optionsButton.addEventListener('click', () => {
      this.overlayService.openChatInfo(this.chatHeader, this.conversationId, this.userName);
    })

    this.uploadFileInput.addEventListener('change', async (ev) => {
      const fileList = ev.target.files;
      this.fileContainer.style.display = 'flex';
      this.chatInput.style.border = '1px solid #e5ecf1';
      if (fileList) {
        const fileArray = Array.from(fileList);
        for (const file of fileArray) {
          try {
            const image = await this.getFileObject(file);
            this.images.push(image);
            this.filesInf.push(file);
            this.filesArr.push(file);
          } catch (err) {
            console.error(err);
          }
        }
        this.renderFilesPreview();
      }
    })

    this.sendButton.addEventListener('click', this.sendMessageHandler);
  }

  socketListeners() {
    this.socketService.socket.on('onOnline', (ev) => {
      const { conversationId, online } = ev;
      this.online = online;
      if (conversationId === this.conversationId) {
        this.updateChatStatus()
      }
    });

    this.socketService.socket.on('onMessage', (message) => {
      this.messages[this.messages.length - 1].messages.push(message);
      this.renderMessages();
      this.clearInput();
      this.scrollBottom();
    });
  }

  clearInput() {
    this.chatInput.value = '';
  }

  scrollBottom() {
    const top = this.chatWrapper.scrollHeight;
    this.chatWrapper.scrollTo({
      top: top,
      behavior: 'instant'
    })
  }

  async sendMessageHandler() {
    const content = this.chatInput.value;
    console.log(content);
    if (content !== '' || this.images.length > 0) {
      try {
        const message = this.generateMessage(content);
        const slug = message.slug;
        this.appendMessage(message);
        this.clearInput();
        this.scrollBottom();
        if (this.images.length === 0) {
          await this.httpService.addBasicMessage(content, this.conversationId);
        } else {
          await this.httpService.addFileMessage(content, this.conversationId, this.filesInf);
        }
      } finally {
        this.closePreview();
      }
    }
  }

  appendMessage(message) {
    if (message.message_type === 2) {
      this.appendFiles();
    } else {
      this.appendText(message);
    }
  }

  appendFiles() {
    const template = this.filesInf.map(file => `
        <div class="message-wrapper message-image-wrapper chat-img-sent">
      <div class="chat-img-wrapper justify-end">
        ${this.generateFileTemplate(file)}
      </div>
    </div>
    `).join('');
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = template;
    tempContainer.querySelectorAll('.chat-download-meta').forEach(button => {
      console.log(button)
      button.addEventListener('click', () => {
        const fileName = button.getAttribute('data-name');
        console.log(fileName);
        console.log(this.filesInf)
        const file = this.filesArr.find(f => f.name === fileName);
        this.downloadFile(file.name, URL.createObjectURL(file));
      })
    })

    Array.from(tempContainer.children).forEach(child => {
      this.messagesContainer.appendChild(child);
    })
  }

  generateFileTemplate(file) {
    let fileElement;
    if (file.type.startsWith('image/')) {
      fileElement = this.generateImageTemplate(file);
    } else if (file.type.startsWith('video/')) {
      fileElement = this.generateVideoTemplate(file);
    } else {
      fileElement = this.generateGenericTemplate(file);
    }

    return fileElement;
  }

  generateImageTemplate(file) {
    return `
            <img src="${URL.createObjectURL(file)}" width="150" height="100" class="message-img">
            <button class="button button-icon chat-download-meta left0" data-name=${file.name}>
                <i class="material-symbols-outlined">download</i>
            </button>
    `;
  }

  generateVideoTemplate(file) {
    return `
        <video src="${URL.createObjectURL(file)}" width="150" height="100" controls></video>
        <button class="button button-icon chat-download-meta left0" data-name="${file.name}">
            <i class="material-symbols-outlined">download</i>
        </button>
`;
  }

  generateGenericTemplate(file) {
    return `
    <div class="chat-file-append">
        <i class="material-symbols-outlined chat-send-icon">description</i>
        <span>${file.name}</span>
        <button class="button button-icon chat-download-meta left0" data-name="${file.name}">
          <i class="material-symbols-outlined">download</i>
        </button>
    </div>
`;
  }

  appendText(message) {
    const template = `
    <div class="message-wrapper send sendlast">
    <div class="text-wrapper">${message.content}</div>
    <div class="message-inf">
      <span class="chat-time">${message.time}</span>
      <div class="check-container" style="display:none;">
       <i class="material-symbols-outlined">check</i>
      </div>
      </div>
    </div>
    `;

    this.messagesContainer.innerHTML += template;
  }



  renderFilesPreview() {
    const template = this.images.map(image => `
         <div class="upload-file-card">
          <img src="${image.url}" width="25" height="25">
          <span class="upload-file-meta">
             <i class="material-symbols-outlined" id="chatPreviewClose" style="font-size:20px; color:#000;">close</i>
          </span>
          ${image.type === 2 ? `
          <i class="material-symbols-outlined upload-file-icon" id="chatPreviewPlay">play_circle</i>
          `: ''}
          ${image.type === 1 ? `
          <span class="upload-file-filename">${image.name}</span>
          `: ''}
        </div>
        `);

    this.fileContainer.innerHTML = template;
    this.fileContainer.querySelectorAll('#chatPreviewClose').forEach((previewClose, i) => {
      previewClose.addEventListener('click', () => {
        this.removeFile(i);
        if (this.images.length === 0) {
          this.closePreview();
        }
      })
    })
  }

  async getFileObject(file) {
    const { type, name } = file;
    if (type.startsWith('video/')) {
      const type = 2;
      return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const fileURL = URL.createObjectURL(file);
        video.src = fileURL;
        video.currentTime = 5;
        video.addEventListener('loadeddata', () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const url = canvas.toDataURL('image/jpeg');
          URL.revokeObjectURL(fileURL);
          resolve({ url, type, name });
        });

        video.addEventListener('error', (e) => {
          reject(e);
        });
      });
    } else if (type.startsWith('image/')) {
      const type = 0
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({ url: reader.result, type, name });
        };
        reader.readAsDataURL(file);
      });
    } else {
      const type = 1;
      const url = 'http://localhost:3005/public/images/file.png';
      return { url, type, name };
    }
  }

  closePreview() {
    this.fileContainer.style.display = 'none';
    this.chatInput.style.borderRadius = '2px';
    this.images = [];
    this.filesInf = [];
  }

  removeFile(index) {
    this.images.splice(index, 1);
    this.filesInf.splice(index, 1);
    this.filesArr.splice(index, 1);
    this.renderFilesPreview();
  }

  enterHandler(ev) {
    if(ev.key === 'Enter') {
      this.sendMessageHandler();
    }
  }

  _createElement() {
    const template = `
              <div class="chat-container" id="main-container">
                <div class="chat-wrapper" id="chat-cont">
                 <div class="chat-header">
                   <div class="chat-status-wrapper">
                    <span class="chat-status-line">სტატუსი</span>
                    <span class="chat-status-icon" id="chatStatus"></span>
                   </div>
                   <span class="chat-header-title">${this.userFullName}</span>
                   <div class="chat-header-actions">
                    <button class="button button-icon chat-more" id="chatOptionsButton">
                     <i class="material-symbols-outlined" style="font-size:18px;">more_horiz</i>
                    </button>
                    <button class="button button-icon" id="chatCloseButton">
                     <i class="material-symbols-outlined" style="font-size:18px;">close</i>
                    </button>
                   </div>
                </div>
                <div class="chat-body chat-background id="chat-body">
                  <div class="chat-flex" id="chat-flex">
                    <div class="intersecting" id="intersecting"></div>
                    <div class="message-container" id="messagesContainer"></div>
                  </div>
                  <div class="typing" id="userTyping" style="display:none;"></div>
                  <div class="typing-container" id="typingContainer" style="display:none;">
                   <span class="typing-text" id="typingText"></span>
                   <div class="typing-elastic">
                     <div class="dot-elastic"></div>
                   </div>
                  </div>
                </div>
              </div>
    <div class="chat-footer">
        <div class="chat-search-bottom">
        <label for="upload-chat-file" class="custom-file-uploader button-icon" data-tooltip="ფაილის არჩევა">
             <i class="material-symbols-outlined">attach_file</i>
        </label>
        <input type="file" multiple="multiple" id="upload-chat-file" accept="*" class="upload-file">
            <div class="input-wrapper">
               <div class="upload-file-previews" id="filePreviews">
               </div>
               <input type="text" id="chatInput" class="input-self chat-input" style="padding-left:0.5rem;" autocomplete="off">
            </div>

            <button class="button button-icon" id="messageSend">
              <i id="sendMessageBtn" class="material-symbols-outlined send-message-icon">send</i>
            </button>
        </div>
        <div class="snippet" id="snippet" style="display: none;">
            <div class="stage">
                <div class="dot-elastic"></div>
            </div>
        </div>
    </div>
    <div class="chat-spinner">
         <svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
             <circle class="path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
         </svg>
    </div>
</div>
        `
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = template;
    return tempContainer.firstElementChild;
  };

  createFileTemplate(file, message) {
    let fileElement;
    if (file.media_type === 1) {
      fileElement = this.createImageTemplate(file, message);
    } else if (file.media_type === 2) {
      fileElement = this.createVideoTemplate(file, message);
    } else {
      fileElement = this.createGenericTemplate(file, message);
    }

    return fileElement;
  }

  createImageTemplate(file, message) {
    return `
    <img src="/files/chats/${file.media_name}" alt="photo" width="150" height="100" class="message-img" style="cursor:zoom-in;">
    <a class="button button-icon chat-download-meta ${message.sent ? 'left0' : 'right0'}" href="/files/chats/${file.media_name}" download>
        <i class="material-symbols-outlined">download</i>
    </a>
    `;
  }

  createVideoTemplate(file, message) {
    return `
    <video src="/files/chats/${file.media_name}" width="150" height="150" controls class="message-video"></video>
    <a class="button button-icon chat-download-meta ${message.sent ? 'left0' : 'right0'}" href="/files/chats/${file.media_name}" download>
        <i class="material-symbols-outlined">download</i>
    </a>
    `;
  }

  createGenericTemplate(file, message) {
    console.log(file);
    return `
    <div class="chat-file-append message-file ${message.sent ? 'chat-file-send' : 'chat-file-receive'}">
        <i class="material-symbols-outlined ${message.sent ? 'chat-send-icon' : 'chat-receive-icon'}">description</i>
        <span class="chat-file-content">${file.media_name}</span>
        <a class="button button-icon chat-download-meta ${message.sent ? 'left0' : 'right0'}" href="/files/chats/${file.media_name}" download>
          <i class="material-symbols-outlined">download</i>
        </a>
    </div>
`;
  }

  isLastMessage(messageId) {
    const todayMessages = this.messages[this.messages.length - 1].messages;
    const latestMessageId = todayMessages[todayMessages.length - 1].message_id;
    return (latestMessageId === messageId) && !this.firstOpen ? true : false;
  }

  generateMessage(content) {
    const dateUtc = new Date();
    const now = new Date(dateUtc.getTime() - dateUtc.getTimezoneOffset() * 60 * 1000);
    const sent = true;
    const last = true;
    const first = false;
    const time = now.toISOString().substring(11, 16);
    const message_type = this.images.length > 0 ? 2 : 1;
    const slug = Date.now();
    return { content, sent, last, first, time, message_type, slug };

  }

  detach() {
    this.close$.dispatchEvent(new CustomEvent('closed'));
  }
}