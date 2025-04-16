import { checkTokenRequest } from "../api/userApi.js";

export async function checkUserToken(token) {
    const result = await checkTokenRequest(token);
    return result;
}