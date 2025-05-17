export function configureSockets(io) {
    let users = {}

    io.on('connection', socket => {
        console.log('User connected to the server, socket: ' + socket.id);

        socket.on('authenticate', (userId) => {
            users[userId] = socket.id
            console.log('user authenticate: ', userId);
        })

        socket.on('join_room', async (data) => {
            const { chatId } = data
            socket.join(chatId);
            console.log(`Пользователь подключился к комнате ${chatId}`);
            // Сделать запрос к бд на отрисовку сообщений в чате
            // socket.emit("chat_history", { chatId, messages: { full_name: 'ars', content : 'hello', created_at : Date.now() }  } );
            const fiveDaysAgo = Date.now() - (5 * 24 * 60 * 60 * 1000);
            socket.emit("chat_history", { chatId, messages: { content : 'hello', created_at : fiveDaysAgo  }  } );
            // socket.emit("chat_history", { chatId, messages: {}  } );
        })

        // Обработка отправки сообщений
        socket.on("send_message", async (data) => {
            const { senderId, chatId, content, created_at } = data;
            try {
                // Если чат не найден, создаем новый
                if (!chatId) {
                    // Запрос к бд на создание чата между двумя пользователями

                    // io.to(senderId).emit("chat_created", { chatId, recipientId });
                    // io.to(recipientId).emit("chat_created", { chatId, senderId });
                }

                // Сохранение сообщения в базу данных

                // Обновляем последнее сообщение в чате
                // const updateChatQuery = `
                //     UPDATE chats
                //     SET last_message = $1
                //     WHERE id = $2
                // `;
                // await pool.query(updateChatQuery, [message, chatId]);

                // Отправляем сообщение другим участникам чата
                io.to(chatId).emit("new_message", {
                    chatId,
                    message: {
                        senderId,
                        content,
                        created_at
                    },
                });

                console.log(`Сообщение от ${senderId} для ${chatId}: ${content}`);
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        })

        socket.on('leave_room', (roomId) => {
            socket.leave(roomId);
            console.log(`Пользователь отключился из комнаты ${roomId}`)
        })

        socket.on("disconnect", () => {
            console.log("Пользователь отключился:", socket.id);
            for (const [userId, socketId] of Object.entries(users)) {
                if (socketId === socket.id) delete users[userId];
            }
        });

    })

}