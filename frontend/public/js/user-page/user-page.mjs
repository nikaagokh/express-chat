import { initListeners } from "../listeners/index.js";
import { initSocket } from "../socket/socket.js";
import { Contacts } from "../general/contacts.js";
import { Header } from "../general/header.js";
import { UserPageAbout } from "./user-page-about.js";
import { Posts } from "../general/posts.js";

function init() {
    initListeners();
    initSocket();
    new Posts();
    new UserPageAbout();
    new Contacts();
    new Header();
}

document.addEventListener('DOMContentLoaded', init);