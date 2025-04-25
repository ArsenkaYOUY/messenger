'use strict'

import { TokenService } from "../services/TokenService.js";
import { getRefreshToken } from "../models/tokenModel.js";
import { getUserByID } from "../models/authModel.js";
import {
    refreshErrorResponse
} from "../views/refreshView.js"

export async function refreshToken(req, res) {
    const tokenService = new TokenService();

    const cookRefreshToken= req.cookies.refreshToken;
    if (!cookRefreshToken) {
        return res.status(401).json(refreshErrorResponse('Сеанс закончен. Повторите вход'))
    }

    try {
        const payload = tokenService.verifyRefreshToken(cookRefreshToken);
        const refreshToken = await getRefreshToken(payload.id);

        if (cookRefreshToken !== refreshToken) {
            return res.status(403).json(refreshErrorResponse('Ошибка авторизации. Повторите вход'))
        }

        const userData = await getUserByID(payload.id);
        const newAccessToken = tokenService.generateAccessToken(userData)

        return res
            .status(200)
            .header('Access-Control-Allow-Origin', 'http://localhost:63342')
            .header('Access-Control-Allow-Credentials', 'true')
            .json({ accessToken: newAccessToken });
    }
    catch (error) {
        return res.status(401).json(refreshErrorResponse('Сеанс закончен. Повторите вход'));
    }

}