<template>
  <div class="sendTask">
    <div class="sendWrap">
      <div class="sendOne">
        <span>任务名称</span>
        <el-input type="text" size="small" v-model="sendData.task"></el-input>
      </div>
      <div class="sendOne">
        <span>选择料子</span>
        <el-select size="small" v-model="sendData.material">
          <el-option
            v-for="item in materialData"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="sendOne">
        <span>发送条数</span>
        <el-input type="text" size="small" v-model="sendData.num"></el-input>
      </div>
      <div class="sendOne">
        <span>料子国家</span>
        <el-select
          v-model="sendData.country"
          placeholder="请选择国家"
          size="small"
          :disabled="isEdit"
        >
          <el-option
            v-for="item in mtCountry"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="sendOne">
        <span>发送时间</span>
        <el-date-picker v-model="sendData.time" type="date" placeholder="选择日期" size="small">
        </el-date-picker>
      </div>
      <div class="sendOne">
        <span>上传图片</span>
        <el-upload
          class="uploadWrap"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <span style="margin-left: 10px; color: red">0.02/条</span>
        </el-upload>
      </div>
      <div class="sendOne">
        <span>发送内容</span>
        <el-input
          type="textarea"
          v-model="sendData.content"
          rows="5"
          resize="none"
          placeholder="请输入内容，可输入2000个字节"
          maxlength="2000"
          show-word-limit
        ></el-input>
      </div>
      <div class="sendOne">
        <span>替换客服号</span>
        <div class="tmpl">
          <el-button type="text" style="line-height: 32px; padding: 0">点击复制模板</el-button>
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
      </div>
      <div class="sendOne">
        <span>ws客服号</span>
        <el-input
          type="textarea"
          v-model="sendData.service"
          rows="5"
          resize="none"
          placeholder="用英文逗号(,)隔开添加客服号，必须在内容添加关键字__customerNums__"
        ></el-input>
      </div>
      <div class="sendBtn">
        <el-button type="normal" size="small" @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" size="small">立即创建</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mtCountry } from '@/utils/testData.js'
export default {
  name: 'sendTask',
  data() {
    return {
      fileList: [],
      isEdit: false, // 当前是新建还是编辑
      sendData: {
        task: '',
        material: '',
        num: '',
        country: '',
        time: '',
        content: '',
        service: '',
        filePath: ''
      },
      materialData: [
        { name: '从WA料子中获取', value: 1 },
        { name: '需要显示剩余的有效数', value: 2 },
        { name: '美国（有效数1000）', value: 3 }
      ]
    }
  },
  computed: {
    mtCountry() {
      return mtCountry
    }
  },
  beforeRouteEnter(to, from, next) {
    const data = localStorage.getItem('sendData')
    next(vm => {
      vm.isEdit = !!data
    })
  },
  methods: {
    handleChange() {}
  }
}
</script>
<style lang="less" scoped>
.sendTask {
  .sendWrap {
    width: 1000px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .sendOne {
      width: 50%;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      margin-bottom: 20px;
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
