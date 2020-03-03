import request from '@/utils/request'

export default {
    getList() {
        return request({
            method: 'get',
            url: '/member/list'
        })
    },
    Search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/member/list/search/${page}/${size}`,
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            method: 'post',
            url: '/member',
            data: pojo
        })
    },
    //通过会员id查找数据
    getByid(id) {
        return request({
            method: "get",
            url: `member/${id}`,
        })
    },
    //更新数据
    update(pojo) {
        return request({
            method: "put",
            url: `member/${pojo.id}`,
            data: pojo
        })
    },
    //删除数据
    delete(id) {
        return request({
            method: "delete",
            url: `member/${id}`,
            data: id
        })
    }
}