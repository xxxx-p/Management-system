import request from '@/utils/request'

export default {
    //校验密码
    checkPwd(userId, password) {
        return request({
            method: 'post',
            url: `/user/pwd`,
            data: {
                userId,
                password
            }
        })
    },
    //修改密码
    updatePwd(userId, password) {
        return request({
            method: 'put',
            url: `/user/pwd`,
            data: {
                userId,
                password
            }
        })
    },
}