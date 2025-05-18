import { getChatMessages } from "./chatControllers.js";
import { createMessage } from "./chatControllers.js";
import { createUnreadMessage } from "./chatControllers.js";
import { createUserChat } from "./chatControllers.js";

export function configureSockets(io) {
    let users = {}

    io.on('connection', socket => {

        socket.on('authenticate', (userId) => {
            users[userId] = socket.id
        })

        socket.on('join_room', async (data) => {
            const { chatId } = data
            socket.join(chatId);
            const messages = await getChatMessages(chatId);
            socket.emit("chat_history", { chatId, messages: messages  } );
        })

        // Обработка отправки сообщений
        socket.on("send_message", async (data) => {
            const { sender_id, chatId, content, created_at } = data;
            try {
                // Если чат не найден, создаем новый
                if (!chatId) {

                }

                const message = await createMessage(chatId, sender_id, content, created_at);

                // Отправляем сообщение другим участникам чата
                io.to(chatId).emit("new_message", {
                    chatId,
                    message: {
                        message_id : message.id,
                        sender_id,
                        content,
                        created_at
                    },
                });

                console.log(`Сообщение от ${sender_id} для ${chatId}: ${content}`);
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        })

        socket.on('notification', async (data) => {
            const {chatId, userId : destUser, messageId } = data;
            try {
                await createUnreadMessage(chatId, destUser, messageId);
                socket.emit('notification',data)
            } catch (error) {
                console.error('Ошибка отправки уведомления:', error);
            }
        })

        socket.on('leave_room', (data) => {
            console.log(data.chatId)
            socket.leave(data.chatId);
        })

        socket.on("disconnect", () => {
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) delete users[userId];
            }
        });

    })

}