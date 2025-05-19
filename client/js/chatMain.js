'use strict'

import { checkAuthSession } from "./services/checkAuthSession.js";
import { setupIconActiveSectionSwitch, loadSectionContent, setupEditProfileInfo} from "./ui/chatUi.js";
import { setupAllEmptyStates} from "./ui/emptyStatesSetup.js";
import { setupSendMessageInput } from "./ui/chatUi.js";

import { searchUserHandler } from "./handlers/chatsSearchUserHandler.js"
import { getUserChats } from "./services/chatService.js"
import { chatItemClickHandler } from "./handlers/chatItemClickHandler.js";
import { connectSocket } from "./services/socketsSetup.js"
import { sendMessageHandler } from "./handlers/sendMessageHandler.js";

document.addEventListener('DOMContentLoaded', async() => {
    await checkAuthSession();
    setupIconActiveSectionSwitch();
    loadSectionContent('chats')
    setupAllEmptyStates()
    const userData = JSON.parse(localStorage.getItem('userData'));
    const { userId } = userData;
    console.log(userData);
    connectSocket(userId);
    sendMessageHandler(userId);
    searchUserHandler()
    await getUserChats()
    chatItemClickHandler(userId);
    setupSendMessageInput();
})