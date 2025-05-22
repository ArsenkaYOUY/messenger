import {showNotification} from "../utils/chatMessagesUtils.js";
import { addMessageToChat } from "../utils/chatMessagesUtils.js"
import { renderChatMessages } from "../utils/chatMessagesUtils.js";
import {updateChatPreview} from "../utils/renderChatItemUtils.js";
import {avatarManipulation} from "../utils/avatarUtils";
// import {  }

let socket = null;
let currentChatId = null;
let globalUserId = null;
const joinedRooms = new Set();


export function connectSocket() {
    if (socket) return socket;

    const userData = JSON.parse(localStorage.getItem('userData'));
    const { userId  } = userData;
    globalUserId = userId;

    socket = io("http://localhost:3000");
    socketEventsHandler()
    return socket;
}

export function getChatHistory(userId, chatId) {
    const socket = connectSocket();
    currentChatId = chatId;
    socket.emit('chat_history', chatId, messages => {
        renderChatMessages(userId, messages)
    })
}

export function createRoom(chatId) {
    const socket = connectSocket();
    if (joinedRooms.has(chatId)) {
        return;
    }
    socket.emit("create_room", chatId);
}

export function joinRoom(chatId) {
    const socket = connectSocket();
    if (joinedRooms.has(chatId)) {
        return;
    }
    socket.emit("join_room", chatId, room => {
        joinedRooms.add(chatId);
        console.log('You connected to room', room)
    });
}

export function leaveRoom(chatId) {
    if (!joinedRooms.has(chatId)) return;

    if (socket) {
        socket.emit("leave_room", chatId);
        joinedRooms.delete(chatId);
        console.log(`Left room ${chatId}`);
    }
}

function socketEventsHandler() {
    if (!socket) return;

    socket.on('connection', () => {
        console.log('Connected to WebSockets');
        // При переподключении нужно повторно присоединиться к комнатам
        joinedRooms.forEach(roomId => {
            joinRoom(roomId);
        });
    });

    socket.on('create_room', (chatData) => {
        addNewChatToUI(chatData)
    })

    socket.on('disconnect', () => {
        console.log('Disconnected from WebSockets');
        // Очищаем список комнат при отключении
        joinedRooms.clear();
    });


    let hasMessages = false;
    const emptyStateElement = document.getElementById('es-no-messages');

    socket.on("new_message", (data) => {
        if (!hasMessages && emptyStateElement) {
            emptyStateElement.classList.add('hide');
            hasMessages = true;
        }

        // Обновить chatItem
        updateChatPreview(data.chatId, data.message.content, data.message.created_at)
        // Обновить lastMessage, time у чата с data.chatId
        console.log("Новое сообщение:", data);
        if (data.chatId === currentChatId) {
            addMessageToChat(globalUserId, data.message);
        }
        else {
            console.log('before notif',data)
            const destUserId = globalUserId;
            const newData = {
                chatId: data.chatId,
                destUserId,
                sender_id : data.message.sender_id,
                content : data.message.content,
                created_at : data.message.created_at,
                messageId : data.message.id  };
            console.log('change:', newData )
            socket.emit('notification', newData, notificationData => {
                console.log('Получено уведомление от сервера: ', notificationData)
                showNotification(data.chatId, data.message.content);
            })
        }
    });
}

export function sendMessage(chatId, isGroupChat, message, userId) {
    const messageData = {
        chatId,
        sender_id: userId,
        content: message,
        isGroupChat: isGroupChat,
        created_at: Date.now(),
    };


    addMessageToChat(userId, messageData)
    socket.emit("send_message", messageData);
}

function addNewChatToUI(chatData) {
    const chatsList = document.getElementById('my-chats-list');
    if (!chatsList) return;

    // Проверяем, нет ли уже такого чата в списке
    if (document.getElementById(chatData.chatId)) return;

    // Создаем элемент чата
    const chatItem = document.createElement('div');
    chatItem.className = 'chat-item';
    chatItem.id = chatData.chatId;
    chatItem.dataset.isGroup = chatData.isGroup;

    const avatarContainerId = `chat-avatar-${chatData.chatId}`;

    chatItem.innerHTML = `
        <div class="chat-avatar">
            <div id="${avatarContainerId}" class="avatar-container"></div>
            ${chatData.isOnline ? '<div class="status-indicator online"></div>' : ''}
        </div>
        <div class="chat-content">
            <div class="chat-header">
                <span class="chat-name">${chatData.name || ''}</span>
                <span class="chat-time"></span>
            </div>
            <div class="chat-preview">
                <div class="last-message">Новый чат</div>
                <span class="chat-status"></span>
            </div>
        </div>
    `;

    // Добавляем в начало списка
    chatsList.insertBefore(chatItem, chatsList.firstChild);

    // Инициализируем аватар
    const avatarContainer = chatItem.querySelector(`#${avatarContainerId}`);
    avatarManipulation(chatData.avatar, avatarContainer, chatData.name);

    // Присоединяемся к комнате чата
    joinRoom(chatData.chatId);

}