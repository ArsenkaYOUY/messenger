'use strict'

document.addEventListener('DOMContentLoaded', async() => {
    const token = localStorage.getItem('token')
    if (!token) {
        window.location.replace('authorize.html')
    }
    else {
        try {
            console.log(token);
            const response = await fetch('http://localhost:3000/api/user/validate-token', {
                method: 'GET',
                headers: {
                    'authorization': `Bearer ${token}`
                }
            })
            if (!response.ok) {
                throw new Error('Invalid token!')
            }
            const data = await response.json()
            console.log('data:' +  JSON.stringify(data));
        }
        catch (error) {
            console.log(error);
            window.location.replace('authorize.html')
        }
    }
    document.querySelector('#app').classList.remove('hide');

})