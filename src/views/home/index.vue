<template>
  <div class="home">
    <!-- TODO: 根据用户角色显示对应的组件，目前管理员的首页为空白 -->
    <component :is="currentComp"></component>
  </div>
</template>

<script>
import CustomPart from './customPart.vue'
import ManagerPart from './managerPart.vue'
export default {
  name: 'Home',
  components: {
    CustomPart,
    ManagerPart
  },
  data() {
    return {}
  },
  computed: {
    currentComp() {
      const { role } = this.$store.state.user.userInfo
      return role === 1 ? 'CustomPart' : 'ManagerPart'
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>
