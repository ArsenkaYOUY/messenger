'use strict'

import { searchUserService } from "../services/userService.js";
import { renderFoundedUserItem } from "../utils/renderChatItemUtils.js";
import { cleanFoundedUsers } from "../utils/renderChatItemUtils.js";

export async function searchUserHandler() {
    const searchElement = document.getElementById('chats-search-user');
    const notFoundElement = document.getElementById('es-user-not-found');
    const skeletonElement = document.getElementById('search-skeleton-container');

    let searchTimeout = null;

    if (searchElement) {
        searchElement.addEventListener('input', () => {
            // Очищаем предыдущий таймаут
            clearTimeout(searchTimeout);

            // Устанавливаем новый таймаут
            searchTimeout = setTimeout(async () => {
                if (skeletonElement)
                    skeletonElement.classList.remove('hide')

                if (notFoundElement)
                    notFoundElement.classList.add('hide')

                document.getElementById('my-chats-list').classList.add('hide');

                let input = searchElement.value.trim();

                if (input === '') {
                    await cleanFoundedUsers();
                    return;
                }

                // Добавляем @, если его нет в начале
                if (!input.startsWith('@')) {
                    input = '@' + input;
                }

                try {
                    setTimeout( async () => {
                        const result = await searchUserService(input);
                        console.log('result:', result);

                        if (result.success) {
                            console.log(result.userData);
                            notFoundElement.classList.add('hide');
                            const userData = result.userData;
                            console.log(userData)
                            renderFoundedUserItem(userData);
                            if (skeletonElement)
                                skeletonElement.classList.add('hide')
                        } else {
                            console.log(result.errorMessage);
                            if (skeletonElement)
                                skeletonElement.classList.add('hide')
                            if (document.getElementById('founded-users-list').children.length === 0) {
                                notFoundElement.classList.remove('hide');
                            }
                        }
                    }, 300)
                }
                catch (error) {
                    console.log(error);
                    notFoundElement.classList.remove('hide');
                }
            }, 300); // Задержка 300 мс
        });
    }
}
