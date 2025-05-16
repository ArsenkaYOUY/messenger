// messageSender.js
import { connectSocket } from "./socketsSetup.js";

export function sendMessage(chatId, message, userId) {
    const socket = connectSocket(userId);

    const messageData = {
        chatId,
        senderId: userId,
        content: message,
        timestamp: Date.now(),
    };

    socket.emit("send_message", messageData);
}
