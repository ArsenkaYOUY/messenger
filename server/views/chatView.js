export function getUserChatsSuccessResponse(success, userChats) {
    return {
        success: success,
        chats: userChats.map(chat => ({
            id: chat.id,
            name: chat.name,
            isGroup: chat.is_group,
            avatar: chat.avatar,
            lastActivity: chat.lastActivity,
            lastMessage: chat.lastMessage,
            isOnline: chat.is_online,
            unreadCount: parseInt(chat.unreadCount) || 0
        }))
    };
}

export default class ChatView {
    // Успешное создание чата
    static success(chatId, type) {
        return {
            success: true,
            chatId,
            type
        };
    }

    // Чат уже существует
    static chatExists(chatId) {
        return {
            success: false,
            chatId,
            message: 'Личный чат уже существует'
        };
    }

    // Ошибка
    static error(message, statusCode = 400) {
        return {
            success: false,
            error: message,
            statusCode
        };
    }
}