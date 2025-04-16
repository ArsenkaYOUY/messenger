import { loginRequest, registerRequest } from "../api/authApi.js";

export async function loginUser(data) {
    const result = await loginRequest(data);
    return result;
}

export async function registerUser(data) {
    const result = await registerRequest(data);
    return result;
}