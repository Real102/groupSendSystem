/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2022-01-24 20:45:47
 * @modify date 2022-01-25 22:59:18
 * @desc api接口页面
 */

// ! README 当前页面的接口管理员端的接口
import request from '@/service/index.js'
const qs = require('qs')

// 添加国家-价格接口
export const addCountry = data => {
  return request({
    url: '/country/add-country',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 删除国家-价格接口
export const deleteCountry = data => {
  return request({
    url: '/country/del-country',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 用户管理--账号列表数据
export const getAccountList = params => {
  return request({
    url: '/account/index',
    method: 'GET',
    params
  })
}

// 用户管理---群发渠道列表数据
export const getSendWayList = params => {
  return request({
    url: '/account/channel-list',
    method: 'GET',
    params
  })
}

// 用户管理--切换群发渠道路径
export const setSendWay = data => {
  return request({
    url: '/account/setting-channel',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 账号管理---修改备注接口
export const editRemark = data => {
  return request({
    url: '/account/remark',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 账号管理---上分接口
export const setScore = data => {
  return request({
    url: '/account/add-balance',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 账号管理---停用账号
export const stopAccount = data => {
  return request({
    url: '/account/lock',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 账号管理---启用账号
export const openAccount = data => {
  return request({
    url: '/account/del-account',
    method: 'POST',
    data: qs.stringify(data)
  })
}
