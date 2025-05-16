'use strict'

import {checkAuthSession} from "../services/checkAuthSession.js";
import {getMessages} from "../api/chatApi.js";
import {renderChatMessages} from "../utils/renderChatItemUtils.js";
import { handleIncomingMessages } from "./messageHandler.js";

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


            handleIncomingMessages(chatItem.id, userId);
            // Здесь нужно отправить запрос на сервер для получения соощений
            // Если нет сообщений, вывести emptyState.
            /* getChatMessages(chatItem); // не нужно так как историю сообщений по web sockets получаю*/
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

    async function getChatMessages(chatItem) {
        const noMessagesEmptyState = document.getElementById('es-no-messages')
        // const skeletonElement = document.getElementById('search-skeleton-container');

        try {
            await checkAuthSession();

            if (noMessagesEmptyState)
                noMessagesEmptyState.classList.add('hide');

            // if (skeletonElement)
            //     skeletonElement.classList.remove('hide');

            const chatId = chatItem.id;
            const result = await getMessages(chatId);
            const resultData = await result.json();
            console.log('messages resultData: ', JSON.stringify(resultData, null, 2))
            if (resultData.success) {
                renderChatMessages(resultData.data);
                // if (skeletonElement)
                //     skeletonElement.classList.add('hide');
            }
            else {
                if (noMessagesEmptyState)
                    noMessagesEmptyState.classList.remove('hide')
                // if (skeletonElement)
                //     skeletonElement.classList.add('hide');
            }
        }
        catch (error) {
            console.error(error);
            if (noMessagesEmptyState)
                noMessagesEmptyState.classList.remove('hide')
        }
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