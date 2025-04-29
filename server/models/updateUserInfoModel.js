import db from "../config/db_connect.js";

export async function updateUserField(userId, field, value) {
    try {

        const allowedFields = ['avatar_url', 'full_name', 'username', 'email', 'about'];

        if (!field || !value || !allowedFields.includes(field)) {
            throw new Error('Данные не предоставлены');
        }

        const query =
            `UPDATE users 
             SET ${field} = $1
             WHERE id = $2
             RETURNING *;
            `

        const values = [value, userId];

        const result = await db.query(
            query, values
        )

        if (result.rows.length === 0) {
            throw new Error('User not found');
        }

    }
    catch (error) {
        console.log('updateUserField', error);
        throw error;
    }
}