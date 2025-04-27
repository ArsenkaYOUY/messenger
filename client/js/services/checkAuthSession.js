import { validateTokenAndSetUser } from '../handlers/validateTokenAndSetUser.js'

export async function checkAuthSession() {
    const res = await validateTokenAndSetUser();
    if (!res.isValid) {
        alert('Сессия истекла. Войдите в систему заново');
        window.location.replace('authorize.html')
    }
}