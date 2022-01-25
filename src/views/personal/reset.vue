<template>
  <div class="reset">
    <el-form :model="resetData" class="resetForm" ref="resetFormRef" :rules="rule">
      <!-- 以下input：用于消除浏览器自动填充的代码 -->
      <input
        type="password"
        autocomplete="new-password"
        style="position: absolute; top: -9999px; left: 0; opacity: 0"
      />
      <el-form-item prop="oldPassword">
        <el-input
          type="password"
          placeholder="请输入原密码"
          v-model="resetData.oldPassword"
          prefix-icon="el-icon-user"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="resetData.password"
          prefix-icon="el-icon-lock"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-form-item prop="repassword">
        <el-input
          type="password"
          placeholder="确认密码"
          v-model="resetData.repassword"
          prefix-icon="el-icon-lock"
          autocomplete="off"
        >
        </el-input>
      </el-form-item>
      <el-button size="normal" type="primary" @click="handleReset">
        确&nbsp;&nbsp;&nbsp;&nbsp;认
      </el-button>
    </el-form>
  </div>
</template>
<script>
import { setPwd } from '@/api/sign.js'
export default {
  name: 'reset',
  data() {
    return {
      resetData: {
        oldPassword: '',
        password: '',
        repassword: ''
      },
      rule: {
        oldPassword: [{ required: true, trigger: 'blur', validator: this.pwdValid }],
        password: [{ required: true, trigger: 'blur', validator: this.pwdValid }],
        repassword: [{ required: true, trigger: 'blur', validator: this.repwdValid }]
      }
    }
  },
  methods: {
    handleReset() {
      // 点击确认按钮触发事件
      const data = {
        org_password: this.resetData.oldPassword,
        new_password: this.resetData.password
      }
      setPwd(data)
        .then(() => {
          // TODO: 修改完密码后删除token，然后再自动跳转到登录页面
          this.$message.success('修改成功')
        })
        .catch(err => {
          console.log(err)
        })
    },
    pwdValid(rule, value, cb) {
      if (value.length < 6 || value.length > 20) {
        return cb(new Error('请输入6-20位数的密码'))
      } else {
        return cb()
      }
    },
    repwdValid(rule, value, cb) {
      if (!value) {
        return cb(new Error('请输入确认密码'))
      } else if (value !== this.resetData.password) {
        return cb(new Error('两次密码输入不一致'))
      } else {
        return cb()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.reset {
  .resetForm {
    width: 400px;
    margin: 0 auto;
    .el-button {
      width: 100%;
      background: @link-color;
      border: none;
      font-size: 16px;
    }
  }
}
</style>
