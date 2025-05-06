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
            console.log(result.rows[0]);
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




