import request from '@/utils/request'

export default {
    Search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/staffs/list/search/${page}/${size}`,
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            method: 'post',
            url: '/staffs',
            data: pojo
        })
    },
    //通过会员id查找数据
    getByid(id) {
        return request({
            method: "get",
            url: `staffs/${id}`,
        })
    },
    //更新数据
    update(pojo) {
        return request({
            method: "put",
            url: `staffs/${pojo.id}`,
            data: pojo
        })
    },
    //删除数据
    delete(id) {
        return request({
            method: "delete",
            url: `staffs/${id}`,
            data: id
        })
    }
}