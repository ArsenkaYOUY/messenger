// messageSender.js
import { connectSocket } from "./socketsSetup.js";

export function sendMessage(chatId, message, userId) {
    const socket = connectSocket(userId, chatId);

    const messageData = {
        chatId,
        sender_id: userId,
        content: message,
        created_at: Date.now(),
    };

    socket.emit("send_message", messageData);
}
