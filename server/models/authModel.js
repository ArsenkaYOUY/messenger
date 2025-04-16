import db from '../config/db_connect.js';

// return result.rows[0];
export async function createUser(username, email, password_hash) {
    try {
        const result = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *', [username, email, password_hash]
        );
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}

// return result.rows[0];
export async function authenticateUser(username) {
    try {
        username = username.toLowerCase();
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1', [username]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}

// return result.rows[0];
export async function getUserByID(userId) {
    try {
        const result = await db.query(
            'SELECT id, username, last_seen, status, email, avatar_url, full_name FROM users WHERE id = $1', [userId]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}
