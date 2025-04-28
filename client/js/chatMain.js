'use strict'

import { checkAuthSession } from "./services/checkAuthSession.js";
import { setupIconActiveSectionSwitch, loadSectionContent, setupEditProfileInfo} from "./ui/chatUi.js";
import { setupAllEmptyStates} from "./ui/emptyStatesSetup.js";

document.addEventListener('DOMContentLoaded', async() => {
    await checkAuthSession();
    setupIconActiveSectionSwitch();
    loadSectionContent('profile')
    setupAllEmptyStates()
    setupEditProfileInfo()
})