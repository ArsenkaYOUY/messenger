'use strict'

import { searchUserService } from "../services/userService.js";
import { renderChatItem } from "../utils/renderChatItemUtils.js";

export function searchUserHandler() {
    const searchElement = document.getElementById('chats-search-user');

    // const chatsSkeletonElement = document.getElementById('chats-skeleton');
    // const chatsNotFoundEmptyStateElement = document.getElementById('chats-not-found-empty-state');
    //

    if (searchElement) {
        searchElement.addEventListener('input', async () => {
            // chatsSkeletonElement.classList.remove('hide');
            // chatsNotFoundEmptyStateElement.classList.add('hide');
            let input = searchElement.value.trim();

            // Добавляем @, если его нет в начале
            if (!input.startsWith('@')) {
                input = '@' + input;
            }

            try {
                const result = await searchUserService(input);
                console.log('result:', result);
                if (result.success) {
                    console.log(result.userData)
                    const userData = result.userData;
                    renderChatItem(userData);
                } else {
                    console.log(result.errorMessage);
                    // chatsNotFoundEmptyStateElement.classList.remove('hide');
                }
            }
            catch (error) {
                console.log(error);
            }
            finally {
                // chatsSkeletonElement.classList.add('hide');
            }

        });
    }
}