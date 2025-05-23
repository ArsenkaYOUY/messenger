'use strict'

import { avatarManipulation } from "./avatarUtils.js";
import { joinRoom } from "../services/socketsSetup.js";
import { getChatHistory } from "../services/socketsSetup.js";
import { createChat }  from '../api/chatApi.js'
import { getUserChats } from "../services/chatService.js";
import { currentChatItem } from '../handlers/chatItemClickHandler.js';
import { createRoom } from "../services/socketsSetup.js";

export function renderChatList(chats) {
    console.log('chats: ',chats )

    const list = document.getElementById('my-chats-list');
    list.innerHTML = '';

    chats.forEach((chat, index) => {
        const chatItem = document.createElement('div');
        chatItem.classList.add('chat-item');
        chatItem.id = chat.id;
        chatItem.dataset.isGroup = chat.isGroup;

        if (currentChatItem && currentChatItem.id === chatItem.id) {
            chatItem.classList.add('active-chat');
        }

        joinRoom(chatItem.id);

        // Создаём уникальный ID для контейнера аватара
        const avatarContainerId = `chat-avatar-${chat.id || index}`;

        chatItem.innerHTML = `
        <div class="chat-avatar">
            <div id="${avatarContainerId}" class="avatar-container"></div>
            ${chat.isOnline ? '<div class="status-indicator online"></div>' : ''}
<!--            <div class="status-indicator online"></div>-->
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-name">${chat.name ? chat.name : ''}</span>
                <span class="chat-time">${chat.lastActivity ? formatTime(chat.lastActivity) : ''}</span>
            </div>
            <div class="chat-preview">
                  <div class="last-message">
                        ${chat.lastMessage ? chat.lastMessage : ''}
                  </div>
                ${chat.unreadCount > 0 ? `<div class="unread-badge">${chat.unreadCount}</div>` : ''}
                <span class="chat-status"></span>
            </div>
        </div>
    `;

        list.appendChild(chatItem);

        const avatarContainer = chatItem.querySelector(`#${avatarContainerId}`);
        avatarManipulation(chat.avatar, avatarContainer, chat.name);
    });


}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit', hour12: false});
    }

    if (diffDays === 1) {
        return 'Вчера';
    }

    if (diffDays < 7) {
        const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return days[date.getDay()];
    }

    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
}

const renderedUserIds = new Set();

export function renderFoundedUserItem(userData) {
    const globalUserData = JSON.parse(localStorage.getItem('userData'));
    const { userId : globalUserId } = globalUserData;
    if (renderedUserIds.has(userData.id) || userData.id === globalUserId) return;

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

    chatItem.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation()

        // Создаем чат через REST API
        try {

            const globalUserData = JSON.parse(localStorage.getItem('userData'));
            const { userId : globalUserId } = globalUserData;
            console.log(globalUserId);
            const response = await createChat('private', [userData.id], globalUserId);

            if (!response.ok) {
                throw new Error(response.error);
            }
            const result = await response.json();
            console.log('renderFoundedUserItem res: ', result);
            // Обновляем UI
            document.getElementById('es-no-chosen-chat').classList.add('hide');
            // ... остальной код для отображения чата
            const searchElement = document.getElementById('chats-search-user');
            searchElement.value = ''
            cleanFoundedUsers()
            getChatHistory(globalUserId, result.chatId);
            joinRoom(result.chatId.toString());
            if (!result.message){
                createRoom(result.chatId);
            }

        } catch (error) {
            console.error('Ошибка создания чата:', error);
        }
    });
}

export function updateChatPreview(chatId, content, createdAt, unreadCount = 0) {
    const chatItem = document.getElementById(chatId);
    chatItem.querySelector('.last-message').innerHTML = content;
    chatItem.querySelector('.chat-time').innerHTML = formatTime(createdAt);

}

export async function  cleanFoundedUsers() {
    renderedUserIds.clear();
    const skeletonElement = document.getElementById('search-skeleton-container');
    if (skeletonElement)
        skeletonElement.classList.add('hide');

    document.getElementById('founded-users-list').innerHTML = '';
    const notFoundElement = document.getElementById('es-user-not-found');
    if (notFoundElement)
        notFoundElement.classList.add('hide');
    await getUserChats();
    document.getElementById('my-chats-list').classList.remove('hide');
}