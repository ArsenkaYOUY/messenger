import { createUser, authenticateUser} from "../models/authModel.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { TokenService} from "../services/TokenService.js";

import {
    loginSuccessResponse,
    loginErrorResponse,
    registerSuccessResponse,
    registerErrorResponse
} from "../views/authView.js";

export async function loginUser(req, res) {
    const { username, password } = req.body;

    try {
        const user = await authenticateUser(username);
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json(loginErrorResponse("Неверное имя пользователя или пароль"));
        }

        const tokens = new TokenService();
        const { accessToken, refreshToken } = await tokens.generateTokens(user)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: false,
            secure: false,
            sameSite: 'Lax',
            path: '/',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.header('Access-Control-Allow-Origin', 'http://localhost:63342');
        res.header('Access-Control-Allow-Credentials', 'true');

        return res.status(201).json(loginSuccessResponse(user, accessToken));
    } catch (error) {
        return res.status(401).json(loginErrorResponse("Ошибка аутентификации"));
    }
}

export async function registerUser(req, res) {
    const { reg_username, email, reg_password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(reg_password, 8);
        const userName = reg_username.toLowerCase();
        const userEmail = email.toLowerCase();
        const newUser = await createUser(userName, userEmail, hashedPassword);

        if (newUser) {
            const tokens = new TokenService();
            const { accessToken, refreshToken } = await tokens.generateTokens(newUser)

            res.cookie('refreshToken', refreshToken, {
                httpOnly: false,
                secure: false,
                sameSite: 'Lax',
                path: '/',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(201).json(registerSuccessResponse(newUser, accessToken));
        }
    } catch (error) {
        let message = "Ошибка регистрации";

        if (error.code === "23505") {
            if (error.constraint === "users_username_key") {
                message = "Пользователь с таким логином уже зарегистрирован";
            } else if (error.constraint === "users_email_key") {
                message = "Пользователь с таким адресом электронной почты уже зарегистрирован";
            }
        }

        return res.status(409).json(registerErrorResponse(message));
    }
}