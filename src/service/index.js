import axios from 'axios'
import router from '@/router'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

// 根据当前环境，设置 baseURL 参数。当 NODE_ENV 为 development 时不需要加前缀，而非 development 环境时需要加前缀
// 因此 api 下文件不需要再加接口前缀
// 同时设置统一前缀VUE_APP_PROXY_PREFIX，并且在vue.config中通过pathrewrite还原，可避免重复写proxy😏
// 可以在.env.development文件中修改
const { NODE_ENV, VUE_APP_PROXY_PREFIX, VUE_APP_BASE_URL } = process.env
const baseURL = NODE_ENV === 'development' ? VUE_APP_PROXY_PREFIX : VUE_APP_BASE_URL
const STATUS_CODE = {
  PARAMS_ERROR: 1001, // 参数错误
  RULE_ERROR: 2001, // 规则错误
  AUTH_FAIL: 1010, // token过期
  SUCCESS: 200
}

const service = axios.create({
  baseURL
})
// service.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

service.interceptors.request.use(
  config => {
    config.withCredentials = true
    config.headers = Object.assign(config.headers, {
      // 增加登录token，用于校验登录token是否过期
      auth: getToken(),
      'Content-Type': 'application/x-www-form-urlencoded'
    })
    // config.auth = getToken()
    return config
  },
  err => {
    return Promise.inject(err)
  }
)

// 为什么在拦截器switch里面访问不到Message？？？
const elMsg = Message

service.interceptors.response.use(
  response => {
    if (response.status === 200) {
      const { code, msg } = response.data
      switch (code) {
        case STATUS_CODE.SUCCESS:
          return response.data
        case STATUS_CODE.PARAMS_ERROR:
          elMsg({
            message: msg || '参数错误！',
            type: 'error',
            duration: 2000
          })
          throw response.data
        case STATUS_CODE.RULE_ERROR:
          elMsg({
            message: msg || '接口异常，请重试',
            type: 'error',
            duration: 2000
          })
          throw response.data
        case STATUS_CODE.AUTH_FAIL:
          console.log(Message)
          elMsg({
            message: '登录已过期，请重新登录',
            type: 'error',
            duration: 2000,
            onClose: function () {
              router.push('/login')
            }
          })
          break
        default:
          throw response.data
      }
    } else {
      throw response.data
    }
  },
  err => {
    throw err
  }
)
export default service
