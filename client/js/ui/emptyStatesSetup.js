'use strict'

function emptyStateLoad (elementId, path) {
    const animation = lottie.loadAnimation({
        container: document.getElementById(elementId), // ID контейнера
        renderer: "svg", // Формат рендера (svg/canvas/html)
        loop: true, // Зацикливание
        autoplay: true, // Автозапуск
        path: path // Путь к файлу
    });
}

export function setupAllEmptyStates() {
    emptyStateLoad("lottie-no-messages", "./lottie-animations/no-messages.json")
    emptyStateLoad("lottie-no-chats", "./lottie-animations/no-results.json")
    emptyStateLoad("lottie-user-not-found", "./lottie-animations/no-results.json")
    emptyStateLoad("lottie-no-chosen-chat", "./lottie-animations/no-chosen-chat.json")
}