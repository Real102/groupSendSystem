<template>
  <div class="upload">
    <div class="upItem">
      <span>料子国家</span>
      <el-select
        v-model="country"
        placeholder="请选择国家"
        size="small"
        :disabled="isDisable"
        filterable
      >
        <el-option
          v-for="item in mtCountry"
          :key="item.id"
          :label="item.country_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
    </div>
    <div class="upItem">
      <span>料子上传</span>
      <!-- TODO: 还需要进一步调整的 -->
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
        <el-tooltip
          class="item"
          effect="dark"
          content="只能上传 txt 文件，单次上传最多 100w 数据，注意号码前面不用带 + "
          placement="right"
        >
          <i class="el-icon-warning upTooltip"></i>
        </el-tooltip>
      </el-upload>
    </div>
  </div>
</template>
<script>
import { uploadFile } from '@/api/sign.js'
import { uploadMaterial, reuploadMaterial } from '@/api/custom.js'
export default {
  name: 'upload',
  props: {
    isUpload: Boolean,
    countryCode: String,
    uploadId: String
  },
  data() {
    return {
      country: '',
      file_id: '',
      fileList: []
    }
  },
  watch: {
    countryCode: {
      handler: function (val) {
        this.country = val
      },
      immediate: true
    }
  },
  computed: {
    mtCountry() {
      // 这里需要显示所有国家的数据，就算是不能群发的国家也允许创建
      return this.$store.state.allCountryList
    },
    isDisable() {
      return this.isUpload
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
    handleUpload(e) {
      // 自定义上传逻辑
      const { file } = e
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 1)
      uploadFile(formData)
        .then(res => {
          this.$message.success('上传成功')
          this.file_id = res.data.file_id
        })
        .catch(err => {
          console.log(err)
          this.$refs.uploadRef.clearFiles()
        })
    },
    handleSubmit() {
      // 弹框点击确定上传料子或补充料子触发接口
      if (!this.isUpload) {
        const data = {
          file_id: this.file_id,
          country_id: this.country
        }
        uploadMaterial(data)
          .then(() => {
            this.$message.success('上传成功')
            this.$emit('handleSuccess')
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        const data2 = {
          file_id: this.file_id,
          id: this.uploadId
        }
        reuploadMaterial(data2)
          .then(() => {
            this.$message.success('料子补充成功')
            this.$emit('handleSuccess')
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
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
