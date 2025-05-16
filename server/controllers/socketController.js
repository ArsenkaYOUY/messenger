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
            // const result = await pool.query(messagesQuery, [chatId]);
            // const messages = await result.json;
            socket.emit("chat_history", { chatId, messages: {}} );
        })

        // Обработка отправки сообщений
        socket.on("send_message", async (data) => {
            const { senderId, chatId, content } = data;
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
                        timestamp: Date.now(),
                    },
                });

                console.log(`Сообщение от ${senderId} для ${chatId}: ${content}`);
            } catch (error) {
                console.error('Ошибка отправки сообщения:', error);
            }
        })

        // socket.on('message', (messageData) => {
        //     const { senderId, chatId, content } = messageData;
        //
        //     console.log(JSON.stringify(messageData));
        //
        //     socket.emit("new_message", {
        //         chatId,  // добавляем ID чата
        //         message: {  // структурируем данные
        //             content: messageData.content,
        //             senderId: messageData.senderId,
        //             timestamp: messageData.timestamp
        //             // другие поля по необходимости
        //         }
        //     });
        //
        // })

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