import {showNotification} from "../utils/chatMessagesUtils.js";
import { addMessageToChat } from "../utils/chatMessagesUtils.js"
import { renderChatMessages } from "../utils/chatMessagesUtils.js";
import {updateChatPreview} from "../utils/renderChatItemUtils.js";

let socket = null;
let currentChatId = null;
let globalUserId = null;

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

export function joinRoom(chatId) {
    const socket = connectSocket()
    socket.emit("join_room", chatId, room => {
        console.log('You connected to room', room)
    });
}

function socketEventsHandler() {
    if (!socket) return;

    socket.on('connection', () => {
        console.log('You connected to WebSockets')
    })

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
