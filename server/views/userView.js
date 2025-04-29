export function getUserSuccessResponse(success, userData) {
    return {
        success: success,
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
    };
}

export function updateFieldErrorResponse(success, errorMessage) {
    return {
        success: success,
        message: errorMessage
    }
}

export function updateFieldSuccessResponse(success, message) {
    return {
        success: success,
        message: message
    }
}