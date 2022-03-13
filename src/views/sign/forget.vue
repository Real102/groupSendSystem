<template>
  <div class="forget">
    <div class="forget-form">
      <div class="title-con">
        <span>忘记密码</span>
      </div>
      <el-form :model="forgetData" class="forgetForm" ref="forgetFormRef" :rules="rule">
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
            v-model="forgetData.account"
            prefix-icon="el-icon-user"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="code" class="codeItem">
          <el-input type="text" placeholder="请输入验证码" v-model="forgetData.code">
            <i slot="prefix" class="icon icon-code"></i>
          </el-input>
          <el-button @click="getCode" type="primary" :disabled="captcha.isDisabled">
            {{ captcha.isDisabled ? captcha.time : '获取验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="forgetData.password"
            prefix-icon="el-icon-lock"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="forgetData.repassword"
            prefix-icon="el-icon-lock"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <el-button size="normal" type="primary" @click="handleReset">
          确&nbsp;&nbsp;&nbsp;&nbsp;认
        </el-button>
      </el-form>
      <div class="other-part">
        <p>已有账号？去<span @click="$router.push('/login')">登录</span></p>
        <p>没有账号？去<span @click="$router.push('/regist')">注册</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { getReset, getCaptcha } from '@/api/sign.js'
import { setToken } from '@/utils/auth'
export default {
  name: 'forget',
  data() {
    return {
      forgetData: {
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
      this.$refs.forgetFormRef.validateField('account', err => {
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
      const { account } = this.forgetData
      getCaptcha({ account })
        .then(() => {
          this.$message({
            type: 'success',
            message: '验证码已发送'
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleReset() {
      // 提交修改密码事件
      this.$refs.forgetFormRef.validate(valid => {
        if (valid) {
          getReset({
            account: this.forgetData.account,
            password: this.forgetData.password,
            code: this.forgetData.code
          })
            .then(res => {
              // 登录成功后自动跳转到首页
              setToken(res.data.token)
              // 将用户角色和账号全部交给store来处理，并缓存在本地
              this.$store.commit('user/SET_USERINFO', {
                role: res.data.role || 1,
                account: this.forgetData.account
              })
              // 初始化所有国家-代码映射表
              this.$store.dispatch('allCountryList')
              this.$message({
                type: 'success',
                message: '密码修改成功',
                duration: 2000,
                onClose: () => {
                  // 跳转到首页，不需要重新登录
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
      } else if (value !== this.forgetData.password) {
        return cb(new Error('两次密码输入不一致'))
      } else {
        return cb()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.forget {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('~@/assets/bg.png') no-repeat;
  background-size: cover;
  .forget-form {
    width: 360px;
    height: 500px;
    margin: 15vh auto 0 auto;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(#fff, 0.5);
    position: relative;
    padding: 0 30px;
    box-sizing: border-box;
    .title-con {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      position: relative;
      &:after {
        content: '';
        position: absolute;
        bottom: 35px;
        left: 0;
        width: 100%;
        border-bottom: 1px solid #dcdcdc;
      }
      span {
        position: absolute;
        top: 50px;
        left: 50%;
        margin-left: -50px;
        width: 100px;
        height: 30px;
        text-align: center;
        font-size: 18px;
        color: #101010;
        display: block;
        background: #fff;
        z-index: 2;
        font-weight: 600;
        letter-spacing: 2px;
        text-indent: 2px;
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
        background: @link-color;
        width: 120px;
        flex-shrink: 0;
      }
      .el-button.is-disabled {
        background: rgba(58, 98, 215, 0.4);
      }
    }
    .el-button {
      width: 100%;
      background: @link-color;
      border: none;
      font-size: 16px;
    }
    /deep/.el-input__prefix {
      // 验证码icon的样式
      width: 25px;
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
      cursor: pointer;
      span {
        color: @link-color;
        cursor: pointer;
      }
    }
  }
}
</style>
