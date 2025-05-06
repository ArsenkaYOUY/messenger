'use strict'

import { getChats } from "../api/chatApi.js"
import { renderChatList } from "../utils/renderChatItemUtils.js"
import { checkAuthSession } from "./checkAuthSession.js";

export async function getUserChats() {
    const noChatsEmptyState = document.getElementById('es-no-chats')
    const skeletonElement = document.getElementById('search-skeleton-container');

    try {
        await checkAuthSession();

        if (noChatsEmptyState)
            noChatsEmptyState.classList.add('hide');

        if (skeletonElement)
            skeletonElement.classList.remove('hide');

        const result = await getChats();
        const data = await result.json();
        if (data.success) {
            renderChatList(data.chats);
            if (skeletonElement)
                skeletonElement.classList.add('hide');
        }
        else {
            if (noChatsEmptyState)
                noChatsEmptyState.classList.remove('hide');
            if (skeletonElement)
                skeletonElement.classList.add('hide');

        }
    }
    catch (error) {
        console.error(error);
        noChatsEmptyState.classList.remove('hide')
    }
}