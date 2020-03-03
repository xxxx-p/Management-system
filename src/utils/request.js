import axios from 'axios'
import { Loading, Message } from 'element-ui'

const loading = {
    loadingInstance: null,
    open: function() {
        if (this.loadingInstance === null) {
            this.loadingInstance = Loading.service({
                target: '.main',
                text: '拼命加载中',
                background: 'rgba(0,0,0,.5)'
            });
        }

    },
    close: function() {
        if (this.loadingInstance !== null) {
            this.loadingInstance.close();

        }
        this.loadingInstance = null;
    }
}
const request = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000 //请求超时，5000毫秒
})

//请求拦截
request.interceptors.request.use(config => {
    //请求拦截
    loading.open()
    return config
}, error => {
    //请求错误
    loading.close()
    return Promise.reject(error)
})

//响应拦截
request.interceptors.response.use(response => {
    //返回数据
    loading.close()
    const resp = response.data;
    if (resp.code !== 2000) {
        Message({
            message: resp.message || '系统异常',
            type: "warning",
            duration: 5 * 1000
        })
    }
    return response
}, error => {
    loading.close()
    Message({
        message: error.message || '系统异常',
        type: "error",
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

// request.get('/db.json').then(response => {
//     const data = response.data
//     console.log(data)
// })

export default request //导出自定义创建的request对象