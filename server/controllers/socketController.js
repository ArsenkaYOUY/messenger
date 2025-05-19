import {getChatMessages, getUserChats} from "./chatControllers.js";
import { createMessage } from "./chatControllers.js";
import { createUnreadMessage } from "./chatControllers.js";
import { createUserChat } from "./chatControllers.js";
import { getUserByID } from "../models/authModel.js";

export function configureSockets(io) {
    let users = {}
    let userCache = new Map();

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
            const { sender_id, chatId, isGroupChat, content, created_at } = data;
            try {
                // Если чат не найден, создаем новый
                if (!chatId) {

                }
                console.log('isGroupChat type:', typeof isGroupChat, 'value:', isGroupChat);
                let full_name = null;
                let avatar_url = null;

                const message = await createMessage(chatId, sender_id, content, created_at);
                if (isGroupChat) {
                    if (userCache.has(sender_id)) {
                        const cachedUser = userCache.get(sender_id);
                        full_name = cachedUser.full_name;
                        avatar_url = cachedUser.avatar_url;
                    } else {
                        const user = await getUserByID(sender_id);
                        if (user) {
                            full_name = user.full_name;
                            avatar_url = user.avatar_url;
                            userCache.set(sender_id, { full_name, avatar_url });
                        }
                    }
                }

                io.to(chatId).emit("new_message", {
                    chatId,
                    isGroupChat,
                    message: {
                        id: message.id,
                        sender_id,
                        content,
                        created_at,
                        full_name,
                        avatar_url
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