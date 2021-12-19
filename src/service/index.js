import axios from 'axios'
import router from '@/router'
import { getToken } from '@/utils/auth'

// 根据当前环境，设置 baseURL 参数。当 NODE_ENV 为 development 时不需要加前缀，而非 development 环境时需要加前缀
// 因此 api 下文件不需要再加接口前缀
// 同时设置统一前缀VUE_APP_PROXY_PREFIX，并且在vue.config中通过pathrewrite还原，可避免重复写proxy😏
// 可以在.env.development文件中修改
const { NODE_ENV, VUE_APP_PROXY_PREFIX, VUE_APP_BASE_URL } = process.env
const baseURL = NODE_ENV === 'development' ? VUE_APP_PROXY_PREFIX : VUE_APP_BASE_URL

const service = axios.create({
	baseURL
})

service.interceptors.request.use(
	config => {
		config.withCredentials = true
		config.headers = Object.assign(config.headers, {
			// 增加登录token，用于校验登录token是否过期
			auth: getToken()
		})
		// config.auth = getToken()
		return config
	},
	err => {
		return Promise.inject(err)
	}
)

service.interceptors.response.use(
	response => {
		if (response.status === 200) {
			const { code } = response.data
			switch (code) {
				case 10200:
					return response.data
				case 10500:
					throw response.data
				case 10001:
					router.push('/')
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
