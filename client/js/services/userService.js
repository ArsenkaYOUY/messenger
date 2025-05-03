import { checkTokenRequest } from "../api/userApi.js";
import { refreshTokenRequest } from "../api/userApi.js";
import { getProfileInfo } from "../api/userApi.js";
import { updateProfileField } from "../api/userApi.js";
import {searchUser} from "../api/userApi.js"


export async function searchUserService(username) {
    try {
        const response = await searchUser(username);
        const result = await response.json();
        if (result.success) {
            return { success: true, userData : result.userData }
        }
        else {
            return { success: false, errorMessage: result.error }
        }
    }
    catch (error) {
        throw error;
    }
}

export async function manipulateUserToken(accessToken) {
    try {
        let result = await checkTokenRequest(accessToken);

        if (result.status === 401) {
            const refreshResult = await refreshTokenRequest();
            if (refreshResult.ok) {
                const refreshData = await refreshResult.json();
                console.log('Refresh result : ', JSON.stringify(refreshData));
                const newAccessToken  = refreshData.accessToken;

                console.log('new accessToken: ', newAccessToken);

                localStorage.setItem('accessToken', newAccessToken);
                result = await checkTokenRequest(newAccessToken);
            }
            else {
                console.log('userService code : error: !refreshResult.ok');
                localStorage.removeItem('accessToken');
                return { ok : false}
            }
        }
        return result;
    }
    catch (error) {
        console.log('userService: manipulateUserToken error: ', error);
        return { ok: false };

    }
}

export async function loadUserProfile() {
    try {
        const response = await getProfileInfo();
        const profileData = await response.json();
        return profileData;
    }
    catch (e) {
        console.log('Ошибка загрузки профиля', e)
    }
}

export async function saveProfileData(field, value) {
    try {
        const response = await updateProfileField(field, value);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Ошибка сохранения');
        }

        return await response.json();
    } catch (error) {
        throw error; // Передаём ошибку в вызывающий код
    }
}