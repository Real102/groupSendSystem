<template>
  <div class="regist">
    <div class="regist-form">
      <div class="title-con">
        <label class="login-btn" @click="$router.push('/login')">← 去登录</label>
        <span>注册</span>
      </div>
      <el-form :model="registData" class="registForm" ref="registFormRef" :rules="rule">
        <!-- 以下input：用于消除浏览器自动填充的代码 -->
        <input
          type="password"
          autocomplete="new-password"
          style="position: absolute; top: -9999px; left: 0; opacity: 0"
        />
        <el-form-item prop="account">
          <el-input
            type="text"
            placeholder="请输入电子邮箱账号"
            v-model="registData.account"
            prefix-icon="el-icon-user"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="registData.password"
            prefix-icon="el-icon-lock"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="registData.repassword"
            prefix-icon="el-icon-lock"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="codeItem">
          <el-input type="text" placeholder="请输入验证码" v-model="registData.code">
            <i slot="prefix" class="icon icon-code"></i>
          </el-input>
          <el-button @click="getCode" type="primary" :disabled="captcha.isDisabled">
            {{ captcha.isDisabled ? captcha.time : '获取验证码' }}
          </el-button>
        </el-form-item>
        <el-button size="normal" type="primary" @click="handleregist">
          注&nbsp;&nbsp;&nbsp;&nbsp;册
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { getRegist, getCaptcha } from '@/api/sign.js'
import { setToken } from '@/utils/auth'
export default {
  name: 'regist',
  data() {
    return {
      registData: {
        account: '',
        password: '',
        repassword: '',
        code: ''
      },
      captcha: {
        isDisabled: false,
        timer: null,
        time: 0
      },
      rule: {
        account: [{ required: true, trigger: 'blur', validator: this.accountValid }],
        password: [{ required: true, trigger: 'blur', validator: this.pwdValid }],
        repassword: [{ required: true, trigger: 'blur', validator: this.repwdValid }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      }
    }
  },
  methods: {
    getCode() {
      // 点击获取邮箱验证码
      this.$refs.registFormRef.validateField('account', err => {
        if (!err) {
          this.getCaptcha()
          this.captcha.isDisabled = true
          this.captcha.time = 60
          const startTimer = () => {
            this.captcha.timer = setInterval(() => {
              this.captcha.time--
              if (this.captcha.time < 0) {
                clearInterval(this.captcha.timer)
                this.captcha.timer = null
                this.captcha.isDisabled = false
              }
            }, 1000)
          }
          startTimer()
        }
      })
    },
    getCaptcha() {
      // 获取验证码接口请求
      const { account } = this.registData
      getCaptcha({ account })
        .then(() => {
          this.$message.success('验证码已发送')
        })
        .catch(err => {
          this.captcha.isDisabled = false
          console.log(err)
        })
    },
    handleregist() {
      // 提交注册事件
      this.$refs.registFormRef.validate(valid => {
        if (valid) {
          getRegist({
            account: this.registData.account,
            password: this.registData.password,
            code: this.registData.code
          })
            .then(res => {
              // 登录成功后自动跳转到首页
              setToken(res.data.token)
              // 将用户角色和账号全部交给store来处理，并缓存在本地
              this.$store.commit('user/SET_USERINFO', { role: 1, account: this.registData.account })
              // 初始化所有国家-代码映射表
              this.$store.dispatch('allCountryList')
              this.$message({
                message: '注册成功！',
                type: 'success',
                duration: 2000,
                onClose: () => {
                  this.$router.push('/')
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
        return cb(new Error('请输入正确格式的电子邮箱账号'))
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
    },
    repwdValid(rule, value, cb) {
      if (!value) {
        return cb(new Error('请输入确认密码'))
      } else if (value !== this.registData.password) {
        return cb(new Error('两次密码输入不一致'))
      } else {
        return cb()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.regist {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('~@/assets/bg.png') no-repeat;
  background-size: cover;
  .regist-form {
    width: 360px;
    height: 450px;
    margin: 15vh auto 0 auto;
    background: rgba(49, 60, 69, 0.5);
    border-radius: 4px;
    box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);
    position: relative;
    padding: 0 30px;
    box-sizing: border-box;
    .title-con {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      position: relative;
      .login-btn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 48px;
        line-height: 48px;
        font-size: 12px;
        margin-left: -20px;
        cursor: pointer;
        color: #11df4e;
        text-align: left;
      }
      span {
        position: absolute;
        top: 50px;
        left: 50%;
        margin-left: -40px;
        width: 80px;
        height: 30px;
        text-align: center;
        font-size: 18px;
        color: #fff;
        display: block;
        z-index: 2;
        font-weight: 600;
        letter-spacing: 4px;
        text-indent: 4px;
      }
    }
    .el-form-item {
      .el-input {
        /deep/.el-input__inner {
          color: #aaa;
          background: #e8f0fe;
        }
      }
    }
    /deep/.codeItem {
      .el-form-item__content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .el-button {
        margin-left: 20px;
        width: 120px;
        flex-shrink: 0;
      }
      .el-button.is-disabled {
        background: rgba(58, 98, 215, 0.4);
      }
    }
    .el-button {
      width: 100%;
      background: #175070;
      border: none;
      border-radius: 0;
      font-size: 16px;
    }
    .el-button.is-disabled {
      background: #175070 !important;
    }
    /deep/.el-input__prefix {
      // 验证码icon的样式
      width: 25px;
    }
  }
}
</style>
