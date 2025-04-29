import db from "../config/db_connect.js";

export async function getUserByUsername(username) {
    try {
        const result = await db.query(
            'SELECT username, status, avatar_url, full_name FROM users WHERE username = $1', [username]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}