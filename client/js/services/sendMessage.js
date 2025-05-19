// messageSender.js
import { connectSocket } from "./socketsSetup.js";

export function sendMessage(chatId, isGroupChat, message, userId) {
    const socket = connectSocket(userId, chatId);

    const messageData = {
        chatId,
        sender_id: userId,
        content: message,
        isGroupChat: isGroupChat,
        created_at: Date.now(),
    };

    socket.emit("send_message", messageData);
}
