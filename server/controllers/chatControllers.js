import {getUserChatsSuccessResponse} from "../views/chatView.js";
import db from "../config/db_connect.js";
import ChatView from "../views/chatView.js";

import ChatModel from "../models/chatModel.js";

import { getUserByID } from "../models/authModel.js";

export async function getChatMessages(chatId, limit = 50, offset = 0) {
    try {
        const result = await ChatModel.getMessages(chatId, limit, offset);
        return result?.length ? result : []
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserChats(req, res) {
    const userId = req.user.id
    // const userId = req.query.userId || req.user?.id;
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
    const {  type, members } = req.body;
    let { name } = req.body;
    let avatar = null;
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
            const result = await getUserByID(members[0]);
             name = result.full_name;
             avatar = result.avatar_url;
        }

        const chat = await ChatModel.create(
            {isGroup, name: name, avatar},
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







