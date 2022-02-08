<template>
  <div class="material">
    <!-- 搜索框 -->
    <div class="searchWrap">
      <el-button type="primary" size="small" icon="el-icon-upload" @click="handleUpload(false)"
        >上传料子</el-button
      >
      <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete"
        >批量删除</el-button
      >
      <el-input
        placeholder="文件名称"
        size="small"
        type="text"
        v-model="keyword"
        @keyup.enter="initMaterialList('search')"
      ></el-input>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="initMaterialList('search')"
        >查询</el-button
      >
    </div>
    <!-- 表格数据 -->
    <div class="tableWrap">
      <el-table
        :data="materialData"
        stripe
        @selection-change="handleSelectionChange"
        ref="materialTableRef"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="material_name" label="文件名" min-width="200px"></el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="upload_count" label="上传次数"></el-table-column>
        <el-table-column prop="all_count" label="上传数据"></el-table-column>
        <el-table-column prop="effective_count" label="有效数据"></el-table-column>
        <el-table-column
          prop="invalidData"
          label="无效数据（含重复）"
          min-width="120px"
        ></el-table-column>
        <el-table-column prop="create_time" label="创建时间" min-width="180px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleUpload(scope.row)" type="text" size="small"
              >料子补充</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginationData.currentPage"
        :page-sizes="paginationData.sizes"
        :page-size="paginationData.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginationData.total"
      >
      </el-pagination>
    </div>
    <!-- 上传组件 -->
    <el-dialog
      :title="uploadTitle"
      :visible.sync="uploadDialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <!-- 如果是补充料子，那么国家下拉框不可编辑 -->
      <Upload
        :isUpload="uploadTitle === '料子补充'"
        :countryCode="countryCode"
        :uploadId="uploadId"
        ref="uploadRef"
        @handleSuccess="handleSuccess"
      ></Upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Upload from './upload.vue'
import { getMaterialList, deleteMaterial } from '@/api/custom.js'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'material',
  components: {
    Upload
  },
  data() {
    return {
      keyword: '',
      // TODO: 只是测试数据，还需要换成接口的数据
      materialData: [],
      selectedItems: [], // 已选择的项的id
      uploadTitle: '料子上传', // 弹框的标题
      uploadDialogVisible: false, // 弹框显示与否
      countryCode: '',
      uploadId: '',
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: 0
      }
    }
  },
  mounted() {
    this.initMaterialList()
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.initMaterialList()
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.initMaterialList()
    },
    handleSelectionChange(rows) {
      // 点选了table项触发事件
      // 先清空已选择的数组，然后再遍历push每一项的id
      if (rows) {
        this.selectedItems = []
        rows.forEach(row => {
          this.selectedItems.push(row.id)
        })
      } else if (this.selectedItems.length > 0) {
        // 如果没有带rows参数。可以认为是切换页码触发的事件，需要显示之前选择的项
        this.materialData.forEach(i => {
          if (this.selectedItems.includes(i.id)) {
            setTimeout(() => {
              // 需要加个延迟或者nextTick，否则会回显失败
              this.$refs.materialTableRef.toggleRowSelection(i)
            }, 0)
          }
        })
      }
    },
    initMaterialList(flag) {
      // 初始化料子列表，包括关键字搜索功能
      const data = {
        page: this.paginationData.currentPage,
        'per-page': this.paginationData.pageSize,
        keyword: flag === 'search' ? this.keyword : undefined
      }
      getMaterialList(data)
        .then(res => {
          const { list } = res.data
          this.paginationData.total = res.data.total
          // 这里需要格式化一下数据
          this.formatData(list)
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatData(list) {
      // 列表数据格式化
      this.materialData = []
      list.forEach((item, index) => {
        item.create_time = parseTime(item.create_time)
        item.id = ++index
        item.invalidData = item.all_count - item.effective_count
        this.materialData.push(item)
      })
      this.handleSelectionChange()
    },
    handleDelete() {
      // 点击批量删除按钮
      if (this.selectedItems.length <= 0) {
        this.$message.warning('请至少选择一项！')
      } else {
        this.$confirm('请再次确认是否删除料子', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const data = {
              id: this.selectedItems.join(',')
            }
            deleteMaterial(data)
              .then(() => {
                this.$message.success('删除成功！')
                this.initMaterialList()
              })
              .catch(err => {
                console.log(err)
              })
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    handleUpload(row) {
      // 点击料子补充触发事件
      this.uploadDialogVisible = true
      if (row) {
        this.uploadTitle = '料子补充'
        this.uploadId = row.id
        this.countryCode = row.country_id
      } else {
        this.uploadTitle = '料子上传'
      }
    },
    handleConfirm() {
      // 弹框点击确定触发事件
      this.$refs.uploadRef.handleSubmit()
    },
    handleSuccess() {
      this.initMaterialList()
      this.uploadDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.material {
  .searchWrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
    .el-input {
      width: 250px;
    }
    .el-button {
      margin: 0 20px 0 0;
      &:last-child {
        margin: 0 0 0 20px;
      }
    }
  }
}
</style>
