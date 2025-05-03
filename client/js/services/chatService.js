'use strict'

import { getChats } from "../api/chatApi.js"
import { renderChatList } from "../utils/renderChatItemUtils.js"
import { checkAuthSession } from "./checkAuthSession.js";

export async function getUserChats() {
    try {
        await checkAuthSession();

        const noChatsEmptyState = document.getElementById('es-no-chats')

        const result = await getChats();
        const data = await result.json();
        if (data.success) {
            noChatsEmptyState.classList.add('hide');
            renderChatList(data.chats);
        }
        else {
            noChatsEmptyState.classList.remove('hide')
        }
    }
    catch (error) {

    }
}