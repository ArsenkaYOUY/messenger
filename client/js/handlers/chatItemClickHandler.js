'use strict';

import { getChatHistory } from '../services/socketsSetup.js';

export let currentChatItem = null;
let lastRightClickedChatItem = null;

export function chatItemClickHandler(globalUserId) {
    const dialog = document.getElementById('chat-dialog');
    const contextMenu = document.getElementById('chat-context-menu');
    const backdropElement = document.getElementById('backdrop');
    const contextMenuItems = contextMenu.querySelectorAll('.context-menu-item');

    // Обработчик обычных кликов на документе
    document.addEventListener('click', function(event) {
        const chatItem = event.target.closest('.chat-item');

        // Если клик не по чат-итему - скрываем контекстное меню
        if (!chatItem) {
            hideContextMenu();
            return;
        }

        event.preventDefault();

        // Обработка кликов по пунктам контекстного меню
        const contextMenuItem = event.target.closest('.context-menu-item');
        if (contextMenuItem) {
            handleContextMenuAction(contextMenuItem, lastRightClickedChatItem);
            return;
        }

        // Обычный клик по чат-итему
        if (currentChatItem === chatItem.id) return;

        updateChatUI(chatItem, dialog);
        currentChatItem = chatItem;
        console.log('chatItem clicked', globalUserId, chatItem.id);
        getChatHistory(globalUserId, chatItem.id);
    });

    // Обработчик правого клика на документе
    document.addEventListener('contextmenu', function(event) {
        const chatItem = event.target.closest('.chat-item');
        if (!chatItem) return;

        event.preventDefault();
        event.stopPropagation();

        lastRightClickedChatItem = chatItem;
        calcContextMenuCoordinates(event);
        showContextMenu();
    });

    // Вспомогательные функции
    function updateChatUI(chatItem, dialog) {
        document.getElementById('es-no-chosen-chat').classList.add('hide');
        document.querySelector('.dialog-messages').classList.remove('hide');
        document.querySelector('.dialog-input-container').classList.remove('hide');
        document.querySelector('.dialog-header').classList.remove('hide');

        hideChatItems();
        activateChatItem(chatItem);

        const dialogName = dialog.querySelector('.dialog-name');
        dialogName.textContent = chatItem.querySelector('.chat-name').textContent;

        const avatarContainer = dialog.querySelector('.dialog-avatar-container');
        avatarContainer.innerHTML = chatItem.querySelector('.chat-avatar').innerHTML;
    }

    function handleContextMenuAction(menuItem, chatItem) {
        console.log(chatItem);
        if (!chatItem) return;

        if (menuItem.dataset.action === 'mark-unread') {
            if (!chatItem.querySelector('.unread-badge')) {
                const unreadBadgeItem = document.createElement('div');
                unreadBadgeItem.classList.add('unread-badge');
                chatItem.querySelector('.chat-preview').appendChild(unreadBadgeItem);
            }
        }
        hideContextMenu();
    }

    function showContextMenu() {
        contextMenu.classList.add('visible');
        backdropElement.classList.add('active');
    }

    function hideContextMenu() {
        contextMenu.classList.remove('visible');
        backdropElement.classList.remove('active');
    }

    function calcContextMenuCoordinates(e) {
        const menuWidth = contextMenu.offsetWidth;
        const menuHeight = contextMenu.offsetHeight;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        let x = e.clientX;
        let y = e.clientY;

        if (x + menuWidth > windowWidth) x = windowWidth - menuWidth - 10;
        if (y + menuHeight > windowHeight) y = windowHeight - menuHeight - 10;

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
    }

    function hideChatItems() {
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active-chat');
        });
    }

    function activateChatItem(chatItem) {
        chatItem.classList.add('active-chat');
    }
}