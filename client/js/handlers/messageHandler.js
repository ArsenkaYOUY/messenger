'use strict';

import { sendMessage } from '../services/sendMessage.js'
import { connectSocket, joinRoom } from '../services/socketsSetup.js'
import { renderChatMessages } from "../utils/renderChatItemUtils.js";
// import { updateChatPreview } from "../utils/renderChatItemUtils.js";

export function messageHandler(userId) {
    document.getElementById('send-message-button').addEventListener('click', () => {
        const inputEl = document.querySelector('.dialog-input');
        const message =  inputEl.value.trim();
        if (message) {
            const chatId = document.querySelector('.chat-item.active-chat').id
            console.log(chatId);
            sendMessage(chatId, message, userId)
            inputEl.value = '';
        }
    });
}

export function handleIncomingMessages(chatId, userId) {
    const socket = connectSocket(userId);

    joinRoom(chatId, userId);

    socket.on("chat_history", (data) => {
        if (data.chatId === chatId) {
            const isValidMessage = data.messages &&
                data.messages.content &&
                typeof data.messages.content === 'string';

            // Создаем массив из одного сообщения (если оно валидно)
            const messagesToRender = isValidMessage ? [data.messages] : [];

            console.log("История сообщений:", messagesToRender);
            renderChatMessages(messagesToRender);
        }
    });

    socket.on("new_message", (data) => {
        document.getElementById('es-no-messages').classList.add('hide');
        console.log("Новое сообщение:", data);
        if (data.chatId === chatId) {
            console.log("Новое сообщение в этом чате:", data.message);
            addMessageToChat(userId, data.message);
        }
        else {
            // уведомления и тд
        }
    });

}

function addMessageToChat(userId, message) {
    const messagesContainer = document.getElementById("messages-list");
    const messageElement = document.createElement("div");
    messageElement.className = `message ${message.senderId === userId ? 'my-message' : 'other-message'}`;
    messageElement.textContent = message.content;
    messagesContainer.appendChild(messageElement);
}