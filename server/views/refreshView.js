'use strict'

export function refreshErrorResponse(errorMessage) {
    return {
        success: false,
        error: errorMessage
    }
}

export function refreshSuccessResponse(message) {
    return {
        success: false,
        error: errorMessage
    }
}