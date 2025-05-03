import { getUserByID } from '../models/authModel.js';
import {getUserSuccessResponse, updateFieldErrorResponse, updateFieldSuccessResponse} from '../Views/userView.js';
import { updateUserField } from "../models/updateUserInfoModel.js";
import { getUserByUsername } from '../models/userModel.js';

export async function searchUser(req, res) {
    const { username } = req.query;
    try {
        console.log('username: ',username)
        if (!username) {
            return res.status(400).send({});
        }
        const userData = await getUserByUsername(username);
        if (!userData) {
            return res.status(404).json({
                success: false,
                error: 'Пользователь не найден'
            })
        }

        res.status(200).json({
            success: true,
            userData: {
                username: userData.username,
                avatar_url: userData.avatar_url,
                status: userData.status,
                fullname: userData.full_name
            }
        });
    }
    catch (error) {
        console.log('Ошибка получения информации о пользователе: ', error)
        res.status(409).json({
            success: false,
            error: 'Ошибка получения информации'
        })
    }
}

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

        res.status(200).json(getUserSuccessResponse(true,userData));
    }
    catch (error) {
        console.log('Ошибка получения информации о пользователе: ', error)
        res.status(500).json({
            success: false,
            error: 'Ошибка получения информации'
        })
    }
}


export async function updateAvatarController(req, res) {
    const userId = req.user.id;  // Получаем ID пользователя из JWT токена
    const allowedFields = ['avatar'];  // Разрешенные поля для обновления

    console.log('UpdateAvatarController start');  // Логируем начало работы контроллера
    console.log('Request file:', req.file);  // Логируем полученный файл

    // Если файл не был загружен
    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Аватар не был загружен'
        });
    }

    // Путь к загруженному файлу
    const avatarPath = req.file.path;

    // Поскольку мы обрабатываем только аватар, обновляем только его
    if (!allowedFields.includes('avatar')) {
        return res.status(400).json({
            success: false,
            message: "Данное поле не поддерживается"
        });
    }

    // Обновляем аватар в базе данных
    try {
        await updateUserField(userId, 'avatar_url', avatarPath);

        return res.status(200).json({
            success: true,
            message: "Аватар успешно обновлён"
        });
    } catch (error) {
        console.log('Error updating avatar', error);

        return res.status(500).json({
            success: false,
            message: "Ошибка обновления данных"
        });
    }
}

export async function updateFieldController(req, res) {
    let { field } = req.body;
    const { value } = req.body;
    const userId = req.user.id;
    const allowedFields = [ 'fullname', 'username', 'email', 'about'];

    if (!field || !value || !allowedFields.includes(field)) {
        return res.status(400).json(updateFieldErrorResponse(false, "Данные не предоставлены"));
    }
    if (field === 'fullname') {
        field = 'full_name';
    }

    try {
        await updateUserField(userId, field, value);

        return res.status(200).json(updateFieldSuccessResponse(true, "Данные успешно обновлены"));
    } catch (error) {
        console.log('updateFieldController', error);
        let errorMessage = '';
        if (error.code === "23505") {
            errorMessage = "Данное имя пользователя не доступно";
        }
        return res.status(400).json(updateFieldErrorResponse(false,errorMessage || "Ошибка обновления данных"));
    }
}