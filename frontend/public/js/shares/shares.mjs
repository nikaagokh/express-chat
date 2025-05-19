import { initListeners } from "../listeners/index.js";
import { Contacts } from "../general/contacts.js";
import { Header } from "../general/header.js";
import { initSocket } from "../socket/socket.js";
import { Posts } from "../general/posts.js";


function init() {
    initListeners();
    initSocket();
    new Posts();
    new Contacts();
    new Header();
}
document.addEventListener('DOMContentLoaded', init);