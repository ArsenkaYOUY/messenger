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
    if (!str) return '#0088cc';

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1',
        '#98D8C8', '#F06292', '#7986CB', '#9575CD',
        '#64B5F6', '#4DB6AC', '#81C784', '#FFD54F',
        '#FF8A65', '#A1887F', '#90A4AE'
    ];

    return colors[Math.abs(hash) % colors.length];
}

function createAvatarImage(url) {
    const img = document.createElement('img');
    img.className = 'avatar-image';
    img.src = url;
    img.alt = 'User avatar';
    return img;
}

function createInitialsAvatar(fullName) {
    const div = document.createElement('div');
    div.className = 'avatar-initials';

    const { initials, color } = generateDefaultAvatar(fullName);
    div.textContent = initials;
    div.style.backgroundColor = color;

    return div;
}

function generateDefaultAvatar(fullName) {
    return {
        initials: getInitials(fullName),
        color: getColorFromName(fullName)
    };
}

export function avatarManipulation(avatarUrl, containerElement, fullName) {
    // Очищаем контейнер перед добавлением нового элемента
    containerElement.innerHTML = '';

    if (avatarUrl) {
        const fullAvatarUrl = "http://localhost:3000/" + avatarUrl;

        checkImageExists(fullAvatarUrl, (exists) => {
            if (exists) {
                containerElement.appendChild(createAvatarImage(fullAvatarUrl));
            } else {
                containerElement.appendChild(createInitialsAvatar(fullName));
            }
        });
    } else {
        containerElement.appendChild(createInitialsAvatar(fullName));
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