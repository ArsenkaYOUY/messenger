'use strict'

import { searchUserService } from "../services/userService.js";
import { renderFoundedUserItem } from "../utils/renderChatItemUtils.js";
import { cleanFoundedUsers } from "../utils/renderChatItemUtils.js";

export function searchUserHandler() {
    const searchElement = document.getElementById('chats-search-user');
    const notFoundElement = document.getElementById('es-user-not-found');
    let searchTimeout = null;

    if (searchElement) {
        searchElement.addEventListener('input', () => {
            // Очищаем предыдущий таймаут
            clearTimeout(searchTimeout);

            // Устанавливаем новый таймаут
            searchTimeout = setTimeout(async () => {
                let input = searchElement.value.trim();

                if (input === '') {
                    cleanFoundedUsers();
                    return;
                }

                // Добавляем @, если его нет в начале
                if (!input.startsWith('@')) {
                    input = '@' + input;
                }

                try {
                    const result = await searchUserService(input);
                    console.log('result:', result);
                    document.getElementById('my-chats-list').classList.add('hide');

                    if (result.success) {
                        console.log(result.userData);
                        notFoundElement.classList.add('hide');
                        const userData = result.userData;
                        renderFoundedUserItem(userData);
                    } else {
                        console.log(result.errorMessage);
                        if (document.getElementById('founded-users-list').children.length === 0) {
                            notFoundElement.classList.remove('hide');
                        }
                    }
                }
                catch (error) {
                    console.log(error);
                    notFoundElement.classList.remove('hide');
                }
            }, 300); // Задержка 300 мс
        });
    }
}