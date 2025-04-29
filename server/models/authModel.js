import db from '../config/db_connect.js';

// return result.rows[0];
export async function createUser(login, email, password_hash) {
    try {
        const result = await db.query(
            'INSERT INTO users (login, email, password_hash) VALUES ($1, $2, $3) RETURNING *', [login, email, password_hash]
        );
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}

// return result.rows[0];
export async function authenticateUser(login) {
    try {
        login = login.toLowerCase();
        const result = await db.query(
            'SELECT * FROM users WHERE login = $1', [login]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}

export async function getUserByID(userId) {
    try {
        const result = await db.query(
            'SELECT id, username, last_seen_at, status, email, avatar_url, full_name, about FROM users WHERE id = $1', [userId]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}
