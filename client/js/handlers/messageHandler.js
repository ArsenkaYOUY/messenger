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

export function socketEventsHandler(chatId, userId) {
    const socket = connectSocket(userId,chatId);

    joinRoom(chatId, userId);

    socket.on("chat_history", (data) => {
        if (data.chatId === chatId) {
            const { messages } = data;
            console.log(messages)
            renderChatMessages(userId,messages);
        }
    });

    let hasMessages = false;
    const emptyStateElement = document.getElementById('es-no-messages');

    socket.on("new_message", (data) => {
        if (!hasMessages && emptyStateElement) {
            emptyStateElement.classList.add('hide');
            hasMessages = true;
        }

        // Обновить lastMessage, time у чата с data.chatId
        console.log("Новое сообщение:", data);
        if (data.chatId === chatId) {
            addMessageToChat(userId, data.message);
        }
        else {
            if (userId !== data.message.sender_id) {
                console.log('before notif',data)
                const newData = { chatId: data.chatId, userId,  messageId : data.message.message_id  };
                console.log('change:', newData )
                socket.emit('notification', newData)
            }
        }
    });

    socket.on('notification', (data) => {
        console.log('Получено уведомление от сервера: ', data)
    })

}

const messagesList = document.getElementById('messages-list');

function addMessageToChat(userId, message) {
    const messageElement = createMessageElement(userId,message);

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
    messageDiv.className = `message ${message.sender_id === userId ? 'my-message' : 'other-message'}`;
    messageDiv.innerHTML = `
        ${message.full_name ? `<div class="message-sender">${message.full_name}</div>` : ''}
        <div class="message-content">${message.content}</div>
        <div class="message-time">${messageTime}</div>
    `;

    fragment.appendChild(messageDiv);
    return fragment;
}
