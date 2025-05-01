'use strict'

import { avatarManipulation } from "./avatarUtils.js";

export function renderChatItem(userData) {
    const container = document.getElementById('chats-list'); // <div id="chat-list"></div> — обёртка

    const chatItem = document.createElement('div');
    chatItem.classList.add('chat-item');

    chatItem.innerHTML = `
        <div class="chat-avatar">
            <img id="chat-avatar-image" class="avatar-image">
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

    const imgElement = chatItem.querySelector('.chat-avatar img');
    avatarManipulation(userData.avatar_url,imgElement,userData.fullname);

    container.appendChild(chatItem);
}
