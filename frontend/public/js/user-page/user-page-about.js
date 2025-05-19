import overlayService from "../services/overlay.js";
import httpService from "../services/http.js";
import toastService from "../services/toast.js";

export class UserPageAbout {
    constructor() {
        this.overlayService = overlayService;
        this.httpService = httpService;
        this.toastService = toastService;
        this.fileArr = [];
        this.profileInput = document.querySelector('#upload-profile-photo');
        this.chatButton = document.querySelector('#userInfoChat');
        this.removeButton = document.querySelector('#userInfoRemove');
        this.blockButton = document.querySelector('#userInfoBlock');
        this.addButton = document.querySelector('#userInfoAdd');
        this.userInfoWrapper = document.querySelector('.user-info-wrapper');
        this.userInfoImg = document.querySelector('.user-info-img');
        this.conversationId = Number(this.userInfoWrapper.getAttribute('data-conversation-id'));
        this.userId = Number(this.userInfoWrapper.getAttribute('data-user-id'));
        this.mySelf = Number(this.userInfoWrapper.getAttribute('data-myself'));
        this.userFullName = this.userInfoWrapper.getAttribute('data-user-fullname');
        this.userName = this.userInfoWrapper.getAttribute('data-user-name');
        this.listeners();
    }

    listeners() {
        if (this.blockButton) {
            this.blockButton.addEventListener('click', () => {
                console.log('1');
                this.overlayService.openYouSure(`ნამდვილად გსურთ <b>${this.userFullName}</b>-ს დაბლოკვა?`)
                    .then(accepted => {
                        if (accepted) {
                            this.httpService.blockUser(this.userId)
                                .then(_ => {
                                    this.toastService.createSuccessToast(`თქვენ წარმატებით დაბლოკეთ <b>${this.userFullName}</b>`);
                                    setTimeout(() => {
                                        location.href = '/';
                                    }, 1000);
                                })
                        }
                    })
            })
        }
        if (this.removeButton) {
            this.removeButton.addEventListener('click', () => {
                this.overlayService.openYouSure(`ნამდვილად გსურთ <b>${this.userFullName}</b>-ს მეგობრებიდან წაშლა?`)
                    .then(accepted => {
                        if (accepted) {
                            this.httpService.unfriendUser(this.userId)
                                .then(_ => {
                                    this.toastService.createSuccessToast(`თქვენ წარმატებით წაშალეთ ${this.userFullName} მეგობრებიდან`);
                                    this.removeButton.style.display = 'none';
                                    this.chatButton.style.display = 'none';
                                    this.addButton.style.display = 'flex';
                                })
                        }
                    })
            })
        }

        if (this.addButton) {
            this.addButton.addEventListener('click', () => {
                this.httpService.sendRequest(this.userId).then(_ => {
                    this.toastService.createSuccessToast(`თქვენ წარმატებით გაუგზავნეთ <b>${this.userFullName}-ს მეგობრობის მოთხოვნა</b>`);
                    this.addButton.style.display = 'none';

                })
            })
        }

        if (this.chatButton) {
            this.chatButton.addEventListener('click', () => {
                this.overlayService.openChat(this.conversationId, this.userId, this.userFullName, this.userName);
            })
        }

        this.profileInput.addEventListener('change', async (ev) => {
            const fileList = ev.target.files;
            if(fileList) {
                const fileArray = Array.from(fileList);
                for (const file of fileArray) {
                    try {
                        this.fileArr.push(file);
                    } catch(err) {
                        console.log(err);
                    }
                }
                this.overlayService.openYouSure('ნამდვილად გსურთ ამ ფოტოს პროფილის ფოტოდ დაყენება?')
                .then(accepted => {
                    if(accepted) {
                        console.log(this.fileArr);
                        this.httpService.uploadProfile(this.fileArr).then(file_name => {
                            this.fileArr = [];
                            this.userInfoImg.src = `/files/users/${file_name}`;
                        })
                    } else {
                        console.log('ara');
                    }
                })
            }
            /*
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
                */
        })

    }
}