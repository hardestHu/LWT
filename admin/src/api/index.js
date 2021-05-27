import request from '@/utils/request'

export default {
    // 内容
    // 新增
    contentAdd(data) {
        return request({
            url: '/backstage/distribution/add',
            method: 'post',
            data
        })
    },
    // 修改
    contentUpdate(data) {
        return request({
            url: '/backstage/distribution/update',
            method: 'post',
            data
        })
    },
    // 查询
    contentQuery(data) {
        return request({
            url: '/backstage/distribution/query',
            method: 'post',
            data
        })
    },
    // 置顶
    contentTop(data) {
        return request({
            url: '/backstage/distribution/top',
            method: 'post',
            data
        })
    },
    // 删除
    contentDel(data) {
        return request({
            url: '/backstage/distribution/del',
            method: 'post',
            data
        })
    },
    // 详情
    contentDetail(data) {
        return request({
            url: '/backstage/distribution/detail',
            method: 'post',
            data
        })
    },
    // 隐藏
    contentHidden(data) {
        return request({
            url: '/backstage/distribution/hidden',
            method: 'post',
            data
        })
    },
    // 显示
    contentShow(data) {
        return request({
            url: '/backstage/distribution/show',
            method: 'post',
            data
        })
    },
    // 入口管理
    // 新增
    entryAdd(data) {
        return request({
            url: '/backstage/entrance/add',
            method: 'post',
            data
        })
    },
    // 修改
    entryUpdate(data) {
        return request({
            url: '/backstage/entrance/update',
            method: 'post',
            data
        })
    },
    // 查询
    entryQuery(data) {
        return request({
            url: '/backstage/entrance/query',
            method: 'post',
            data
        })
    },
    // 置顶
    entryTop(data) {
        return request({
            url: '/backstage/entrance/top',
            method: 'post',
            data
        })
    },
    // 删除
    entryDel(data) {
        return request({
            url: '/backstage/entrance/del',
            method: 'post',
            data
        })
    },
    // 隐藏
    entryHidden(data) {
        return request({
            url: '/backstage/entrance/hidden',
            method: 'post',
            data
        })
    },
    // 显示
    entryShow(data) {
        return request({
            url: '/backstage/entrance/show',
            method: 'post',
            data
        })
    },
    // 详情
    entryDetail(data) {
        return request({
            url: '/backstage/entrance/detail',
            method: 'post',
            data
        })
    },
    // 权限管理
    // 新增
    powerAdd(data) {
        return request({
            url: '/backstage/power/add',
            method: 'post',
            data
        })
    },
    // 修改
    powerUpdate(data) {
        return request({
            url: '/backstage/power/update',
            method: 'post',
            data
        })
    },
    // 查询
    powerQuery(data) {
        return request({
            url: '/backstage/power/query',
            method: 'post',
            data
        })
    },
    // 删除
    powerDel(data) {
        return request({
            url: '/backstage/power/del',
            method: 'post',
            data
        })
    },
    // 详情
    powerDetail(data) {
        return request({
            url: '/backstage/power/detail',
            method: 'post',
            data
        })
    },
    
    // 上传
    upload(data) {
        return request({
            url: '/laowaitong/help/uploadPictures',
            method: 'post',
            data
        })
    },
    // 改密
    upadtePassWord(data) {
        return request({
            url: '/backstage/power/updatePassword',
            method: 'post',
            data
        })
    },
}

