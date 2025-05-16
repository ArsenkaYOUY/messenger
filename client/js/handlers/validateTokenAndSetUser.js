'use strict'

import { manipulateUserToken } from "../services/userService.js";

export async function validateTokenAndSetUser() {
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
        localStorage.setItem('userData', JSON.stringify(userData));


        return {
            isValid: true
        };

    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        return { isValid: false };
    }
}