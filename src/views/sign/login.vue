<template>
  <div class="login">
    <div class="login-form">
      <h2>{{ title }}</h2>
      <el-form :model="loginData" class="loginForm" ref="loginFormRef" :rules="rule">
        <!-- 以下input：用于消除浏览器自动填充的代码 -->
        <input
          type="password"
          autocomplete="new-password"
          style="position: absolute; top: -9999px; left: 0; opacity: 0"
        />
        <el-form-item prop="account">
          <el-input
            type="text"
            placeholder="请输入账号"
            v-model="loginData.account"
            prefix-icon="el-icon-user"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="loginData.password"
            prefix-icon="el-icon-lock"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-button size="normal" type="primary" @click="handleLogin"
          >登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button
        >
      </el-form>
      <div class="other-part">
        <p @click="$router.push('/forget')">忘记密码</p>
        <p>没有账号？去<span @click="$router.push('/regist')">注册</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { MAIN_TITLE } from '@/setting.js'
import { getLogin } from '@/api/sign.js'
import { setToken } from '@/utils/auth'
export default {
  name: 'login',
  data() {
    return {
      loginData: {
        account: '',
        password: ''
      },
      rule: {
        account: [{ required: true, trigger: 'blur', validator: this.accountValid }],
        password: [{ required: true, trigger: 'blur', validator: this.pwdValid }]
      }
    }
  },
  computed: {
    title: () => MAIN_TITLE
  },
  methods: {
    handleLogin() {
      this.$refs.loginFormRef.validate(valid => {
        // 校验表单
        if (valid) {
          getLogin(this.loginData)
            .then(res => {
              const { token, role } = res.data
              setToken(token)
              localStorage.setItem('role', role)
              this.$store.commit('SET_ROLE', role)
              this.$message({
                message: '登录成功！',
                type: 'success',
                duration: 2000,
                onClose: () => {
                  this.$router.push('/home/index')
                }
              })
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    accountValid(rule, value, cb) {
      const EMail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (!value.match(EMail)) {
        return cb(new Error('请输入正确格式的账号'))
      } else {
        return cb()
      }
    },
    pwdValid(rule, value, cb) {
      if (value.length < 6 || value.length > 20) {
        return cb(new Error('请输入6-20位数的密码'))
      } else {
        return cb()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @main-maybe-bg-color;
  .login-form {
    width: 360px;
    height: 400px;
    margin: 20vh auto 0 auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(#fff, 0.5);
    position: relative;
    h2 {
      width: 100%;
      line-height: 90px;
      text-align: center;
      color: @l-fontcolor;
      font-weight: 600;
      font-size: 24px;
      letter-spacing: 2px;
    }
    .loginForm {
      width: 300px;
      margin: 0 auto;
      .el-form-item {
        margin-bottom: 30px;
        .el-input {
          font-size: 14px;
          color: @l-fontcolor;
          /deep/.el-input__icon {
            font-size: 16px;
          }
        }
      }
      .el-button {
        width: 100%;
        background: @link-color;
        border: none;
        font-size: 16px;
      }
    }
    .other-part {
      position: absolute;
      bottom: 15px;
      width: 100%;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30px;
      box-sizing: border-box;
      p {
        font-size: 14px;
        color: @l-fontcolor;
        &:first-child,
        span {
          color: @link-color;
          cursor: pointer;
        }
      }
    }
  }
  /deep/input:focus:-webkit-autofill,
  /deep/input:-webkit-autofill {
    box-shadow: 0 0 0px 0 #fff inset;
    -webkit-box-shadow: 0 0 0px 0 #fff inset !important;
    transition: background-color 500000s ease-in-out 50000s;
  }
}
</style>
