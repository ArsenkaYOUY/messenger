'use strict'

import { TokenService } from "../services/TokenService.js";
import { getRefreshToken } from "../models/tokenModel.js";
import { getUserByID } from "../models/authModel.js";
import {
    refreshErrorResponse
} from "../views/refreshView.js"

export async function refreshToken(req, res) {
    const tokenService = new TokenService();
    console.log('cookies: ', JSON.stringify(req.cookies));
    const cookRefreshToken= req.cookies.refreshToken;
    if (!cookRefreshToken) {
        return res.status(401).json(refreshErrorResponse('Сеанс закончен. Повторите вход'))
    }

    try {
        const payload = tokenService.verifyRefreshToken(cookRefreshToken);
        console.log('refreshController payload.id: ' + payload.id)
        const refreshToken = await getRefreshToken(payload.id);
        console.log('refreshToken: ', refreshToken);
        console.log('cookRefreshToken: ', cookRefreshToken)

        if (cookRefreshToken !== refreshToken) {
            return res.status(403).json(refreshErrorResponse('Ошибка авторизации. Повторите вход'))
        }

        const userData = await getUserByID(payload.id);

        const newAccessToken = tokenService.generateAccessToken(userData)
        return res.status(200).json({
            accessToken: newAccessToken
        })
    }
    catch (error) {
        return res.status(401).json(refreshErrorResponse('Сеанс закончен. Повторите вход'));
    }

}