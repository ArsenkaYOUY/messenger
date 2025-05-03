'use strict'

import { checkAuthSession } from "./services/checkAuthSession.js";
import { setupIconActiveSectionSwitch, loadSectionContent, setupEditProfileInfo} from "./ui/chatUi.js";
import { setupAllEmptyStates} from "./ui/emptyStatesSetup.js";
import { searchUserHandler } from "./handlers/chatsSearchUserHandler.js"
import { getUserChats } from "./services/chatService.js"

document.addEventListener('DOMContentLoaded', async() => {
    await checkAuthSession();
    setupIconActiveSectionSwitch();
    loadSectionContent('chats')
    setupAllEmptyStates()
    searchUserHandler()
    await getUserChats()
})