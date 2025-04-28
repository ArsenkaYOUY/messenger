import { getUserByID } from '../models/authModel.js';

/*
    success: true/false
    user: (id,username...)
    error: '...';
*/
export async function getCurrentUser(req, res) {
    const userId = req.user.id
    try {
        const userData = await getUserByID(userId);
        if (!userData) {
            return res.status(404).json({
                success: false,
                error: 'Пользователь не найден'
            })
        }

        res.status(200).json({
            success: true,
            user: {
                id: userData.id,
                username: userData.username,
                email: userData.email,
                avatar_url: userData.avatar_url,
                status: userData.status,
                last_seen_at: userData.last_seen_at,
                full_name: userData.full_name,
                about: userData.about,
            }
        });
    }
    catch (error) {
        console.log('Ошибка получения информации о пользователе: ', error)
        res.status(500).json({
            success: false,
            error: 'Ошибка получения информации'
        })
    }
}