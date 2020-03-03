import { getToken, setToken, getUser, setUser, removeToken } from '@/utils/auth'
import { login, getUserInfo, logout } from '@/api/login'

const user = {
    state: {
        token: getToken(), //解决刷新后token为null
        user: JSON.parse(getUser())
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            setToken(token)
        },
        SET_USER(state, user) {
            setUser(user)
            state.user = user
        },
    },
    actions: {
        //登陆获取token
        Login({ commit }, form) {
            return new Promise((resolve, reject) => {
                login(form.username.trim(), form.password).then(response => {
                    const resp = response.data;
                    commit('SET_TOKEN', resp.data.token)
                    resolve(resp)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //通过token获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const respUser = response.data;
                    commit('SET_USER', respUser.data)
                    resolve(respUser)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //退出
        Logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const respUser = response.data;
                    commit('SET_TOKEN', '')
                    commit('SET_USER', null)
                    removeToken()
                    resolve(respUser)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
}
export default user