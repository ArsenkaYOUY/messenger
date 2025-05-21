import {sendMessage} from "../services/socketsSetup.js";
import {updateChatPreview} from "../utils/renderChatItemUtils.js";

const noMessagesEmptyState = document.getElementById('es-no-messages');
let isFirstMessage = true;

export function sendMessageHandler(userId) {
    document.getElementById('send-message-button').addEventListener('click', () => {
        const inputEl = document.querySelector('.dialog-input');
        const message =  inputEl.value.trim();
        if (message) {
            const chatElement = document.querySelector('.chat-item.active-chat')
            const chatId = chatElement.id
            const isGroupChat = chatElement.dataset.isGroup === 'true';
            sendMessage(chatId, isGroupChat, message, userId)
            updateChatPreview(chatId, message, Date.now());
            inputEl.value = '';
        }
        if (isFirstMessage) {
            if (noMessagesEmptyState)
                noMessagesEmptyState.classList.add('hide');
        }
        isFirstMessage = false;
    });
}