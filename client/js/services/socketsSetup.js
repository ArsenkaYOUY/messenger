let socket = null;

export function connectSocket(userId) {
    if (socket) return socket;

    socket = io("http://localhost:3000");

    socket.on("connect", () => {
        console.log("Подключено к серверу:", socket.id);
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
    const socket = connectSocket(userId);
    console.log(chatId, userId);
    console.log('подключились к комнате' + chatId)
    socket.emit("join_room", { chatId, userId });
}
