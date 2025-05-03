import {getUserChatsSuccessResponse} from "../views/chatView.js";
import db from "../config/db_connect.js";
import ChatView from "../views/chatView.js";
import ChatModel from "../models/chatModel.js";


export async function getUserChats(req, res) {
    // const userId = req.user.id
    const userId = req.query.userId || req.user?.id;
    if (!userId) {
        return res.status(400).send();
    }

    try {
        const userChats = await ChatModel.getChats(userId);
        if (!userChats) {
            return res.status(404).json({
                success: false,
                error: 'Чаты не найдены'
            })
        }
        // const userChats =
        //     {
        //         id: 1,
        //         name: "Тестовый чат",
        //         is_group: false,
        //         lastMessage: "Привет! Это тест.",
        //         unreadCount: 2
        //     };


        res.status(200).json(getUserChatsSuccessResponse(true,userChats));
    }
    catch (error) {
        console.log('Ошибка получения информации о чатах пользователя: ', error)
        res.status(500).json({
            success: false,
            error: 'Ошибка получения информации'
        })
    }
}

export async function createUserChat(req, res) {
    console.log(JSON.stringify(req.body));
    const { name, type, members } = req.body;
    // const creatorId = req.user.id;
    const {creatorId } = req.body;

    if (!type || !members || !Array.isArray(members))  {
        return res.status(400).json({error: "Неверные данные"});
    }

    if (type === "group" && !name) {
        return res.status(400).json({error: "Укажите название группы" })
    }

    // Начинаем транзакцию
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const isGroup = type === "group";

        const membersToAdd = [creatorId, ...members ];
        console.log(isGroup);
        console.log(members);

        if (!isGroup && members.length === 1) {
            const existingChatId = await ChatModel.findPrivateChat(
                creatorId,
                members[0],
                client
            );
            if (existingChatId) {
                await client.query('ROLLBACK');
                return res.status(200).json(ChatView.chatExists(existingChatId));
            }
        }

        const chat = await ChatModel.create(
            {isGroup, name: isGroup ? name : null},
            client
        )

        await ChatModel.addMembers(chat.id, membersToAdd, client);

        await client.query('COMMIT');
        res.status(201).json(ChatView.success(chat.id, type));
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.log('Ошибка создания чата: ', error)
        res.status(500).json(ChatView.error('Ошибка создания чата', 500));
    }
    finally {
        await client.release();
    }
}







