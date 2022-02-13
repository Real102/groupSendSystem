<template>
  <div class="createCT">
    <el-form
      :model="createData"
      class="createForm"
      ref="createFormRef"
      :rules="rule"
      label-width="100px"
      ><!-- 以下input：用于消除浏览器自动填充的代码 -->
      <input
        type="password"
        autocomplete="new-password"
        style="position: absolute; top: -9999px; left: 0; opacity: 0"
      />
      <el-form-item prop="account" label="账号">
        <el-input
          type="text"
          size="small"
          v-model="createData.account"
          placeholder="请输入电子邮箱账号"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd" label="密码">
        <el-input
          type="password"
          size="small"
          v-model="createData.pwd"
          placeholder="请输入6-20位数的密码"
        ></el-input>
      </el-form-item>
      <el-form-item prop="repwd" label="确认密码">
        <el-input
          type="password"
          size="small"
          v-model="createData.repwd"
          placeholder="请确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="上分数量" style="text-align: left">
        <el-input-number v-model="createData.num" :step="1" step-strictly></el-input-number>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          size="small"
          v-model="createData.remark"
          placeholder="请输入内容，最多支持50字"
          maxlength="50"
          show-word-limit
          rows="5"
          resize="none"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="btnWrap">
      <el-button type="normal" size="small" @click="$router.go(-1)">取消</el-button>
      <el-button type="primary" size="small" @click="handleClick">立即开通</el-button>
    </div>
  </div>
</template>
<script>
import { createAccount } from '@/api/manager.js'
export default {
  name: 'createCT',
  data() {
    return {
      createData: {
        account: '',
        pwd: '',
        repwd: '',
        num: 0,
        remark: ''
      },
      rule: {
        account: [{ required: true, trigger: 'blur', validator: this.accountValid }],
        pwd: [{ required: true, trigger: 'blur', validator: this.pwdValid }],
        repwd: [{ required: true, trigger: 'blur', validator: this.repwdValid }]
      }
    }
  },
  beforeRouterEnter(to, from, next) {
    next(vm => {
      vm.createData = vm.$otions.data().createData
    })
  },
  methods: {
    handleClick() {
      // 点击立即开通事件
      this.$refs.createFormRef.validate(valid => {
        if (valid) {
          // 校验通过
          const data = {
            account: this.createData.account,
            password: this.createData.pwd,
            score: this.createData.num,
            remark: this.createData.remark
          }
          createAccount(data)
            .then(() => {
              this.$message.success('开通成功')
              this.$router.go(-1)
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
      } else if (value !== this.createData.pwd) {
        return cb(new Error('两次密码输入不一致'))
      } else {
        return cb()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.createCT {
  .createForm {
    width: 500px;
    margin: 0 auto;
  }
}
</style>
