'use strict'

import { TokenService } from "../services/TokenService.js";
import { getRefreshToken } from "../models/tokenModel.js";
import {
    refreshErrorResponse
} from "../views/refreshView.js"

export async function refreshToken(req, res) {
    const tokenService = new TokenService();
    const token = req.cookies.get("refreshToken");
    if (!token) {
        return res.sendStatus(401).json(refreshErrorResponse('Сеанс закончен. Повторите вход'))
    }

    try {
        const payload = tokenService.verifyRefreshToken(token);
        const refreshToken = await getRefreshToken(payload.id);

        if (token !== refreshToken) {
            return res.sendStatus(403).json(refreshErrorResponse('Ошибка авторизации. Повторите вход'))
        }

        const user = { id :payload.id, username : payload.username, email: payload.email }
        const newAccessToken = tokenService.generateAccessToken(user)
        return res.sendStatus(200).json(newAccessToken)
    }
    catch (error) {

    }

}