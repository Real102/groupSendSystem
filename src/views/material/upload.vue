<template>
  <div class="upload">
    <div class="upItem">
      <span>料子国家</span>
      <el-select v-model="country" placeholder="请选择国家" size="small" :disabled="isDisable">
        <el-option
          v-for="item in mtCountry"
          :key="item.value"
          :label="item.name"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="upItem">
      <span>料子上传</span>
      <!-- TODO: 还需要进一步调整的 -->
      <el-upload
        class="uploadWrap"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleChange"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <el-tooltip
        class="item"
        effect="dark"
        content="只能上传 txt 文件，单次上传最多 100w 数据，注意号码前面不用带 + "
        placement="right"
      >
        <i class="el-icon-warning upTooltip"></i>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { mtCountry } from '@/utils/testData.js'
export default {
  name: 'upload',
  props: {
    isUpload: Boolean
  },
  data() {
    return {
      country: '',
      fileList: []
    }
  },
  computed: {
    mtCountry() {
      return mtCountry
    },
    isDisable() {
      return this.isUpload
    }
  },
  methods: {
    handleChange() {}
  }
}
</script>
<style lang="less" scoped>
.upload {
  width: 100%;
  box-sizing: border-box;
  padding: 0 30px;
  .upItem {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    & > span {
      width: 80px;
      text-align: left;
      flex-shrink: 0;
      line-height: 32px;
    }
    .el-select {
      width: 100%;
    }
    .uploadWrap {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .upTooltip {
      margin-left: 10px;
      font-size: 18px;
      line-height: 32px;
    }
  }
}
</style>
