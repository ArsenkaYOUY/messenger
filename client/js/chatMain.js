'use strict'

import { setupCheckHandler } from './handlers/setupCheckHandler.js'

document.addEventListener('DOMContentLoaded', async() => {
    const res = await setupCheckHandler();
    if (!res.isValid) {
        window.location.replace('authorize.html');
        return;
    }

    document.querySelector('#app').classList.remove('hide');
})