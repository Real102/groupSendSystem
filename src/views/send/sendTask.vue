<template>
  <div class="sendTask">
    <el-form class="sendWrap" ref="sendFormRef" :model="sendData" :rules="rule" label-width="100px">
      <el-form-item label="任务名称" prop="task_name">
        <el-input type="text" size="small" v-model="sendData.task_name"></el-input>
      </el-form-item>
      <el-form-item label="选择料子" prop="material_id">
        <el-select
          size="small"
          v-model="sendData.material_id"
          filterable
          clearable
          @change="handleMTChange"
        >
          <el-option
            v-for="item in materialData"
            :key="item.id"
            :label="item.material_name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送条数" prop="task_num">
        <el-input type="text" size="small" v-model="sendData.task_num"></el-input>
      </el-form-item>
      <el-form-item label="料子国家" prop="country">
        <el-select v-model="sendData.country" placeholder="请选择国家" size="small" disabled>
          <el-option
            v-for="item in mtCountry"
            :key="item.id"
            :label="item.country_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" prop="begin_time">
        <el-date-picker
          v-model="sendData.begin_time"
          type="date"
          placeholder="选择日期"
          size="small"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          class="uploadWrap"
          ref="uploadRef"
          action=""
          :before-upload="handleBeforeUpload"
          :file-list="fileList"
          :http-request="handleUpload"
          :limit="1"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <span style="margin-left: 10px; color: red">0.02/条</span>
        </el-upload>
      </el-form-item>
      <el-form-item label="发送内容" prop="content">
        <el-input
          type="textarea"
          v-model="sendData.content"
          rows="5"
          resize="none"
          placeholder="请输入内容，可输入2000个字节"
          maxlength="2000"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item label="替换客服号">
        <div class="tmpl">
          <el-button type="text" style="line-height: 32px; padding: 0" @click="handleCopy"
            >点击复制模板</el-button
          >
          <p><span>__customerNums__</span> &nbsp;&nbsp;将此代码放入话术中，可平均推动客服号</p>
          <p>
            示例：I am a HR . We are hiring for part/full time job. Now you can earn Rs.9800 every
            day. Add ws: __customerNums__
          </p>
          <p>推送效果：</p>
          <p>
            I am a HR . We are hiring for part/full time job. Now you can earn Rs.9800 every day.
            Add ws: https://wa.me/客服号1
          </p>
          <p>
            I am a HR . We are hiring for part/full time job. Now you can earn Rs.9800 every day.
            Add ws: https://wa.me/客服号2
          </p>
          <p>
            I am a HR . We are hiring for part/full time job. Now you can earn Rs.9800 every day.
            Add ws: https://wa.me/客服号1
          </p>
          <p>....</p>
        </div>
      </el-form-item>
      <el-form-item label="ws客服号">
        <el-input
          type="textarea"
          v-model="sendData.customer_code"
          rows="5"
          resize="none"
          placeholder="用英文逗号(,)隔开添加客服号，必须在内容添加关键字__customerNums__"
        ></el-input>
      </el-form-item>
      <div class="sendBtn">
        <el-button type="normal" size="small" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" size="small" @click="handleCreate">{{
          isEdit ? '保存' : '立即创建'
        }}</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import { uploadFile } from '@/api/sign.js'
import { createTask, calculatePrice, getMaterialList, getSendInfo } from '@/api/custom.js'
export default {
  name: 'sendTask',
  data() {
    return {
      fileList: [],
      isEdit: false,
      sendData: {
        task_name: '',
        material_id: '',
        task_num: '',
        country: undefined,
        begin_time: '',
        content: '',
        customer_code: '',
        image_id: undefined
      },
      materialData: [],
      rule: {
        task_name: [{ required: true, trigger: 'blur', message: '请输入任务名称' }],
        material_id: [{ required: true, trigger: 'blur', message: '请选择料子' }],
        task_num: [{ required: true, trigger: 'blur', message: '请输入发送条数' }],
        country: [{ required: true, trigger: 'blur', message: '请选择料子国家' }],
        begin_time: [{ required: true, trigger: 'blur', message: '请选择发送时间' }],
        content: [{ required: true, trigger: 'blur', message: '请输入发送内容' }]
      }
    }
  },
  computed: {
    mtCountry() {
      return this.$store.state.allCountryList
    }
  },
  beforeRouteEnter(to, from, next) {
    const data = JSON.parse(localStorage.getItem('sendData'))
    // TODO: 数据回显
    next(vm => {
      vm.initMaterialList()
      if (data) {
        vm.initSendInfo(data.id)
        // Object.assign(vm.sendData, data)
        vm.isEdit = true
      } else {
        vm.isEdit = false
      }
    })
  },
  methods: {
    handleMTChange() {
      // 选择料子触发事件，自动显示料子国家
      if (this.sendData.material_id) {
        const res = this.materialData.find(i => i.id === this.sendData.material_id)
        this.sendData.country = res?.country_id
      }
    },
    handleCopy() {
      // 点击复制模板
      const input = document.createElement('input')
      document.body.appendChild(input)
      input.setAttribute('value', '__customerNums__')
      input.select()
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功！')
      }
      document.body.removeChild(input)
    },
    handleBeforeUpload(file) {
      // 上传的文件校验
      const { name } = file
      if (['png', 'jpg', 'jpeg'].every(i => name.indexOf(i) < -1)) {
        this.$message.warning('请上传png，jpg，jpeg格式图片')
        return false
      }
    },
    handleUpload(e) {
      // 自定义上传逻辑
      const { file } = e
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 0)
      uploadFile(formData)
        .then(res => {
          this.$message.success('上传成功')
          this.sendData.image_id = res.data.file_id
        })
        .catch(err => {
          console.log(err)
          this.$refs.uploadRef.clearFiles()
        })
    },
    handleCreate() {
      this.$refs.sendFormRef.validate(async valid => {
        if (valid) {
          try {
            const data = JSON.parse(JSON.stringify(this.sendData))
            data.begin_time = String(data.begin_time)?.split('').splice(0, 10).join('')
            const calres = await calculatePrice(data)
            const { price } = calres.data
            this.$confirm(
              `当前任务需要消耗【${price}】元，提交后则不能操作停止，请再次确认！`,
              `确认${this.isEdit ? '修改' : '创建'}群发任务？`,
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }
            )
              .then(() => {
                // 先计算价格，用户二次确认之后再提交数据
                createTask(data).then(() => {
                  this.$message.success(`${this.isEdit ? '修改' : '创建'}成功！`)
                  this.$router.go(-1)
                })
              })
              .catch(e => {
                console.log(e)
              })
          } catch (err) {
            console.log(err)
          }
        }
      })
    },
    initSendInfo(id) {
      // 获取信息用于数据回显
      getSendInfo({ id })
        .then(res => {
          // console.log(res)
          Object.assign(this.sendData, res.data)
          this.sendData.begin_time = String(this.sendData.begin_time).padEnd(13, 0)
        })
        .catch(err => {
          console.log(err)
        })
    },
    initMaterialList() {
      // 初始化料子列表，包括关键字搜索功能
      const data = {
        page: 1,
        'per-page': 1000
      }
      getMaterialList(data)
        .then(res => {
          this.materialData = []
          const { list } = res.data
          this.materialData = list
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.sendTask {
  .sendWrap {
    width: 1000px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    .el-form-item {
      width: 50%;
      margin-bottom: 20px;
      /deep/.el-form-item__content {
        text-align: left;
      }
      .el-input,
      .el-select {
        width: 350px;
      }
      & > span {
        width: 100px;
        flex-shrink: 0;
        text-align: right;
        line-height: 32px;
        padding-right: 20px;
      }
      &:nth-child(7),
      &:nth-child(8),
      &:nth-child(9) {
        width: 100%;
      }
      .tmpl {
        text-align: left;
        p {
          line-height: 24px;
          span {
            color: red;
            font-weight: 600;
          }
        }
      }
    }
    .sendBtn {
      width: 100%;
      text-align: center;
    }
  }
  .uploadWrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
}
</style>
