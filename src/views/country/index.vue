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
      <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch"
        >查询</el-button
      >
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
        <el-table-column prop="country_name" label="国家"></el-table-column>
        <el-table-column prop="country_code" label="代码"></el-table-column>
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
          <el-select v-model="ctData.country_code" size="small" placeholder="请选择国家" filterable>
            <el-option
              v-for="item in remainCountryList"
              :key="item.country_code"
              :label="item.country_name"
              :value="item.country_code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家代码">
          <el-input v-model="ctData.country_code" disabled size="small"></el-input>
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
import { getPriceList } from '@/api/custom.js'
import { addCountry, deleteCountry } from '@/api/manager.js'
export default {
  name: 'country',
  data() {
    return {
      ctName: '',
      selectedItems: [],
      remainCountryList: [], // 未添加价格的国家列表
      dialogVisible: false, // 弹框显示与否
      priceData: [],
      ctData: {
        country_name: '',
        country_code: '',
        price: ''
      },
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: 0
      },
      rule: {
        country_code: [{ required: true, trigger: 'blur', message: '请选择国家' }],
        price: [{ required: true, trigger: 'blur', message: '请输入单价' }]
      }
    }
  },
  watch: {
    'ctData.country_code': {
      handler: function (val) {
        if (val) {
          const res = this.remainCountryList.find(i => i.country_code === val)
          this.ctData.country_name = res?.country_name
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initPriceList()
  },
  methods: {
    initPriceList(flag) {
      // 初始化国家-价格列表
      const data = {
        page: this.paginationData.currentPage,
        'per-page': this.paginationData.pageSize,
        keyword: this.ctName || undefined
      }
      getPriceList(data)
        .then(res => {
          this.priceData = res.data.list
          this.paginationData.total = res.data.total
          if (flag) {
            this.handleSelectionChange()
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.initPriceList('init')
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      // 如果已选择了table的某项，切换页码或页数的时候需要初始化一下
      this.initPriceList('init')
    },
    handleSelectionChange(rows) {
      // 点选了table项触发事件
      // 先清空已选择的数组，然后再遍历push每一项的id
      this.$nextTick(() => {
        if (rows) {
          rows.forEach(row => {
            this.selectedItems.push(row.id)
          })
          this.selectedItems = [...new Set(this.selectedItems)]
        } else {
          if (this.selectedItems.length > 0) {
            // 如果没有带rows参数。可以认为是切换页码触发的事件，需要显示之前选择的项
            // 注意需要先将选中状态清除后再控制选中项的状态
            this.$refs.countryTableRef.clearSelection()
            this.priceData.forEach(i => {
              if (this.selectedItems.includes(i.id)) {
                this.$refs.countryTableRef.toggleRowSelection(i)
              }
            })
          }
        }
      })
    },
    handleAdd() {
      // 点击添加国家价格
      this.dialogVisible = true
      const all = this.$store.state.allCountryList
      const arr = []
      const res = []
      if (this.priceData) {
        // 这里将已被添加的国家过滤掉，避免重复添加
        // 但目前还没确定是否需要过滤，只是从技术角度上觉得应该过滤
        this.priceData.forEach(item => {
          arr.push(item.country_code)
        })
        all.forEach(sub => {
          if (!arr.includes(sub.country_code)) {
            res.push(sub)
          }
        })
        this.remainCountryList = res
      } else {
        this.remainCountryList = all
      }
      this.$nextTick(() => {
        this.$refs.ctFormRef.resetFields()
        this.ctData = this.$options.data().ctData
      })
    },
    handleDelete() {
      // 点击批量删除触发事件
      if (this.selectedItems.length <= 0) {
        this.$message.error('请至少选择一项后再启用')
      } else {
        this.$confirm('请再次确认是否要删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            // 二次弹框确认是否要删除国家-价格
            const data = {
              id: this.selectedItems
            }
            deleteCountry(data)
              .then(() => {
                this.$message.success('删除成功！')
                this.selectedItems = []
                this.initPriceList()
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
    handleSearch() {
      // 点击搜索国家功能
      this.paginationData.currentPage = 1
      const data = {
        page: 1,
        'per-page': this.paginationData.pageSize,
        keyword: this.ctName || undefined
      }
      getPriceList(data)
        .then(res => {
          this.priceData = res.data.list
          this.paginationData.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleReset() {
      this.ctName = ''
    },
    handleSave() {
      // 点击保存国家代码价格事件
      this.$refs.ctFormRef.validate(valid => {
        if (valid) {
          addCountry(this.ctData)
            .then(() => {
              this.$message.success('添加成功！')
              this.dialogVisible = false
              this.initPriceList()
            })
            .catch(err => {
              console.log(err)
            })
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
