<template>
  <div class="regist">
    <div class="regist-form">
      <div class="title-con">
        <span>注册</span>
      </div>
      <el-form :model="registData" class="registForm" ref="registFormRef" :rules="rule">
        <!-- 以下input：用于消除浏览器自动填充的代码 -->
        <input
          type="password"
          autocomplete="new-password"
          style="position: absolute; top: -9999px; left: 0; opacity: 0"
        />
        <el-form-item prop="username">
          <el-input
            type="text"
            placeholder="请输入电子邮箱账号"
            v-model="registData.username"
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
      <div class="other-part">
        <p>已有账号？去<span @click="$router.push('/login')">登录</span></p>
        <p @click="$router.push('/forget')">忘记密码</p>
      </div>
    </div>
  </div>
</template>
<script>
import { getRegist, getCaptcha } from '@/api/sign.js'
export default {
  name: 'regist',
  data() {
    return {
      registData: {
        username: '',
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
        username: [{ required: true, trigger: 'blur', validator: this.usernameValid }],
        password: [{ required: true, trigger: 'blur', validator: this.pwdValid }],
        repassword: [{ required: true, trigger: 'blur', validator: this.repwdValid }],
        code: [{ required: true, trigger: 'blur', message: '请输入验证码' }]
      }
    }
  },
  methods: {
    getCode() {
      // 点击获取邮箱验证码
      this.$refs.registFormRef.validateField('username', err => {
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
      const { username } = this.registData
      getCaptcha({ username })
        .then(res => {
          console.log(res)
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: '获取验证码失败',
            onClose: () => {
              this.captcha.isDisabled = false
            }
          })
          console.log(err)
        })
    },
    handleregist() {
      // 提交注册事件
      this.$refs.registFormRef.validate(valid => {
        if (valid) {
          getRegist(this.registData)
            .then(res => {
              console.log(res)
            })
            .catch(err => {
              console.log(err)
            })
        }
      })
    },
    usernameValid(rule, value, cb) {
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
  background: @main-maybe-bg-color;
  .regist-form {
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
        margin-left: -40px;
        width: 80px;
        height: 30px;
        text-align: center;
        font-size: 18px;
        color: #101010;
        display: block;
        background: #fff;
        z-index: 2;
        font-weight: 600;
        letter-spacing: 4px;
        text-indent: 4px;
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
      color: @link-color;
      cursor: pointer;
      &:first-child {
        color: @l-fontcolor;
        cursor: text;
      }
      &:first-child span {
        color: @link-color;
        cursor: pointer;
      }
    }
  }
}
</style>
