'use strict'

import { avatarManipulation } from "./avatarUtils.js";

export function renderChatList(chats) {
    console.log('chats: ',chats )

    const list = document.getElementById('my-chats-list');
    list.innerHTML = '';

    chats.forEach((chat, index) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');

        // Создаём уникальный ID для контейнера аватара
        const avatarContainerId = `chat-avatar-${chat.id || index}`;

        chatItem.innerHTML = `
        <div class="chat-avatar">
            <div id="${avatarContainerId}" class="avatar-container"></div>
            ${chat.status === 'online' ? '<div class="status-indicator online"></div>' : ''}
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-name">${chat.name || 'Без названия'}</span>
            </div>
            <div class="chat-preview">
                <span class="chat-status"></span>
            </div>
        </div>
    `;

        // Вставляем в DOM
        list.appendChild(chatItem);

        // Вызов avatarManipulation после вставки
        const avatarContainer = chatItem.querySelector(`#${avatarContainerId}`);
        avatarManipulation(chat.avatar, avatarContainer, chat.name);
    });
}

const renderedUserIds = new Set();

export function renderFoundedUserItem(userData) {
    if (renderedUserIds.has(userData.id)) return;

    const container = document.getElementById('founded-users-list');
    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');

    chatItem.innerHTML = `
        <div class="chat-avatar">
            <div id="chat-avatar-container" class="avatar-container">
                <!-- Здесь будет либо img, либо div с инициалами -->
            </div>
            ${userData.status === 'online' ? '<div class="status-indicator online"></div>' : ''}
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-name">${userData.fullname || userData.username}</span>
            </div>
            <div class="chat-preview">
                <span class="chat-status"></span>
            </div>
        </div>
    `;

    const avatarContainer = chatItem.querySelector('#chat-avatar-container');
    avatarManipulation(userData.avatar_url, avatarContainer, userData.fullname);

    container.appendChild(chatItem);

    renderedUserIds.add(userData.id);
}

export function cleanFoundedUsers() {
    renderedUserIds.clear();
    const skeletonElement = document.getElementById('search-skeleton-container');
    if (skeletonElement)
        skeletonElement.classList.add('hide');

    document.getElementById('founded-users-list').innerHTML = '';
    const notFoundElement = document.getElementById('es-user-not-found');
    if (notFoundElement)
        notFoundElement.classList.add('hide');
    document.getElementById('my-chats-list').classList.remove('hide');
}