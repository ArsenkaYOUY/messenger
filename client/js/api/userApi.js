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

export async function refreshTokenRequest() {
    const result = await fetch('http://localhost:3000/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
    })
    return result;
}