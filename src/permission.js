//路由跳转权限拦截
import router from './router'
import { getUserInfo } from '@/api/login'
import store from './store'
router.beforeEach((to, from, next) => {
    //获取token    
    // const token = localStorage.getItem('mxg-msm-token')
    const token = store.state.user.token
    if (!token) {
        if (to.path != '/login') {
            next({ path: '/login' })
        } else {
            next()
        }
    } else {

        //获取到token
        //如果请求路由/login。就去目标路由
        //请求路由非登录页面，通过token验证用户信息
        //如果获取到用户信息，跳转目标路由，否则跳转登陆页面
        if (to.path === '/login') {
            next()
        } else {
            //本地查看有没有用户信息
            const user = store.state.user.user
            if (user) {
                //检测到本地有用户信息，跳转目标路由
                next()
            } else {

                //本地没有用户信息，通过本地token值服务端获取用户数据
                store.dispatch('GetUserInfo').then(response => {
                        if (response.flag) {
                            next()
                        } else {
                            next({ path: '/login' })
                        }
                    }).catch(error => {

                    })
                    // getUserInfo(token).then(response => {
                    //     const resp = response.data
                    //     if (resp.flag) {

                //         //检测到用户信息，保存信息跳转目标路由
                //         localStorage.setItem('mxg-msm-user', JSON.stringify(resp.data))
                //         next()
                //     } else {
                //         //未检测到用户信息重新登录
                //         next({ path: '/login' })
                //     }
                // })
            }
        }
    }
})