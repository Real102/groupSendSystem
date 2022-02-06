import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Layout = () => import('@/layout/index.vue')

export const userRoutes = [
  // 前台页面
  {
    // 方便起见，直接前后台都搞一个home路由
    path: '/home',
    component: Layout,
    meta: { title: '首页', icon: 'icon-home' },
    children: [
      {
        path: '/home/index',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/material',
    name: 'material',
    component: Layout,
    meta: { icon: 'icon-material' },
    redirect: '/material/index',
    children: [
      {
        path: '/material/index',
        component: () => import(/* webpackChunkName: "material" */ '@/views/material/index.vue'),
        meta: { title: '料子管理' }
      }
    ]
  },
  {
    path: '/send',
    name: 'send',
    component: Layout,
    meta: { icon: 'icon-send' },
    redirect: '/send/index',
    children: [
      {
        path: '/send/index',
        component: () => import(/* webpackChunkName: "send" */ '@/views/send/index.vue'),
        meta: { title: '群发管理' }
      },
      {
        path: '/send/sendTask',
        component: () => import(/* webpackChunkName: "send" */ '@/views/send/sendTask.vue'),
        meta: { title: '新建群发任务', hideSideBar: true }
      }
    ]
  }
]

export const managerRoutes = [
  // 后台页面
  {
    path: '/home',
    component: Layout,
    meta: { title: '首页', icon: 'icon-home' },
    children: [
      {
        path: '/home/index',
        component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
        meta: { title: '首页' }
      }
    ]
  },
  {
    path: '/custom',
    name: 'custom',
    component: Layout,
    meta: { icon: 'icon-user-manage' },
    redirect: '/custom/index',
    children: [
      {
        path: '/custom/index',
        component: () => import(/* webpackChunkName: "custom" */ '@/views/custom/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/custom/createCT',
        component: () => import(/* webpackChunkName: "custom" */ '@/views/custom/createCT.vue'),
        meta: { title: '开通账号', hideSideBar: true }
      }
    ]
  },
  {
    path: '/country',
    name: 'country',
    component: Layout,
    meta: { icon: 'icon-country' },
    redirect: '/country/index',
    children: [
      {
        path: '/country/index',
        component: () => import(/* webpackChunkName: "country" */ '@/views/country/index.vue'),
        meta: { title: '群发国家管理' }
      }
    ]
  },
  {
    path: '/task',
    name: 'task',
    component: Layout,
    meta: { icon: 'icon-task' },
    redirect: '/task/index',
    children: [
      {
        path: '/task/index',
        component: () => import(/* webpackChunkName: "task" */ '@/views/task/index.vue'),
        meta: { title: '任务管理' }
      }
    ]
  }
]

export const asyncRoutes = [
  // 公共页面
  {
    path: '/log',
    name: 'log',
    component: Layout,
    meta: { icon: 'icon-log' },
    redirect: '/log/index',
    children: [
      {
        path: '/log/index',
        component: () => import(/* webpackChunkName: "log" */ '@/views/log/index.vue'),
        meta: { title: '操作日志' }
      }
    ]
  },
  {
    path: '/personal',
    name: 'personal',
    component: Layout,
    meta: { title: '个人中心', hideSideBar: true },
    redirect: '/personal/reset',
    children: [
      {
        path: '/personal/reset',
        component: () => import(/* webpackChunkName: "personal" */ '@/views/personal/reset.vue'),
        meta: { title: '修改密码' }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "sign" */ '@/views/sign/login.vue'),
    meta: { title: '登录', hideSideBar: true }
  },
  {
    path: '/regist',
    name: 'regist',
    component: () => import(/* webpackChunkName: "sign" */ '@/views/sign/regist.vue'),
    meta: { title: '注册', hideSideBar: true }
  },
  {
    path: '/forget',
    name: 'forget',
    component: () => import(/* webpackChunkName: "sign" */ '@/views/sign/forget.vue'),
    meta: { title: '忘记密码', hideSideBar: true }
  },
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path: '/404',
    name: '404',
    component: () => import(/* webpackChunkName: "other" */ '@/views/other/404.vue'),
    meta: { name: '404' }
  },
  {
    path: '*',
    redirect: '/404'
  }
]

//  不需要经过权限判断的路由
export const constantRoutes = []

// 解决重复点击菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const createRouter = () =>
  new VueRouter({
    scrollBehavior: () => ({ y: 0 })
  })

const router = createRouter()

export function resetRouter() {
  const role = localStorage.getItem('role')
  console.log('resetRoute：' + role)
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  let r = []
  if (role === 0) {
    console.log('role = 0 ?')
    r = managerRoutes.concat(asyncRoutes)
  } else if (role === 1) {
    r = userRoutes.concat(asyncRoutes)
  } else {
    r = asyncRoutes
  }
  r.forEach(i => router.addRoute(i))
}

resetRouter()

export default router
