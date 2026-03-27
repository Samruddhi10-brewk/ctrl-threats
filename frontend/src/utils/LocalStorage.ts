const EMAIL = 'email'
const USER_NAME = 'username'
const REFRESH_TOKEN = 'refresh_token'
const ACCESS_TOKEN = 'access_token'

export const setEmail = (email: string) => {
    localStorage.setItem(EMAIL, email);
}
export const getEmail = () => {
    return localStorage.getItem(EMAIL);
}

export const getUsername = () => {
    return localStorage.getItem(USER_NAME);
}

export const setUsername = (username: string) => {
    localStorage.setItem(USER_NAME, username);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const hasToken = (): boolean => {
    const AT = localStorage.getItem(ACCESS_TOKEN)
    const RT = localStorage.getItem(REFRESH_TOKEN)
    console.log(AT, RT)
    return AT || RT ? true : false
}

export const getRefreshToken = (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN)
}

export const getAccessToken = (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN);
}
export const setRefreshToken = (refreshToken: string): void => {
    localStorage.setItem(REFRESH_TOKEN, refreshToken)
}
export const setAccessToken = (accessToken: string): void => {
    localStorage.setItem(ACCESS_TOKEN, accessToken)
}

export const removeAccessToken = () => {
    localStorage.removeItem(ACCESS_TOKEN);
}

export const accessTokenExists = (): boolean => {
    return localStorage.getItem(ACCESS_TOKEN) ? true : false;
}
