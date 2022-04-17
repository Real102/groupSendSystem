<template>
  <div class="report">
    <el-form-item prop="filePath" label="请上传当前任务报表">
      <el-upload
        class="uploadWrap"
        ref="uploadRef"
        action=""
        :before-upload="handleBeforeUpload"
        :file-list="fileList"
        :http-request="handleUpload"
        :limit="1"
      >
        <el-button size="small" type="primary"
          >上传<i class="el-icon-upload el-icon--right"></i
        ></el-button>
      </el-upload>
      <el-tooltip
        class="item"
        effect="dark"
        content="支持excel导入，只有任务状态为已完成时才可以导出报表"
        placement="right"
      >
        <i class="el-icon-warning upTooltip"></i>
      </el-tooltip>
      <span class="dl-btn" @click="handleDownload">下载模板</span>
    </el-form-item>
    <el-form-item prop="status" label="修改任务状态">
      <el-select v-model="reportData.status" placeholder="请选择任务状态" size="small" clearable>
        <el-option label="执行中" :value="1"> </el-option>
        <el-option label="已完成" :value="2"> </el-option>
      </el-select>
    </el-form-item>
  </div>
</template>
<script>
export default {
  name: 'report',
  props: {
    reportData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    handleBeforeUpload(file) {
      // 上传的文件校验
      const { name } = file
      if (!name.endsWith('.txt')) {
        this.$message.warning('请上传txt格式文件')
        return false
      }
    },
    handleDownload() {
      console.log('上传文件')
    },
    handleUpload(e) {
      // 自定义上传逻辑
      const { file } = e
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      // uploadFile(formData)
      //   .then(res => {
      //     this.$message.success('上传成功')
      //     this.sendData.file_id = res.data.file_id
      //   })
      //   .catch(err => {
      //     console.log(err)
      //     this.$refs.uploadRef.clearFiles()
      //   })
    }
  }
}
</script>
<style lang="less" scoped>
.report {
  .uploadWrap {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 80px;
  }
  /deep/.el-form-item__content {
    text-align: left;
    position: relative;
  }
  .upTooltip {
    position: absolute;
    left: 82px;
    top: 10px;
    font-size: 18px;
    cursor: pointer;
  }
  .dl-btn {
    position: absolute;
    left: 110px;
    top: 0;
    cursor: pointer;
    color: #409eff;
  }
}
</style>
