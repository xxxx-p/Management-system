import request from '@/utils/request'

export default {
    getList() {
        return request({
            method: 'get',
            url: '/supplier/list'
        })
    },
    search(page, size, searchMap) {
        return request({
            method: 'post',
            url: `/supplier/list/search/${page}/${size}`,
            data: searchMap
        })
    },
    add(pojo) {
        return request({
            method: 'post',
            url: `/supplier`,
            data: pojo
        })
    },
    //通过供应商id查找数据
    getByid(id) {
        return request({
            method: "get",
            url: `supplier/${id}`,
        })
    },
    //更新数据
    update(pojo) {
        return request({
            method: "put",
            url: `supplier/${pojo.id}`,
            data: pojo
        })
    },
    //删除数据
    delete(id) {
        return request({
            method: "delete",
            url: `supplier/${id}`,
            data: id
        })
    }
}