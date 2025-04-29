function getInitials(fullName) {
    if (!fullName) return '';

    const names = fullName.split(' ');
    let initials = names[0].charAt(0).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].charAt(0).toUpperCase();
    }

    return initials;
}

function getColorFromName(str) {
    if (!str) return '#0088cc'; // Цвет по умолчанию

    // Генерируем хэш из строки
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Преобразуем хэш в цвет
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
        '#98D8C8', '#F06292', '#7986CB', '#9575CD',
        '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F',
        '#FF8A65', '#A1887F', '#90A4AE'
    ];

    return colors[Math.abs(hash) % colors.length];
}
function generateDefaultAvatar(fullName) {
    return {
        initials: getInitials(fullName),
        color: getColorFromName(fullName)
    };
}

function generateDefaultAvatarFallback(avatarElement, fullName) {
    avatarElement.src = ''; // Очищаем src
    avatarElement.classList.add('default-avatar');
    const { initials, color } = generateDefaultAvatar(fullName);
    avatarElement.dataset.initials = initials;
    avatarElement.style.backgroundColor = color;
}

export function avatarManipulation(avatarUrl, avatarElement, fullName) {
    if (avatarUrl) {
        const fullAvatarUrl = "http://localhost:3000/" + avatarUrl;

        checkImageExists(fullAvatarUrl, (exists) => {
            if (exists) {
                avatarElement.src = fullAvatarUrl;
            } else {
                // Если изображение не существует, генерируем аватар с инициалами
                generateDefaultAvatarFallback(avatarElement, fullName);
            }
        });
    } else {
        // Если URL аватара не указан, генерируем аватар с инициалами
        generateDefaultAvatarFallback(avatarElement, fullName);
    }

    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() {
            callback(true);
        };
        img.onerror = function() {
            callback(false);
        };
        img.src = url;
    }
}