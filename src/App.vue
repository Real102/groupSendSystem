<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'app',
  mounted() {
    // 初始化所有国家-代码映射表
    if (['/login', '/sign', '/regist'].indexOf(this.$route.path) < 0) {
      this.$store.dispatch('allCountryList')
    }
    const { name, role } = JSON.parse(localStorage.getItem('userInfo'))
    if (name) {
      this.$store.commit('user/SET_USERINFO', {
        account: name,
        role
      })
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: '微软雅黑', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: @main-fontcolor;
  background: @main-bg-color;
  width: 100%;
  height: 100%;
  font-smooth: auto;
}
</style>
