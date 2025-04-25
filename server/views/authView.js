export function loginSuccessResponse(user, accessToken) {
    return {
        success: true,
        message: "Вы успешно вошли в аккаунт",
        accessToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}

export function loginErrorResponse(errorMessage) {
    return {
        success: false,
        error: errorMessage
    };
}

export function registerSuccessResponse(user, accessToken) {
    return {
        success: true,
        message: "Регистрация прошла успешно",
        accessToken,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
}

export function registerErrorResponse(errorMessage) {
    return {
        success: false,
        error: errorMessage
    };
}