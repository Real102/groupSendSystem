import router from './index.js'
import { getToken } from '@/utils/auth'
import { MAIN_TITLE } from '@/setting.js'
import { Message } from 'element-ui'

// 白名单列表，不需要登录即可访问
const whiteList = ['/login', '/forget', '/regist']
router.beforeEach(async (to, from, next) => {
  // 当没有设置title时，默认显示项目名
  const { title } = to.meta
  document.title = title ? title + ' · ' + MAIN_TITLE : MAIN_TITLE

  // 登录token判断
  const hasToken = getToken()
  let role
  const userInfo = localStorage.getItem('userInfo')
  if (userInfo) {
    role = JSON.parse(userInfo).role
  }
  // const role = store.getters.role
  if (hasToken) {
    if (to.path === '/login') {
      // 不需要重复登录
      next({ path: '/' })
    } else {
      // 由于管理员的role是0，不能只用!判断。
      // 只有当前的role与路由的role匹配上或role不存在时才能访问
      if ((!to.meta.role && to.meta.role !== 0) || to.meta.role === role) {
        next()
      } else {
        Message({
          message: '无权访问！',
          type: 'error',
          duration: 2000,
          onClose: function () {
            next(from.path)
          }
        })
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
    }
  }
})
