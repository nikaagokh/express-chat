
import toastService from "./toast.js";
import authService from "./auth.js";
import httpService from "./http.js";
/*
import { Chat } from "../chat.js";
import { AdminChat } from "../adminchat.js";
import { ChatInfo } from "../chat-info.js";
import { ChatGroup } from "../chat-group.js";
import { YouSure } from "../you-sure.js";
import { Communication } from "../communication.js";
import { ChatDocs } from "../chat-file.js";
*/

import { IndexReactions } from "../index/index-reactions.js";
import { Chat } from "../general/chat.js";
import { AddGroup } from "../general/add-group.js";
import { YouSure } from "../general/yousure.js";
import { ChatInfo } from "../general/chat-info.js";
import { ImageZoom } from "../general/imagezoom.js";
import { ChatDocs } from "../general/chat-docs.js";
import { FriendsMenu } from "../friends/friends-menu.js";
import { SendRequestsMenu } from "../outgoing-requests/send-requests-menu.js";
import { ReceiveRequestsMenu } from "../ingoing-requests/receive-requests-menu.js";

class OverlayService {
    constructor() {
        this.authService = authService;
        this.toastService = toastService;
        this.httpService = httpService;
        /*
        this.chatState = new BehaviorSubject(false);
        this.communicationState = new BehaviorSubject(false);
        */
        this.addGroupOverlay = null;
        this.spinner = null;
        this.globalSpinnerWrapper = null;
        this.globalSpinnerBackdrop = null;
        this.authOverlay = null;
        this.chatOverlay = null;
        this.communicationOverlay = null;
        this.chatInfo = null;
        this.chatGroup = null;
        this.chatImages = null;
        this.chatDocs = null;
        this.friendsMenuOverlay = null;
        this.sendRequestsMenuOverlay = null;
        this.receiveRequestsMenuOverlay = null;
        this.registerOverlay = null;
        this.userReactions = null;
        this.youSureBox = null;
        this.overlayContainer = document.querySelector(".overlay-container");
        this.spinnerTemplate = `<svg class="spinner" width="35px" height="35px" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
                                   <circle class="spinner-path" fill="none" stroke-width="6" stroke-linecap="round" cx="33" cy="33" r="30"></circle>
                                </svg>`;
        this.mobsize = !window.matchMedia("(min-width:992px)").matches;
        window.matchMedia("(min-width:992px)").addEventListener("change", (mq) => {
            if (mq.matches) {
                this.mobsize = false;
            } else {
                this.mobsize = true;
            }
        });

    }

    openAddGroup() {
        if (!this.addGroupOverlay) {
            const { globalWrapper, dialogBackdrop, dialogComponent } = this.createDialog();
            this.addGroupOverlay = new AddGroup();
            dialogComponent.appendChild(this.addGroupOverlay.element);
            globalWrapper.appendChild(dialogComponent);
            this.disableScroll();
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
        } else {
            this.addGroupOverlay.detach();
            this.addGroupOverlay = null;
        }
    }

    openUserReactions(type) {
        if (!this.userReactions) {
            const { globalWrapper, dialogBackdrop, dialogComponent } = this.createDialog();
            const userReactions = new IndexReactions(type);
            dialogComponent.appendChild(userReactions.element);
            globalWrapper.appendChild(dialogComponent)
            this.disableScroll();
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
            userReactions.close$.addEventListener('closed', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
            })
            dialogBackdrop.addEventListener('click', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
            })
        }
    }

    openGlobalSpinner() {
        if (!this.globalSpinnerBackdrop && !this.globalSpinnerWrapper) {
            this.globalSpinnerWrapper = document.createElement("div");
            const spinnerWrapper = document.createElement("div");
            spinnerWrapper.classList.add("spinner-wrapper")
            this.globalSpinnerWrapper.classList.add("overlay-wrapper");
            this.globalSpinnerWrapper.classList.add("overlay-wrapper-dialog")
            this.globalSpinnerBackdrop = document.createElement("div");
            this.globalSpinnerBackdrop.classList.add("dialog-backdrop");
            spinnerWrapper.innerHTML = this.spinnerTemplate;
            this.globalSpinnerWrapper.appendChild(spinnerWrapper);

            this.globalSpinnerBackdrop.addEventListener("click", () => {
                this.overlayContainer.removeChild(this.globalSpinnerBackdrop);
                this.overlayContainer.removeChild(this.globalSpinnerWrapper);
                this.globalSpinnerBackdrop = null;
                this.globalSpinnerWrapper = null;
            })
            this.overlayContainer.appendChild(this.globalSpinnerBackdrop);
            this.overlayContainer.appendChild(this.globalSpinnerWrapper);


        }
    }

    closeGlobalSpinner() {
        if (this.globalSpinnerWrapper && this.globalSpinnerBackdrop) {
            this.overlayContainer.removeChild(this.globalSpinnerBackdrop);
            this.overlayContainer.removeChild(this.globalSpinnerWrapper);
            this.globalSpinnerBackdrop = null;
            this.globalSpinnerWrapper = null;
        }
    }


    createDialog() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-dialog");
        const dialogBackdrop = document.createElement("div");
        dialogBackdrop.classList.add("dialog-backdrop");
        const dialogComponent = document.createElement("div");
        return { globalWrapper, dialogBackdrop, dialogComponent };
    }

    clearOverlay() {
        while (this.overlayContainer.firstChild) {
            this.overlayContainer.removeChild(this.overlayContainer.firstChild)
        }
    }

    async openLogout() {
        const store = await this.fetchStore('logout');
        console.log(store);
        const { globalWrapper, dialogBackdrop, dialogComponent } = this.createDialog();
        const logout = new Logout(store);
        dialogComponent.appendChild(logout.element);
        globalWrapper.appendChild(dialogComponent)
        disableScroll();
        this.overlayContainer.appendChild(dialogBackdrop);
        this.overlayContainer.appendChild(globalWrapper);
        dialogBackdrop.addEventListener("click", () => {
            enableScroll();
            globalWrapper.remove();
            dialogBackdrop.remove();
        })
        logout.stay$.addEventListener("stay", () => {
            enableScroll();
            globalWrapper.remove();
            dialogBackdrop.remove();
        })
        logout.logout$.addEventListener("logout", () => {
            this.toastService.createSuccessToast('თქვენ წარმატებით გახვედით სისტემიდან');
            this.authService.logout();
            setTimeout(() => {
                const lang = lng();
                window.location.href = `/${lang}/`;
                this.authService.logout();
            }, 1000);
        })
    }

    openCommunication(userId, userIdentity) {
        this.authService.isAuthenticated().then(isAuth => {
            if (!this.mobsize && !isAuth) {
                if (!this.communicationOverlay) {
                    console.log(userId);
                    console.log(userIdentity)
                    const { globalWrapper, overlayBackDrop, chatComponent } = this.createChatOverlay();
                    this.communicationOverlay = new Communication(userId, userIdentity);
                    chatComponent.appendChild(this.communicationOverlay.element);
                    this.chatState.value ? chatComponent.classList.add('communication-margin') : undefined;
                    globalWrapper.appendChild(chatComponent);
                    //this.overlayContainer.appendChild(overlayBackDrop);
                    this.overlayContainer.appendChild(globalWrapper);
                    disableScroll();
                    this.communicationState.next(true);
                    overlayBackDrop.addEventListener("click", () => {
                        enableScroll();
                        globalWrapper.remove();
                        overlayBackDrop.remove();
                        this.communicationOverlay.detach();
                        this.communicationOverlay = null;
                        this.communicationState.next(false);
                    })

                    this.communicationOverlay.close$.addEventListener('closed', () => {
                        enableScroll();
                        globalWrapper.remove();
                        overlayBackDrop.remove();
                        this.communicationOverlay.detach();
                        this.communicationOverlay = null;
                        this.communicationState.next(false);
                    })


                }
            }
        });
    }

    openChat(conversationId, userId, userFullName, userName) {
        if (!this.chatOverlay) {
            const { globalWrapper, overlayBackDrop, chatComponent } = this.createChatOverlay();
            this.chatOverlay = new Chat(conversationId, userId, userFullName, userName);
            chatComponent.appendChild(this.chatOverlay.element);
            globalWrapper.appendChild(chatComponent);
            this.overlayContainer.appendChild(overlayBackDrop);
            this.overlayContainer.appendChild(globalWrapper);
            this.disableScroll();
            this.chatOverlay.close$.addEventListener('closed', () => {
                this.chatOverlay = null;
                this.enableScroll();
                globalWrapper.remove();
                overlayBackDrop.remove();
            })
            overlayBackDrop.addEventListener('click', () => {
                this.chatOverlay = null;
                this.enableScroll();
                globalWrapper.remove();
                overlayBackDrop.remove();
            })
        } else {
            this.chatOverlay.detach();
            this.chatOverlay = null;
        }

        /*
       */
    }

    openChatZoom(conversationId, fileName) {
        if (!this.imageZoom) {
            const { dialogBackdrop, dialogComponent, globalWrapper } = this.createDialog();
            this.imageZoom = new ImageZoom(fileName, conversationId);
            dialogComponent.appendChild(this.imageZoom.element);
            globalWrapper.appendChild(dialogComponent);
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
            this.disableScroll();
            dialogBackdrop.addEventListener('click', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.imageZoom.detach();
                this.imageZoom = null;
            })
            this.imageZoom.close$.addEventListener('closed', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.imageZoom.detach();
                this.imageZoom = null;
            })
        } else {
            this.imageZoom.detach();
            this.imageZoom = null;
        }
    }

    openChatInfo(chatHeader, conversationId, userName, chatType = 1) {
        if (!this.chatInfo) {
            console.log(userName);
            this.chatInfo = new ChatInfo(chatType, userName);
            chatHeader.appendChild(this.chatInfo.element);
            this.chatInfo.close$.addEventListener('closed', () => {
                chatHeader.removeChild(this.chatInfo.element);
                this.chatInfo = null;
            });
            this.chatInfo.chatImages$.addEventListener('images', () => {
                this.chatInfo.detach();
                this.openChatZoom(conversationId, '');
            });
            this.chatInfo.chatDocs$.addEventListener('docs', () => {
                this.chatInfo.detach();
                this.openChatDocs(conversationId);
            })
        }
    }

    openChatDocs(conversationId) {
        if (!this.chatDocs) {
            const { dialogBackdrop, dialogComponent, globalWrapper } = this.createDialog();
            this.chatDocs = new ChatDocs(conversationId);
            dialogComponent.appendChild(this.chatDocs.element);
            globalWrapper.appendChild(dialogComponent);
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
            this.disableScroll();
            dialogBackdrop.addEventListener('click', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.chatDocs.detach();
                this.chatDocs = null;
                console.log('1234');
            })

            this.chatDocs.close$.addEventListener('closed', () => {
                this.enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.chatDocs.detach();
                this.chatDocs = null;
            })



        }
    }

    openReceiveRequestsMenu(listItem, userId, userName) {
        if(!this.receiveRequestsMenuOverlay) {
            this.receiveRequestsMenuOverlay = new ReceiveRequestsMenu(userId, userName);
            listItem.appendChild(this.receiveRequestsMenuOverlay.element);
            this.receiveRequestsMenuOverlay.notifier.addEventListener('detach', () => {
                listItem.removeChild(this.receiveRequestsMenuOverlay.element);
                this.receiveRequestsMenuOverlay = null;
            });
            this.receiveRequestsMenuOverlay.accept$.addEventListener('accepted', () => {
                this.httpService.acceptRequest(userId)
                .then(_ => {
                    listItem.remove();
                    this.toastService.showToast(`თქვენ დაეთანხმეთ მეგობრობას მოთხოვნას`);
                    this.receiveRequestsMenuOverlay.detach();
                })
            });

            this.receiveRequestsMenuOverlay.decline$.addEventListener('declined', () => {
                this.httpService.declineRequest(userId)
                .then(_ => {
                    listItem.remove();
                    this.toastService.showToast(`თქვენ გააუქმეთ მეგობრობას მოთხოვნა`);
                    this.receiveRequestsMenuOverlay.detach();
                })
            })
        } else {
            this.receiveRequestsMenuOverlay.detach();
            this.receiveRequestsMenuOverlay = null;
        }
    }

    openSendRequestsMenu(listItem, userId, userName) {
        console.log(this.sendRequestsMenuOverlay);
        if(!this.sendRequestsMenuOverlay) {
            this.sendRequestsMenuOverlay = new SendRequestsMenu(userId, userName);
            listItem.appendChild(this.sendRequestsMenuOverlay.element);
            this.sendRequestsMenuOverlay.notifier.addEventListener('detach', () => {
                listItem.removeChild(this.sendRequestsMenuOverlay.element);
                this.sendRequestsMenuOverlay = null;
            });
            this.sendRequestsMenuOverlay.unsend$.addEventListener('unsended', () => {
                console.log('aert');
                this.openYouSure('ნამდვილად გსურთ მეგობრობის მოთხოვნის წაშლა?', 'უარყოფა', 'დათანხმება').then(accepted => {
                    if(accepted) {
                        this.httpService.unSendRequest(userId).then(_ => {
                            listItem.remove();
                            this.toastService.showToast(`თქვენ გააუქმეთ მეგობრობას მოთხოვნა`);
                        });
                    }
                })
            })
        } else {
            this.sendRequestsMenuOverlay.detach();
            this.sendRequestsMenuOverlay = null;
        }
    }

    openFriendsMenu(listItem, userId, userName) {
        console.log(this.friendsMenuOverlay);
        if(!this.friendsMenuOverlay) {
            this.friendsMenuOverlay = new FriendsMenu(userId, userName);
            listItem.appendChild(this.friendsMenuOverlay.element);
            this.friendsMenuOverlay.notifier.addEventListener('detach', () => {
                listItem.removeChild(this.friendsMenuOverlay.element);
                this.friendsMenuOverlay = null;
            });
            this.friendsMenuOverlay.unfriend$.addEventListener('unfriended', () => {
                this.openYouSure('ნამდვილად გსურთ ამ მომხმარებლის მეგობრებიდან წაშლა?', 'უარყოფა', 'დათანხმება').then(accepted => {
                    if(accepted) {
                        this.httpService.unfriendUser(userId).then(_ => {
                            listItem.remove();
                            this.toastService.showToast(`თქვენ წაშალეთ მომხმარებელი მეგობრებიდან`);
                        });
                    }
                })
            });
            this.friendsMenuOverlay.block$.addEventListener('blocked', () => {
                this.openYouSure('ნამდვილად გსურთ ამ მომხმარებლის დაბლოკვა?', 'უარყოფა', 'დათანხმება').then(accepted => {
                    if(accepted) {
                        this.httpService.blockUser(userId).then(_ => {
                            listItem.remove();
                            this.toastService.showToast(`თქვენ დაბლოკეთ ეს მომხმარებელი`);
                        });
                    }
                })
            })
        } else {
            this.friendsMenuOverlay.detach();
            this.friendsMenuOverlay = null;
        }
    }

    async openYouSure(message = 'ნამდვილად გსურთ პირადი კაბინეტიდან გასვლა?', decline = 'დარჩენა', accept = 'გასვლა') {
        return new Promise((resolve, reject) => {
            if (!this.youSureBox) {
                const { globalWrapper, dialogBackdrop, dialogComponent } = this.createDialog();
                this.youSureBox = new YouSure(message, decline, accept);
                dialogComponent.appendChild(this.youSureBox.element);
                globalWrapper.appendChild(dialogComponent);
                this.disableScroll();
                this.overlayContainer.appendChild(dialogBackdrop);
                this.overlayContainer.appendChild(globalWrapper);
                dialogBackdrop.addEventListener('click', () => {
                    this.youSureBox = null;
                    this.enableScroll();
                    globalWrapper.remove();
                    dialogBackdrop.remove();
                    resolve(false);
                })
                this.youSureBox.accept$.addEventListener('accepted', () => {
                    this.youSureBox = null;
                    this.enableScroll();
                    globalWrapper.remove();
                    dialogBackdrop.remove();
                    resolve(true);
                })
                this.youSureBox.decline$.addEventListener('declined', () => {
                    this.youSureBox = null;
                    this.enableScroll();
                    globalWrapper.remove();
                    dialogBackdrop.remove();
                    resolve(false);
                })
            } else {
                this.youSureBox = null;
            }
        })
    }

    open(message, decline, accept, cb = null) {
        if (!this.youSureBox) {
            const { globalWrapper, dialogBackdrop, dialogComponent } = this.createDialog();
            this.youSureBox = new YouSure(message, decline, accept);
            dialogComponent.appendChild(this.youSureBox.element);
            globalWrapper.appendChild(dialogComponent);
            disableScroll();
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
            dialogBackdrop.addEventListener('click', () => {
                this.youSureBox = null;
                dialogBackdrop.remove();
                globalWrapper.remove();
            })

            this.youSureBox.accept$.addEventListener('accepted', () => {
                this.youSureBox = null;
                dialogBackdrop.remove();
                globalWrapper.remove();
                cb();
            });

            this.youSureBox.decline$.addEventListener('declined', () => {
                this.youSureBox = null;
                dialogBackdrop.remove();
                globalWrapper.remove();
                cb();
            })
        }

    }

    openChatGroup(conversationId) {
        if (!this.chatGroup) {
            const { dialogBackdrop, dialogComponent, globalWrapper } = this.createDialog();
            this.chatGroup = new ChatGroup(conversationId);
            dialogComponent.appendChild(this.chatGroup.element);
            globalWrapper.appendChild(dialogComponent);
            this.overlayContainer.appendChild(dialogBackdrop);
            this.overlayContainer.appendChild(globalWrapper);
            disableScroll();
            dialogBackdrop.addEventListener('click', () => {
                enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.chatGroup.detach();
                this.chatGroup = null;
            })

            this.chatGroup.close$.addEventListener('closed', () => {
                enableScroll();
                globalWrapper.remove();
                dialogBackdrop.remove();
                this.chatGroup.detach();
                this.chatGroup = null;
            })

            this.chatGroup.comm$.addEventListener('commed', (ev) => {
                const { userId, userIdentity } = ev.detail;

                globalWrapper.remove();
                dialogBackdrop.remove();
                this.chatGroup.detach();
                this.chatGroup = null;
                this.openCommunication(userId, userIdentity);


            })

        }
    }

    createChatOverlay() {
        const globalWrapper = document.createElement('div');
        globalWrapper.classList.add('overlay-wrapper');
        globalWrapper.classList.add("overlay-chat-container");
        const randId = Math.floor(Math.random() * 900) + 100;
        globalWrapper.id = `overlay-pane-${randId}`;
        const overlayBackDrop = document.createElement('div');
        overlayBackDrop.classList.add('dialog-backdrop');
        const chatComponent = document.createElement('div');
        chatComponent.classList.add('overlay-pane');
        chatComponent.classList.add('overlay-chat-component');
        return { chatComponent, globalWrapper, overlayBackDrop };
    }

    createSideOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__menu-mobile-panel");
        const randId = Math.floor(Math.random() * 900) + 100;
        globalWrapper.id = `overlay-pane-${randId}`;
        const overlayBackDrop = document.createElement("div");
        overlayBackDrop.classList.add("overlay-container__menu-mobile-backdrop");
        return { globalWrapper, overlayBackDrop };
    }

    createDialog() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-dialog");
        const dialogBackdrop = document.createElement("div");
        dialogBackdrop.classList.add("dialog-backdrop");
        const dialogComponent = document.createElement("div");
        dialogComponent.classList.add("overlay-pane");
        dialogComponent.classList.add("overlay-pane-dialog");
        const randId = Math.floor(Math.random() * 900) + 100;
        dialogComponent.id = `overlay-pane-${randId}`;
        return { globalWrapper, dialogBackdrop, dialogComponent };
    }

    createSideOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__menu-mobile-panel");
        const randId = Math.floor(Math.random() * 900) + 100;
        globalWrapper.id = `overlay-pane-${randId}`;
        const overlayBackDrop = document.createElement("div");
        overlayBackDrop.classList.add("overlay-container__menu-mobile-backdrop");
        return { globalWrapper, overlayBackDrop };
    }

    createFullOverlay() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-container__full")
    }

    createBottom() {
        const globalWrapper = document.createElement("div");
        globalWrapper.classList.add("overlay-wrapper");
        globalWrapper.classList.add("overlay-wrapper-bottom");
        const bottomBackdrop = document.createElement("div");
        bottomBackdrop.classList.add("dialog-backdrop");
        const bottomComponent = document.createElement("div");
        bottomComponent.classList.add("overlay-pane");
        bottomComponent.classList.add("overlay-pane-bottom");
        const randId = Math.floor(Math.random() * 900) + 100;
        bottomComponent.id = `overlay-pane-${randId}`;
        return { globalWrapper, bottomBackdrop, bottomComponent };
    }

    focusInput() {
        const inp = document.querySelector('.header__input-search');
        inp.focus();
    }

    disableScroll() {
        const scrollPosition = window.scrollY || document.documentElement.scrollTop;
        document.body.dataset.scrollPosition = scrollPosition;
        document.body.classList.toggle("body-scroll-block");
        document.body.style.top = `-${scrollPosition}px`;
    }

    enableScroll() {
        const scrollPosition = parseInt(document.body.dataset.scrollPosition || '0', 10);
        document.body.classList.toggle("body-scroll-block");
        document.body.style.top = '';
        window.scrollTo({
            top: scrollPosition,
            left: 0,
            behavior: 'instant'
        });
        delete document.body.dataset.scrollPosition;
    }


}

const overlayService = new OverlayService();
export default overlayService;