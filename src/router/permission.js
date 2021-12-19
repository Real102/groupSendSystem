import router from './index.js'
import { getToken } from '@/utils/auth'
import { MAIN_TITLE } from '@/setting.js'

// 白名单列表，不需要登录即可访问
// const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
	// 当没有设置title时，默认显示项目名
	const { title } = to.meta
	document.title = title ? title + ' · ' + MAIN_TITLE : MAIN_TITLE

	// 登录token判断
	const hasToken = getToken()
	if (hasToken) {
		if (to.path === '/login') {
			// 不需要重复登录
			next({ path: '/' })
		} else {
			next()
		}
	} else {
		// if (whiteList.indexOf(to.path) !== -1) {
		// 	next()
		// } else {
		// 	next(`/login?redirect=${to.path}`)
		// }
		next()
	}
})
