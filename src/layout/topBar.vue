<!-- @Desc 平台头部，包括 logo 和 用户名 -->
<!-- @author wolfBerry -->
<template>
  <header class="topBar">
    <div class="menu-top" @click="openPage">
      <span>{{ title }}</span>
    </div>
    <el-dropdown @command="handleDropdownCommand">
      <div class="user" v-show="userName">
        <i class="icon icon-avator"></i>
        <span class="user-name">{{ userName }}</span>
        <i class="icon icon-arrow-down"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="item in dropdownList"
          :key="item.name"
          :divided="item.divided"
          :command="item"
          >{{ item.name }}</el-dropdown-item
        >
      </el-dropdown-menu>
    </el-dropdown>
  </header>
</template>

<script>
import { MAIN_TITLE } from '@/setting.js'

export default {
  name: 'topBar',
  data() {
    return {
      dropdownList: [
        {
          name: '修改密码'
        },
        {
          name: '退出登录'
        }
      ]
    }
  },
  computed: {
    title() {
      return MAIN_TITLE
    },
    userName() {
      return this.$store.state.user.userInfo.name || 'admin'
    }
  },
  created() {},
  methods: {
    handleDropdownCommand(dropdownItem) {
      switch (dropdownItem.name) {
        case '退出登录':
          this.$message.success('退出成功')
          break
        case '修改密码':
          this.$router.push('/personal/reset')
          break
        default:
          break
      }
    },
    openPage() {
      // 回到首页
      this.$router.push('/')
    }
  }
}
</script>

<style lang="less" scoped>
.topBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 21, 41, 0.12);
  background-size: auto 100%;
  z-index: 100;
  .menu-top {
    width: @sideBar-w;
    height: 100%;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    background: @sideBar-title-bgcolor;
    cursor: pointer;
  }
  .nav-logo {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    .logo-text {
      margin-left: 8px;
      font-size: 18px;
      color: #fff;
    }
  }
  .user {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 44px;
    &-head {
      margin-right: 10px;
      width: 24px;
    }
    &-name {
      margin: 0 8px 0 4px;
      font-size: 14px;
    }
  }
}
</style>
