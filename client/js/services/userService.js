import { checkTokenRequest } from "../api/userApi.js";
import { refreshTokenRequest } from "../api/userApi.js";

export async function manipulateUserToken(accessToken) {
    try {
        let result = await checkTokenRequest(accessToken);

        if (result.status === 401) {
            const refreshResult = await refreshTokenRequest();
            if (refreshResult.ok) {
                const refreshData = await refreshResult.json();
                console.log('Refresh result : ', JSON.stringify(refreshData));
                const { newAccessToken } = refreshData;

                localStorage.setItem('accessToken', newAccessToken);

                result = await checkTokenRequest(newAccessToken);
            }
            else {
                localStorage.removeItem('accessToken');
                return { ok : false}
            }
        }
        return result;
    }
    catch (error) {
        console.log('manipulateUserToken error: ', error);
        return { ok: false };

    }
}