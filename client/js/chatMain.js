'use strict'

import { checkAuthSession } from "./services/checkAuthSession.js";
import { setupIconActiveStateSwitch, loadContent} from "./ui/chatUi.js";
import { setupAllEmptyStates} from "./ui/emptyStatesSetup.js";

document.addEventListener('DOMContentLoaded', async() => {
    await checkAuthSession();
    setupIconActiveStateSwitch();
    loadContent('chats')
    setupAllEmptyStates()

})