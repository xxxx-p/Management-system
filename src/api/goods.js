import request from '@/utils/request'

export default {
    search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/goods/list/search/${page}/${size}`,
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            method: 'post',
            url: `/goods`,
            data: pojo
        })
    },
    //通过供应商id查找数据
    getByid(id) {
        return request({
            method: "get",
            url: `goods/${id}`,
        })
    },
    //更新数据
    update(pojo) {
        return request({
            method: "put",
            url: `goods/${pojo.id}`,
            data: pojo
        })
    },
    //删除数据
    delete(id) {
        return request({
            method: "delete",
            url: `goods/${id}`,
            data: id
        })
    }
}