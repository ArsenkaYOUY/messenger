'use strict'

import { manipulateUserToken } from "../services/userService.js";

export async function setupCheckHandler() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return { isValid: false };
    }
    try {
        const response = await manipulateUserToken(accessToken);

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