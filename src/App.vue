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
    this.$store.dispatch('allCountryList')
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
