'use strict'

export async function checkTokenRequest(token) {
    const result = await fetch('http://localhost:3000/api/user/validate-token', {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    return result;
}