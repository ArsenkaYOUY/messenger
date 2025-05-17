'use strict';

import { sendMessage } from '../services/sendMessage.js'
import { connectSocket, joinRoom } from '../services/socketsSetup.js'
// import { updateChatPreview } from "../utils/renderChatItemUtils.js";

export function sendMessageHandler(userId) {
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

            const messagesToRender = isValidMessage ? [data.messages] : [];

            console.log("История сообщений:", messagesToRender);
            renderChatMessages(userId,messagesToRender);
        }
    });

    let hasMessages = false;
    const emptyStateElement = document.getElementById('es-no-messages');

    socket.on("new_message", (data) => {
        if (!hasMessages && emptyStateElement) {
            emptyStateElement.classList.add('hide');
            hasMessages = true;
        }

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

const messagesList = document.getElementById('messages-list');

function addMessageToChat(userId, message) {
    const messageElement = createMessageElement(userId,message);
    // messageElement.className = `message ${message.senderId === userId ? 'my-message' : 'other-message'}`;
    // messageElement.textContent = message.content;

    messagesList.appendChild(messageElement);
}

let lastMessageDate = '';

function renderChatMessages(userId,messages) {
    clearMessages()

    const noMessagesEmptyState = document.getElementById('es-no-messages')
        noMessagesEmptyState.classList.add('hide');

    const isEmpty = !Array.isArray(messages) || messages.length === 0;

    if (isEmpty) {
        if (noMessagesEmptyState)
            noMessagesEmptyState.classList.remove('hide');
        return;
    }

    const messagesContainer = document.getElementById('messages-container');
    messagesList.innerHTML = '';
    messagesContainer.classList.remove('hide');

    const fragment = document.createDocumentFragment();

    lastMessageDate = '';
    messages.forEach(message => {
        const messageElement = createMessageElement(userId,message);
        fragment.appendChild(messageElement);
    });

    messagesList.appendChild(fragment);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    function clearMessages() {
        messagesList.innerHTML = '';
    }
}

function createMessageElement(userId, message) {
    console.log('createMessageElement', message);

    const messageDate = new Date(message.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    const messageTime = new Date(message.created_at).toLocaleTimeString(['ru-RU'], { hour: '2-digit', minute: '2-digit' });

    const fragment = document.createDocumentFragment();

    // Добавляем дату, если она отличается от последней сохраненной
    if (messageDate !== lastMessageDate) {
        const dateElement = document.createElement('div');
        dateElement.className = 'message-date';
        dateElement.textContent = messageDate;
        fragment.appendChild(dateElement);
        lastMessageDate = messageDate;
    }

    // Создаем основной контейнер сообщения
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.senderId === userId ? 'my-message' : 'other-message'}`;
    messageDiv.innerHTML = `
        ${message.full_name ? `<div class="message-sender">${message.full_name}</div>` : ''}
        <div class="message-content">${message.content}</div>
        <div class="message-time">${messageTime}</div>
    `;

    fragment.appendChild(messageDiv);
    return fragment;
}
