<template>
	<div class="sideBar">
		<div class="container">
			<div class="item" v-for="item in resetRoutes" :key="item.path">
				<div
					class="item-title"
					:class="item.active ? 'routerActive' : ''"
					@click="handleClick(item)"
				>
					<i class="icon" :class="item.meta.icon"></i>
					<span>{{ item.meta.title }}</span>
					<i
						class="icon icon-arrow"
						v-show="item.children"
						:class="item.expanded ? 'icon-arrow-active' : ''"
					></i>
				</div>
				<transition-group name="fade">
					<template v-if="item.expanded">
						<div
							class="subItem"
							:class="subItem.active ? 'routerActive' : ''"
							v-for="subItem in item.children"
							:key="subItem.path"
							@click="handleClick(item, subItem)"
						>
							<li>
								<span>{{ subItem.meta.title }}</span>
							</li>
						</div>
					</template>
				</transition-group>
			</div>
		</div>
	</div>
</template>

<script>
import { asyncRoutes } from '@/router/index.js'

export default {
	name: 'sideBar',
	data() {
		return {
			resetRoutes: [
				// {
				// 	path: '/index',
				// 	meta: { title: '首页', icon: 'icon-home' },
				// 	active: true,
				// 	expanded: false
				// },
				// {
				// 	path: '/material',
				// 	meta: { title: '料子管理', icon: 'icon-material' },
				// 	active: false,
				// 	expanded: false,
				// 	children: [
				// 		{
				// 			path: '/send',
				// 			meta: { title: '管理管理', icon: 'icon-send' },
				// 			active: false
				// 		}
				// 	]
				// }
			]
		}
	},
	mounted() {
		// 初始化导航数据
		this.resetRoutes = []
		asyncRoutes.forEach(item => {
			if (item.path !== '/' && item.path !== '/404' && item.path !== '*') {
				const subChildren = []
				if (item.children.length > 1) {
					item.children.forEach((subItem, index) => {
						if (subItem.meta?.showSideBar !== false && index !== 0) {
							subItem.path = item.path + '/' + subItem.path
							subChildren.push(subItem)
						}
					})
					this.resetRoutes.push({
						meta: item.meta || {},
						children: subChildren,
						active: item.path === '/home/index',
						expanded: false
					})
				} else {
					if (item.meta?.showSideBar !== false) {
						this.resetRoutes.push({
							path: item.path + '/' + item.children[0].path,
							meta: item.meta || {},
							active: item.path === '/home/index',
							expanded: false
						})
					}
				}
			}
		})
	},
	watch: {
		$route: {
			handler: function () {
				// 通过路由的变化控制侧边栏的变化
				this.$nextTick(() => {
					this.resetRoutes.forEach(i => {
						i.active = i?.path === this.$route.path
						if (i.children) {
							i.children.forEach(j => {
								j.active = j?.path === this.$route.path
							})
						}
					})
				})
			},
			immediate: true,
			deep: true
		}
	},
	methods: {
		handleClick(item, subItem) {
			if (!subItem) {
				item.expanded = !item.expanded
				this.$router.push(item.path)
			} else {
				this.$router.push(subItem.path)
			}
		}
	}
}
</script>

<style lang="less" scoped>
.sideBar {
	position: absolute;
	width: 100%;
	height: 100%;
	background: @sideBar-bgcolor;
	background-position: bottom;
	background-size: 100% auto;
	overflow: hidden;
	padding-top: @topBar-h;
	.container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		overflow-y: auto;
		.item {
			width: 100%;
			.item-title {
				width: 100%;
				height: @sideBar-item-h;
				color: @sideBar-fontColor;
				display: flex;
				justify-content: flex-start;
				align-items: center;
				position: relative;
				cursor: pointer;
				box-sizing: border-box;
				border-left: 6px solid transparent;
				i {
					margin-left: 26px;
				}
				i:last-of-type {
					margin-left: 0;
					position: absolute;
					right: 20px;
				}
				.icon-arrow-active {
					transform: rotate(90deg);
				}
				span {
					margin-left: 10px;
					color: @sideBar-fontColor;
					font-size: 14px;
					display: block;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
			.subItem {
				width: 100%;
				box-sizing: border-box;
				border-left: 6px solid transparent;
				li {
					display: block;
					height: @sideBar-item-h;
					line-height: @sideBar-item-h;
					list-style: disc;
					text-align: left;
					font-size: 14px;
					cursor: pointer;
					span {
						color: #fff;
						margin-left: 52px;
					}
				}
			}
			.routerActive {
				border-left: 6px solid #003ecb;
				background: @sideBar-title-bgcolor;
			}
		}
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s;
	}
	.fade-enter,
	.fade-leave {
		opacity: 0;
	}
}
</style>
