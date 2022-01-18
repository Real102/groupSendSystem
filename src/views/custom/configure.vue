<template>
  <div class="configure">
    <div class="sendWayWrap">
      <div class="swOne" v-if="configData.flag === 1">
        <span class="redStar">选择群发渠道：</span>
        <el-select v-model="sw" size="small" placeholder="请选择群发渠道">
          <el-option
            v-for="item in swList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <div class="swTips">
          <p>规则：</p>
          <p>1、默认使用的筛数据服务为尚信筛数据接口。</p>
          <p>2、更换渠道时，只针对新的任务，不影响已经创建的任务。</p>
        </div>
      </div>
      <div class="remarkWrap" v-else-if="configData.flag === 2">
        <el-input
          type="textarea"
          rows="5"
          maxlength="50"
          resize="none"
          placeholder="请输入备注"
          v-model="remark"
          show-word-limit
        ></el-input>
      </div>
      <div class="scoreWrap" v-else-if="configData.flag === 3">
        <div class="scoreOne">
          <span>账号：</span>
          <span>66655@qq.com</span>
        </div>
        <div class="scoreOne">
          <span>当前余额：</span>
          <span>10000</span>
        </div>
        <div class="scoreOne">
          <span>上分数量：</span>
          <el-radio-group v-model="scoreStatus">
            <el-radio :label="1">增加</el-radio>
            <el-radio :label="2">减少</el-radio>
          </el-radio-group>
        </div>
        <div class="scoreOne">
          <span></span>
          <el-input-number v-model="score" :step="1" step-strictly></el-input-number>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'configure',
  props: {
    configData: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      sw: 1,
      remark: '',
      scoreStatus: 1,
      score: '',
      swList: [
        {
          name: '使用尚信群发接口',
          id: 1
        },
        {
          name: '使用xx群发接口',
          id: 2
        }
      ]
    }
  },
  methods: {
    handleSubmit() {
      // 提交按钮点击事件，根据flag来判断是哪个弹框，然后提交到对应的接口
    }
  }
}
</script>
<style lang="less" scoped>
.configure {
  .sendWayWrap {
    .swTips {
      margin-top: 40px;
      p {
        text-align: left;
        text-indent: 20px;
        line-height: 24px;
      }
    }
  }
  .scoreWrap {
    .scoreOne {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-bottom: 20px;
      .el-input {
        width: 120px;
      }
      span {
        text-align: right;
        padding-right: 20px;
        &:first-child {
          flex-shrink: 0;
          width: 200px;
        }
      }
    }
  }
}
</style>
