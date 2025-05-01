'use strict'

import { avatarManipulation } from "./avatarUtils.js";

export function renderChatItem(userData) {
    const container = document.getElementById('chats-list');
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
}