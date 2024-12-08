import { initListeners } from "../listeners/index.js";
import overlayService from "../services/overlay.js";
import httpService from "../services/http.js";
import { Contacts } from "../general/contacts.js";
import { Header } from "../general/header.js";
import toastService from "../services/toast.js";
import { initSocket } from "../socket/socket.js";
class Home {
    constructor() {
        this.overlayService = overlayService;
        this.httpService = httpService;
        this.toastService = toastService;
        this.images = [];
        this.filesArr = [];
        this.filesInf = [];
        this.addPostHandler = this.addPostHandler.bind(this);
        this.fileContainer = document.querySelector('#filePreviews');
        this.uploadFileInput = document.querySelector('#upload-post-file');
        this.addPostInput = document.querySelector('#addPostInput');
        this.addPostButton = document.querySelector('#addPostButton');
        this.likeButtons = document.querySelectorAll('.post-card-like');
        this.unlikeButtons = document.querySelectorAll('.post-card-unlike');
        this.commentButtons = document.querySelectorAll('.post-card-comment');
        this.commentAddButtons = document.querySelectorAll('.post-card-comment-add');
        this.shareButtons = document.querySelectorAll('.post-card-share');
        this.swipperDots = document.querySelectorAll('.post-card-swipper-item');
        this.downloadButtons = document.querySelectorAll('.post-card-download');
        this.activeDot = 0;
        this.listeners();
    }

    listeners() {
        this.likeButtons.forEach(likeButton => {
            likeButton.addEventListener('click', () => {
                const likeIcon = likeButton.querySelector('i');
                const likeSpan = likeButton.nextElementSibling;
                let likeCount = Number(likeSpan.textContent);
                const postCard = likeButton.closest('.post-card');
                const unlikeButton = postCard.querySelector('.post-card-unlike');
                const unlikeIcon = unlikeButton.querySelector('i');
                const unlikeSpan = unlikeButton.nextElementSibling;
                const postId = Number(postCard.getAttribute('data-post-id'));
                this.httpService.manageLike(postId)
                    .then(response => {
                        const like = response.like;
                        if (like) {
                            likeCount++;
                            likeSpan.textContent = likeCount;
                            likeIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                            likeButton.setAttribute('liked', '1');
                            let unliked = unlikeButton.getAttribute('unliked');
                            if (unliked) {
                                let unLikeCount = Number(unliked);
                                if (unLikeCount > 0) {
                                    unLikeCount--;
                                    unlikeIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                                    unlikeSpan.textContent = unLikeCount;
                                    unlikeButton.setAttribute('unliked', '0');
                                }
                            }
                        } else {
                            likeCount--;
                            likeSpan.textContent = likeCount;
                            likeIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                            likeButton.setAttribute('liked', '0');
                        }
                    })
            })
        })

        this.unlikeButtons.forEach(unlikeButton => {
            unlikeButton.addEventListener('click', () => {
                const unlikeIcon = unlikeButton.querySelector('i');
                const unlikeSpan = unlikeButton.nextElementSibling;
                let unlikeCount = Number(unlikeSpan.textContent);
                const postCard = unlikeButton.closest('.post-card');
                const likeButton = postCard.querySelector('.post-card-unlike');
                const likeIcon = unlikeButton.querySelector('i');
                const likeSpan = unlikeButton.nextElementSibling;
                const postId = Number(postCard.getAttribute('data-post-id'));
                this.httpService.manageUnLike(postId)
                    .then(response => {
                        const unlike = response.unlike;
                        console.log(unlike)
                        if (unlike) {
                            unlikeCount++;
                            unlikeSpan.textContent = unlikeCount;
                            unlikeIcon.style.fontVariationSettings = "'FILL' 1, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                            unlikeButton.setAttribute('unliked', '1');
                            let liked = likeButton.getAttribute('liked');
                            if (liked) {
                                let LikeCount = Number(liked);
                                if (LikeCount > 0) {
                                    LikeCount--;
                                    likeIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                                    likeSpan.textContent = LikeCount;
                                    likeButton.setAttribute('liked', '0');
                                }
                            }
                        } else {
                            unlikeCount--;
                            unlikeSpan.textContent = unlikeCount;
                            unlikeIcon.style.fontVariationSettings = "'FILL' 0, 'wght' 100, 'GRAD' 200, 'opsz' 24";
                            unlikeButton.setAttribute('unliked', '0');
                        }
                    })
            })
        })

        this.commentButtons.forEach(commentButton => {
            commentButton.addEventListener('click', () => {
                const postCard = commentButton.closest('.post-card');
                const commentWrapper = postCard.querySelector('.post-card-add-comment');
                if (commentWrapper.style.display === 'none') {
                    commentWrapper.style.display = 'flex';
                } else {
                    commentWrapper.style.display = 'none';
                }
            })
        });

        this.commentAddButtons.forEach(commentAddButton => {
            const wrapper = commentAddButton.closest('.post-card-add-comment');
            const input = wrapper.querySelector('input');
            const postCard = commentAddButton.closest('.post-card');
            const postId = Number(postCard.getAttribute('data-post-id'));
            commentAddButton.addEventListener('click', () => {
                const content = input.value;
                this.httpService.addComment(postId, content)
                    .then(_ => {
                        this.toastService.createSuccessToast('თქვენი კომენტარი წარმატებით დაემატა');
                    })
            })
        })

        this.uploadFileInput.addEventListener('change', async (ev) => {
            const fileList = ev.target.files;
            this.fileContainer.style.display = 'flex';
            this.addPostInput.style.border = '1px solid #e5ecf1';
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

        this.swipperDots.forEach(swipperDot => {
            swipperDot.addEventListener('click', () => {
                const media_type = Number(swipperDot.getAttribute('data-media-type'));
                const media_name = swipperDot.getAttribute('data-media-name');
                const cardContent = swipperDot.closest('.post-card-content');
                const contentInner = cardContent.querySelector('.post-card-content-inner');
                const postCard = swipperDot.closest('.post-card');
                const downloadButton = postCard.querySelector('.post-card-download');
                this.updateDownloadFile(media_name, downloadButton);
                this.updateMainContent(media_type, media_name, contentInner);
                this.swipperDots.forEach(swipperDot => {
                    swipperDot.classList.remove('swipper-active');
                })

                swipperDot.classList.add('swipper-active');

            })
        })

        this.downloadButtons.forEach(downloadButton => {
            downloadButton.addEventListener('click', () => {
                const fileName = downloadButton.getAttribute('data-media-name');
                this.httpService.downloadPostFile(fileName);
            })
        });

        this.shareButtons.forEach(shareButton => {
            shareButton.addEventListener('click', () => {
                const postId = Number(shareButton.getAttribute('data-post-id'));
                this.overlayService.openYouSure('ნამდვილად გსურთ გაზიარება?', 'უარყოფა', 'დათანხმება');
            })
        })

        this.addPostButton.addEventListener('click', this.addPostHandler);
    }



    updateDownloadFile(media_name, element) {
        element.setAttribute('data-media-name', media_name);
    }

    updateMainContent(media_type, media_name, element) {
        let template;
        if (media_type === 1) {
            template = `<img src="/files/posts/${media_name}" class="post-card-content-img">`
        } else if (media_type === 2) {
            template = `<video width="100%" controls>
                            <source src="/files/posts/${media_name}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>`;
        } else {
            template = `<img src="/files/posts/file.png" class="post-card-content-img" style="width: 80px; height:40px;">
                <div class="post-card-content-file">${media_name}}</div>`
        }

        element.innerHTML = template;
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

    removeFile(index) {
        this.images.splice(index, 1);
        this.filesInf.splice(index, 1);
        this.filesArr.splice(index, 1);
        this.renderFilesPreview();

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

    async addPostHandler() {
        const content = this.addPostInput.value;
        if (content !== '' || this.images.length > 0) {
            try {
                if (this.images.length === 0) {
                    this.post = await this.httpService.addBasicPost(content);
                    this.toastService.createSuccessToast('თქვენი პოსტი წარმატებით გამოქვეყნდა!');
                } else {
                    this.post = await this.httpService.addFilePost(content, this.filesInf);
                    this.toastService.createSuccessToast('თქვენი პოსტი წარმატებით გამოქყვენდა!');
                }
            } finally {
                this.closePreview();
            }
        }
    }

    renderBasicPost() { }

    renderFilePost() { }

    closePreview() {
        this.fileContainer.style.display = 'none';
        this.addPostInput.style.border = 'none';
        this.addPostInput.style.borderBottom = '1px solid #e5ecf1';
        this.images = [];
        this.filesInf = [];
        this.filesArr = [];
    }
}

function init() {
    initListeners();
    initSocket();
    new Home();
    new Contacts();
    new Header();
}
document.addEventListener('DOMContentLoaded', init);