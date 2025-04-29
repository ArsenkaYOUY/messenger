'use strict'

import { avatarManipulation } from "./avatarUtils.js";

export function renderChatItem(userData) {
    const container = document.getElementById('chats-list'); // <div id="chat-list"></div> — обёртка

    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');

    chatItem.innerHTML = `
        <div class="chat-avatar">
            <div class="chat-avatar-box"></div>
            <img src="${userData.avatar_url || 'images/user.png'}" alt="Аватар">
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-name">${userData.fullname || userData.username}</span>
<!--                <span class="chat-time">${userData.time || ''}</span>-->
            </div>
            <div class="chat-preview">
<!--                <span class="chat-text">${userData.lastMessage || ''}</span>-->
                <span class="chat-status">
                    ${userData.status}
                </span>
            </div>
        </div>
    `;

    container.appendChild(chatItem);
}
