'use strict'

import db from "../config/db_connect.js";

export async function saveRefreshToken(userId, refreshToken) {
    try {
        const result = await db.query(
            'UPDATE users SET refresh_token = $1 WHERE id = $2 RETURNING *', [refreshToken,userId]
        )
        return result.rows[0];
    }
    catch (error) {
        throw error;
    }
}

export async function getRefreshToken(userId) {
    try {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1', [userId]
        )
        const user = result.rows[0];
        return user.refresh_token;
    }
    catch (error) {
        throw error;
    }
}