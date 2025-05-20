'use strict';

// import { updateChatPreview } from "../utils/renderChatItemUtils.js";

export function showNotification(chatId, messageContent) {
    const chatItem = document.querySelector(`.chat-item[id="${chatId}"]`);
    if (!chatItem) return;

    const name = chatItem.querySelector('.chat-name').textContent;
    const avatarContainer = chatItem.querySelector('.avatar-container');

    const notification = document.createElement('div');
    notification.className = 'notification';

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'notification-avatar';

    const avatarClone = avatarContainer.cloneNode(true);
    avatarDiv.appendChild(avatarClone);

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-header">
                <span class="notification-name">${name}</span>
                <span class="notification-time">${timeString}</span>
            </div>
            <div class="notification-message">${messageContent}</div>
        </div>
    `;

    notification.prepend(avatarDiv);

    const container = document.getElementById('notifications-container');
    container.appendChild(notification);

    notification.classList.add('show-notification');

    playNotificationSound();
    const hideTimeout = setTimeout(() => {
        hideNotification(notification);
    }, 5000);

    notification.addEventListener('click', () => {
        clearTimeout(hideTimeout);
        hideNotification(notification);
        // Здесь можно добавить переход к чату
    });

    function playNotificationSound() {
        const audio = new Audio();
        audio.src = '../sounds/notification.mp3';
        audio.volume = 0.3; // Уменьшаем громкость (0-1)
        audio.play().catch(e => console.log('Не удалось воспроизвести звук:', e));
    }

    function hideNotification(notification) {
        notification.classList.add('hide-notification');
        notification.addEventListener('animationend', () => {
            notification.remove();
        });
    }
}

const messagesList = document.getElementById('messages-list');

export function addMessageToChat(userId, message) {
    const messageElement = createMessageElement(userId,message);

    messagesList.appendChild(messageElement);
}

let lastMessageDate = '';

export function renderChatMessages(userId,messages) {
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
