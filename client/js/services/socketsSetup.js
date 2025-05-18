let socket = null;
let currentChatId = null;

export function connectSocket(userId, chatId) {
    if (socket) return socket;
    currentChatId = chatId;

    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        socket.emit("authenticate", userId);
    });

    socket.on("connect_error", (error) => {
        console.error("Ошибка подключения:", error);
    });

    socket.on("disconnect", () => {
        console.warn("Соединение разорвано");
    });

    return socket;
}

export function joinRoom(chatId, userId) {
    const socket = connectSocket(userId, chatId);
    socket.emit("join_room", { chatId, userId });
}

export function leaveRoom(chatId, userId) {
    const socket = connectSocket(userId,chatId);
    socket.off('chat_history')
    socket.off('new_message')
    socket.off('notification')
    socket.emit('leave_room', { chatId, userId });
}
