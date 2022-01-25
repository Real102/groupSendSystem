/**
 * @author wolfBerry
 * @email 906368017@qq.com
 * @create date 2022-01-20 19:54:36
 * @modify date 2022-01-23 23:10:35
 * @desc api接口页面
 */

// ! README 当前页面的接口为：全局接口、登录、注册、修改密码等公共接口
import request from '@/service/index.js'
const qs = require('qs')

// 登录接口
export const getLogin = data => {
  return request({
    url: '/user/login',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 注册接口
export const getRegist = data => {
  return request({
    url: '/user/register',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 发送验证码
export const getCaptcha = data => {
  return request({
    url: '/user/send-email',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 忘记密码
export const getReset = data => {
  return request({
    url: '/user/reset-pw',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 修改密码接口
export const setPwd = data => {
  return request({
    url: '/account/change-pw',
    method: 'POST',
    data: qs.stringify(data)
  })
}

// 获取国家-代码接口
export const getCountryList = () => {
  return request({
    url: '/account/country-code',
    method: 'GET'
  })
}

// 日志接口
export const getLog = params => {
  return request({
    url: '/log',
    method: 'GET',
    params
  })
}

// 上传文件接口
export const uploadFile = data => {
  return request({
    url: '/tools/upload',
    method: 'POST',
    data
  })
}

// 获取日志类型
export const getLogType = params => {
  return request({
    url: '/tools/balance-type',
    method: 'GET',
    params
  })
}
