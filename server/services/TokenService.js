'use strict';

import jwt from "jsonwebtoken";
import { saveRefreshToken } from '../models/tokenModel.js'

export class TokenService {

    constructor() {
        this.accessSecret = process.env.JWT_ACCESS_SECRET;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET;
        this.accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN;
        this.refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN;
    }

    generateAccessToken(user) {
        return jwt.sign({
            id : user.id,
            email : user.email,
            username: user.username,
        }, this.accessSecret,
            { expiresIn: this.accessExpiresIn });
    }

    generateRefreshToken(user) {
        return jwt.sign(
            {id: user.id,},
                this.refreshSecret,
            { expiresIn: this.refreshExpiresIn });
    }

    async generateTokens(user) {
        try {
            const accessToken = this.generateAccessToken(user);
            const refreshToken = this.generateRefreshToken(user);

            await this.saveRefreshToken(user.id, refreshToken);
            return { accessToken, refreshToken };
        } catch (error) {
            console.error(`Ошибка генерации токенов для пользователя ${user.id}:`, error);
            throw new Error('Ошибка генерации токенов');
        }
    }

    async saveRefreshToken(userId, refreshToken) {
        try {
            await saveRefreshToken(userId, refreshToken);
        } catch (error) {
            console.error(` Ошибка при сохранении refresh токена для userId=${userId}:`, error);
            throw new Error('Не удалось сохранить refresh токен');
        }
    }

    verifyAccessToken(accessToken) {
        return jwt.verify(accessToken, this.accessSecret);
    }

    verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, this.refreshSecret)
    }

}