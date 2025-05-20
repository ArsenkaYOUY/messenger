import {sendMessage} from "../services/socketsSetup.js";
import { addMessageToChat } from "./socketEventsHandler.js";

export function sendMessageHandler(userId) {
    document.getElementById('send-message-button').addEventListener('click', () => {
        const inputEl = document.querySelector('.dialog-input');
        const message =  inputEl.value.trim();
        if (message) {
            const chatElement = document.querySelector('.chat-item.active-chat')
            const chatId = chatElement.id
            const isGroupChat = chatElement.dataset.isGroup === 'true';
            sendMessage(chatId, isGroupChat, message, userId)
            inputEl.value = '';
        }
    });
}