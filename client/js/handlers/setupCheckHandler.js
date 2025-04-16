'use strict'

import { checkUserToken } from "../services/userService.js";

export async function setupCheckHandler() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
        return { isValid: false };
    }
    try {
        const response = await checkUserToken(token);

        console.log(response);
        console.log(JSON.stringify(response));
        if (!response.ok) {
            throw new Error('Token is invalid');
        }

        const userData = await response.json();
        return {
            isValid: true,
            user: userData
        };

    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return { isValid: false };
    }
}