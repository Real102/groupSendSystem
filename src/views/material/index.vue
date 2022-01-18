<template>
  <div class="material">
    <!-- 搜索框 -->
    <div class="searchWrap">
      <el-button type="primary" size="small" icon="el-icon-upload" @click="handleUpload(false)"
        >上传料子</el-button
      >
      <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
      <el-input
        placeholder="文件名称"
        size="small"
        type="text"
        v-model="searchData.fileName"
      ></el-input>
      <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
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
        <el-table-column prop="filename" label="文件名" min-width="200px"></el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="uploadTimes" label="上传次数"></el-table-column>
        <el-table-column prop="uploadData" label="上传数据"></el-table-column>
        <el-table-column prop="validData" label="有效数据"></el-table-column>
        <el-table-column
          prop="invalidData"
          label="无效数据（含重复）"
          min-width="120px"
        ></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180px"></el-table-column>
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
      <Upload :isUpload="uploadTitle === '料子补充'"></Upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadDialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { testMaterialData } from '@/utils/testData.js'
import Upload from './upload.vue'
export default {
  name: 'material',
  components: {
    Upload
  },
  data() {
    return {
      searchData: {
        fileName: ''
      },
      // TODO: 只是测试数据，还需要换成接口的数据
      materialData: testMaterialData,
      selectedItems: [], // 已选择的项的id
      uploadTitle: '料子上传', // 弹框的标题
      uploadDialogVisible: false, // 弹框显示与否
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: testMaterialData.length
      }
    }
  },
  mounted() {},
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.handleSelectionChange()
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.handleSelectionChange()
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
            this.$refs.materialTableRef.toggleRowSelection(i)
          }
        })
      }
    },
    handleUpload(row) {
      // 点击料子补充触发事件
      this.uploadDialogVisible = true
      if (row) {
        this.uploadTitle = '料子补充'
      } else {
        this.uploadTitle = '料子上传'
      }
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
