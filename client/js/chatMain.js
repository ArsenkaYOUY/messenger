'use strict'

import { setupCheckHandler } from './handlers/setupCheckHandler.js'

document.addEventListener('DOMContentLoaded', async() => {
    const res = await setupCheckHandler();
    if (!res.isValid) {
        // window.location.replace('authorize.html');
        return;
    }

    console.log('user data: ', res.user);

    document.querySelector('#app').classList.remove('hide');
})