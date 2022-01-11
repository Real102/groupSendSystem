import request from '@/service/index.js'

// 登录接口
export const getLogin = data => {
  return request({
    url: '/login',
    method: 'POST',
    data
  })
}

// 注册接口
export const getRegist = data => {
  return request({
    url: '/regist',
    method: 'POST',
    data
  })
}

// 发送验证码
export const getCaptcha = params => {
  return request({
    url: '/captcha',
    method: 'GET',
    params
  })
}

// 忘记密码
export const getReset = data => {
  return request({
    url: '/reset',
    method: 'POST',
    data
  })
}
