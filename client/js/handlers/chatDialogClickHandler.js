'use strict'

export function chatDialogClickHandler() {
    const chatItems = document.querySelectorAll('.chat-item');
    const dialog = document.getElementById('chat-dialog');

    chatItems.forEach(chatItem => {
        chatItem.addEventListener('click', (e) => {
            e.stopPropagation()
            e.preventDefault()
            hideChatItems()
            activateChatItem(chatItem);

            const dialogName = dialog.querySelector('.dialog-name')
            dialogName.textContent = chatItem.querySelector('.chat-name').textContent;

            const avatarContainer = dialog.querySelector('.dialog-avatar-container');
            console.log(JSON.stringify(chatItem.querySelector('.chat-avatar').innerHTML));
            avatarContainer.innerHTML =  chatItem.querySelector('.chat-avatar').innerHTML;
        })
    })

    function hideChatItems() {
        const chatItems = document.querySelectorAll('.chat-item');
        chatItems.forEach(chatItem => {
            chatItem.classList.remove('active')
        })
    }

    function activateChatItem(chatItem) {
        chatItem.classList.add('active');
    }
}