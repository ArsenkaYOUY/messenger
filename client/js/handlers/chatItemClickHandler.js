'use strict'

import { handleIncomingMessages } from "./messageHandler.js";
import { leaveRoom } from "../services/socketsSetup.js";

export function chatItemClickHandler(userId) {
    const chatItems = document.querySelectorAll('.chat-item');
    const dialog = document.getElementById('chat-dialog');
    const contextMenu = document.getElementById('chat-context-menu');
    const backdropElement = document.getElementById('backdrop');
    const contextMenuItems = contextMenu.querySelectorAll('.context-menu-item');

    let currentChat = null;

    chatItems.forEach(chatItem => {
        chatItem.addEventListener('click', (e) => {
            e.preventDefault()
            if (currentChat === chatItem.id)
                return;

            document.getElementById('es-no-chosen-chat').classList.add('hide');
            document.querySelector('.dialog-messages').classList.remove('hide');
            document.querySelector('.dialog-input-container').classList.remove('hide')
            document.querySelector('.dialog-header').classList.remove('hide')

            currentChat = chatItem.id;
            console.log('chatItem clicked');
            hideChatItems()
            activateChatItem(chatItem);

            const dialogName = dialog.querySelector('.dialog-name')
            dialogName.textContent = chatItem.querySelector('.chat-name').textContent;

            const avatarContainer = dialog.querySelector('.dialog-avatar-container');
            avatarContainer.innerHTML =  chatItem.querySelector('.chat-avatar').innerHTML;

            leaveRoom(userId,chatItem.id);
            handleIncomingMessages(chatItem.id, userId);
        })

        chatItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();

            calcContextMenuCoordinates(e);
            showContextMenu();

            contextMenuItems.forEach(contextMenuItem => {
                contextMenuItem.addEventListener('click', (e) => {
                    e.preventDefault()
                    console.log(chatItem)
                    if (!chatItem) { return }
                    if (contextMenuItem.dataset.action === 'mark-unread') {
                        if (!chatItem.querySelector('.unread-badge')) {
                            const unreadBadgeItem = document.createElement('div');
                            unreadBadgeItem.classList.add('unread-badge');
                            chatItem.querySelector('.chat-preview').appendChild(unreadBadgeItem);
                        }
                    }
                })
            })
        })

        document.addEventListener('click',() => {
            hideContextMenu()
        })
    })

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

        if (x + menuWidth > windowWidth) {
            x = windowWidth - menuWidth - 10;
        }

        if (y + menuHeight > windowHeight) {
            y = windowHeight - menuHeight - 10;
        }

        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';
    }

    function hideChatItems() {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(chatItem => {
            chatItem.classList.remove('active-chat')
        })
    }

    function activateChatItem(chatItem) {
        chatItem.classList.add('active-chat');
    }
}