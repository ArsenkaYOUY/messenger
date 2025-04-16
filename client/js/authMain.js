'use strict'

import { setupPasswordToggle, setupFormSwitching } from "./ui/authUi.js";
import { setupFormHandlers } from "./handlers/formHandler.js";

document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector('.card');
    setTimeout(() => card.classList.add('show'), 50);

    setupPasswordToggle();
    setupFormSwitching();
    setupFormHandlers();
});
