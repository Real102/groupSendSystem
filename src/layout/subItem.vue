<script>
export default {
	name: 'SubItem',
	props: {
		subRouteData: {
			required: true
		}
	},
	// eslint-disable-next-line no-unused-vars
	render: function (h) {
		const { path, meta } = this.subRouteData
		return (
			<router-link to={path} active-class="activeSubItemClass">
				<div class="subItem">
					<span>{meta?.title || '默认子title'}</span>
				</div>
			</router-link>
		)
	}
}
</script>
<style lang="less" scoped>
.subItem {
	color: #fff;
	width: 100%;
	height: 40px;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	cursor: pointer;
	span {
		margin-left: 54px;
	}
}
</style>
