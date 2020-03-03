const TOKEN_KEY = "mxg-msm-token"
const USER_KEY = "mxg-msm-user"

export function getToken() {
    return localStorage.getItem(TOKEN_KEY)
}
export function setToken(token) {
    return localStorage.setItem(TOKEN_KEY, token)
}

export function getUser() {
    return localStorage.getItem(USER_KEY)
}
export function setUser(user) {
    return localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}