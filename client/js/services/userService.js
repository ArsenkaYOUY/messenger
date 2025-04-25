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