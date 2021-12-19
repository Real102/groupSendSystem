import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Layout = () => import('@/layout/index.vue')

export const asyncRoutes = [
	{
		path: '/home',
		component: Layout,
		meta: { title: '首页', icon: 'icon-home' },
		children: [
			{
				path: 'index',
				component: () => import(/* webpackChunkName: "home" */ '@/views/home/index.vue'),
				meta: { title: '首页' }
			}
		]
	},
	// 前台页面
	{
		path: '/material',
		name: 'material',
		component: Layout,
		meta: { title: '料子管理', icon: 'icon-material' },
		redirect: '/material/index',
		children: [
			{
				path: 'index',
				component: () =>
					import(/* webpackChunkName: "material" */ '@/views/material/index.vue'),
				meta: { title: '料子管理' }
			}
		]
	},
	{
		path: '/send',
		name: 'send',
		component: Layout,
		meta: { title: '群发管理', icon: 'icon-send' },
		redirect: '/send/index',
		children: [
			{
				path: 'index',
				component: () => import(/* webpackChunkName: "send" */ '@/views/send/index.vue'),
				meta: { title: '群发管理' }
			}
		]
	},
	// 后台页面
	{
		path: '/custom',
		name: 'custom',
		component: Layout,
		meta: { title: '用户管理', icon: 'icon-user-manage' },
		redirect: '/custom/index',
		children: [
			{
				path: 'index',
				component: () =>
					import(/* webpackChunkName: "custom" */ '@/views/custom/index.vue'),
				meta: { title: '用户管理' }
			}
		]
	},
	{
		path: '/country',
		name: 'country',
		component: Layout,
		meta: { title: '群发国家管理', icon: 'icon-country' },
		redirect: '/country/index',
		children: [
			{
				path: 'index',
				component: () =>
					import(/* webpackChunkName: "country" */ '@/views/country/index.vue'),
				meta: { title: '群发国家管理' }
			}
		]
	},
	{
		path: '/task',
		name: 'task',
		component: Layout,
		meta: { title: '任务管理', icon: 'icon-task' },
		redirect: '/task/index',
		children: [
			{
				path: 'index',
				component: () => import(/* webpackChunkName: "task" */ '@/views/task/index.vue'),
				meta: { title: '任务管理' }
			}
		]
	},
	// 公共页面
	{
		path: '/log',
		name: 'log',
		component: Layout,
		meta: { title: '操作日志', icon: 'icon-log' },
		redirect: '/log/index',
		children: [
			{
				path: 'index',
				component: () => import(/* webpackChunkName: "log" */ '@/views/log/index.vue'),
				meta: { title: '操作日志' }
			}
		]
	},
	{
		path: '/personal',
		name: 'personal',
		component: Layout,
		meta: { title: '个人中心', showSideBar: false },
		redirect: '/personal/reset',
		children: [
			{
				path: 'reset',
				component: () =>
					import(/* webpackChunkName: "personal" */ '@/views/personal/reset.vue'),
				meta: { title: '修改密码' }
			}
		]
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
	const newRouter = createRouter()
	router.matcher = newRouter.matcher
	const r = asyncRoutes
	r.forEach(i => router.addRoute(i))
}

resetRouter()

export default router
