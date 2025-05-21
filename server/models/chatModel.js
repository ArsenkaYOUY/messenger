import db from "../config/db_connect.js";

export default class ChatModel {
    static async create( {isGroup, name, avatar = null}, client = db )  {
        const { rows } = await client.query(
            `INSERT INTO chats (is_group, name, avatar)
             VALUES ($1, $2, $3)
             RETURNING id, is_group, name`,
            [isGroup, name, avatar]
        )
        return rows[0];
    }

    static async createMessage(chatId, senderId, content, created_at, client = db) {
        const createdAtISO = new Date(created_at).toISOString();
        const { rows } = await client.query(
            `INSERT INTO messages (chat_id, user_id, content, created_at)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [chatId, senderId, content, createdAtISO]
        )
        return rows[0];
    }

    static async createUnreadMessage(chatId, destinationUserId, messageId, client = db) {
        const { rows } = await client.query(
            `INSERT INTO unread_messages (user_id, chat_id, message_id)
             VALUES ($1, $2, $3)`,
            [destinationUserId, chatId, messageId]
        )
        return rows[0];
    }

    static async getMessages(chatId){
        try {
            const query = `
                SELECT 
                    m.id,
                    m.content,
                    m.created_at,
                    u.id as sender_id,
                    CASE
                        WHEN c.is_group = true THEN u.avatar_url
                        ELSE NULL
                    END as avatar_url,
                    CASE 
                        WHEN c.is_group = true THEN u.full_name
                        ELSE NULL
                    END as full_name
                FROM messages m
                JOIN users u ON m.user_id = u.id
                JOIN chats c ON m.chat_id = c.id
                WHERE m.chat_id = $1
                ORDER BY m.created_at ASC
            `

            const result = await db.query(query, [chatId]);
            return result.rows;

        }
        catch (error) {
            throw error;
        }
    }

    static async getChats(userId) {
        try {
            const query = `
            SELECT 
                c.id,
                
                CASE 
                    WHEN c.is_group THEN c.name
                    ELSE (
                        SELECT u.full_name FROM users u
                        JOIN chat_members cm ON cm.user_id = u.id
                        WHERE c.id = cm.chat_id AND u.id != $1
                        LIMIT 1
                    )
                END as name,
                    
                c.is_group,
                    
                CASE
                    WHEN c.is_group THEN c.avatar
                    ELSE  (
                        SELECT u.avatar_url FROM users u
                        JOIN chat_members cm ON u.id = cm.user_id
                        WHERE cm.chat_id = c.id AND u.id != $1
                        LIMIT 1
                    )
                END as avatar,
                    
                CASE
                    WHEN c.is_group THEN FALSE
                    ELSE  (
                        SELECT u.is_online FROM users u
                        JOIN chat_members cm ON u.id = cm.user_id
                        WHERE cm.chat_id = c.id AND u.id != $1
                        LIMIT 1
                    )
                END as is_online,
                    
                c.updated_at AS "lastActivity", 
                    
                 (SELECT content FROM messages WHERE chat_id = c.id ORDER BY
                  created_at DESC LIMIT 1) AS "lastMessage",
                    
                 (SELECT COUNT(*) FROM unread_messages WHERE user_id =
                  $1 AND chat_id = c.id) AS "unreadCount"
                  
                FROM chats c
                JOIN chat_members cm ON c.id = cm.chat_id
                WHERE cm.user_id = $1
                ORDER BY c.updated_at DESC;
        `;
            const result = await db.query(query, [userId]);
            if (result.rows && result.rows.length > 0) {
                return result.rows;
            }
        }
        catch (error) {
            throw error;
        }
    }

    static async addMembers(chatId, memberIds, client = db )  {

        const values = memberIds.map((memberId, index) =>
            `($${index * 2 + 1}, $${index * 2 + 2})`
        ).join(',');

        const flatValues = memberIds.flatMap( (memberId) => [chatId, memberId]);

        await client.query(
            `INSERT INTO chat_members (chat_id, user_id)
             VALUES ${values}`,
            flatValues,
        );
    }

    static async findPrivateChat(user1Id, user2Id, client = db){
        const { rows } = await client.query(
            `SELECT c.id FROM chats c
            JOIN chat_members cm1 ON c.id = cm1.chat_id
            JOIN chat_members cm2 ON c.id = cm2.chat_id
            WHERE c.is_group = false 
            AND cm1.user_id = $1
            AND cm2.user_id = $2
            LIMIT 1`,
            [user1Id, user2Id]
        );
        if (!rows || rows.length === 0)
            return null

        return rows[0]?.id;
    }
}




