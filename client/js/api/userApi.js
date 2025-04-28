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

export async function getProfileInfo() {
    const token = localStorage.getItem('accessToken');
    const result = await fetch('http://localhost:3000/api/user/me', {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    return result;
}

/**
 * Универсальная функция для обновления данных профиля
 * @param {string} field - Поле для обновления (avatar, username, bio и т. д.)
 * @param {File|string} value - Новое значение (файл для аватарки или строка для других полей)
 * @returns {Promise<Response>} - Ответ сервера
 */
export async function updateProfileField(field, value) {
    const token = localStorage.getItem('accessToken');
    const url = `http://localhost:3000/api/user/updateProfile/${field}`;

    const isAvatar = field === 'avatar';
    const method = isAvatar ? 'POST' : 'PUT';

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    let body;

    if (isAvatar) {
        const formData = new FormData();
        formData.append('avatar', value);
        body = formData;
    } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({ value });
    }

    const response = await fetch(url, {
        method,
        headers,
        body
    });

    return response;
}