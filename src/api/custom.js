import request from '@/service/index.js'
const qs = require('qs')

// 用户端首页账户余额接口
export const getUserBalance = () => {
  return request({
    url: '/account/balance',
    method: 'GET'
  })
}

// 用户端首页获取国家及价格列表接口
export const getPriceList = params => {
  return request({
    url: '/country/index',
    method: 'GET',
    params
  })
}

// 初始化料子管理列表接口
export const getMaterialList = params => {
  return request({
    url: '/material/index',
    method: 'GET',
    params
  })
}

// 删除料子接口
export const deleteMaterial = data => {
  return request({
    url: '/material/delete',
    method: 'POST',
    data
  })
}

// 上传/补充料子接口
export const uploadMaterial = data => {
  return request({
    url: '/material/upload',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 补充料子接口
export const reuploadMaterial = data => {
  return request({
    url: '/material/replenish',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 群发管理---新建群发任务接口
export const createTask = data => {
  return request({
    url: '/task/add',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 群发管理---计算群发任务的价格
export const calculatePrice = data => {
  return request({
    url: '/task/check',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 群发管理---点击修改任务获取详情数据
export const getSendInfo = params => {
  return request({
    url: '/task/info',
    method: 'GET',
    params
  })
}

// 群发管理--修改客服号
export const changeService = data => {
  return request({
    url: '/task/change-customer-code',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 群发管理--下载报表
export const downloadReport = params => {
  return request({
    url: '/task/get-download-url',
    method: 'GET',
    params
  })
}
