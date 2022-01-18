<template>
  <div class="country">
    <div class="searchWrap">
      <el-button type="primary" size="small" icon="el-icon-upload" @click="handleAdd"
        >新增国家价格</el-button
      >
      <el-button type="danger" size="small" icon="el-icon-delete" @click="handleDelete"
        >删除价格</el-button
      >
      <el-input placeholder="国家查询" size="small" type="text" v-model="ctName"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
      <el-button type="normal" size="small" icon="el-icon-refresh-right" @click="handleReset"
        >重置</el-button
      >
    </div>
    <div class="tableWrap">
      <el-table
        :data="priceData"
        stripe
        @selection-change="handleSelectionChange"
        ref="countryTableRef"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="code" label="代码"></el-table-column>
        <el-table-column prop="price" label="单价"></el-table-column>
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
    <!-- 弹框 -->
    <el-dialog
      title="新增国家"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <el-form :model="ctData" :rules="rule" class="ctForm" ref="ctFormRef" label-width="80px">
        <el-form-item prop="country" label="国家">
          <el-select v-model="ctData.code" size="small" placeholder="请选择国家">
            <el-option
              v-for="item in [{ country: '中国', code: '1' }]"
              :key="item.code"
              :label="item.country"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家代码">
          <el-input v-model="ctData.code" disabled size="small"></el-input>
        </el-form-item>
        <el-form-item prop="price" label="单价">
          <el-input v-model="ctData.price" placeholder="请输入单价" size="small"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { testPriceData } from '@/utils/testData.js'
export default {
  name: 'country',
  data() {
    return {
      ctName: '',
      selectedItems: [],
      priceData: testPriceData,
      dialogVisible: false, // 弹框显示与否
      ctData: {
        code: '1',
        price: ''
      },
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: testPriceData.length
      },
      rule: {
        code: [{ required: true, trigger: 'blur', message: '请选择国家' }],
        price: [{ required: true, trigger: 'blur', message: '请输入单价' }]
      }
    }
  },
  watch: {
    'ctData.code': {
      handler: function () {
        return '2'
      }
    }
  },
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
            this.$refs.countryTableRef.toggleRowSelection(i)
          }
        })
      }
    },
    handleAdd() {
      // 点击添加国家价格
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs.ctFormRef.resetFields()
        this.ctData = this.$options.data().formData
      })
    },
    handleDelete() {
      // 点击批量删除触发事件
      if (this.selectedItems.length <= 0) {
        this.$message.error('请至少选择一项后再启用')
      }
    },
    handleReset() {
      this.ctName = ''
    },
    handleSave() {
      // 点击保存国家代码价格事件
      this.$refs.ctFormRef.validate(valid => {
        if (valid) {
          // 校验通过
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.country {
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
      &:nth-child(4) {
        margin-left: 20px;
      }
    }
  }
  .ctForm {
    width: 300px;
    margin: 0 auto;
    .el-select,
    .el-input {
      width: 100%;
    }
  }
}
</style>
