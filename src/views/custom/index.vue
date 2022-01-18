<template>
  <div class="custom">
    <div class="searchWrap">
      <el-button type="success" size="small" @click="createAccount">开通账号</el-button>
      <el-button type="success" size="small" @click="handleUse">启用账号</el-button>
      <el-button type="danger" size="small" @click="handleClose">停用账号</el-button>
      <el-button type="success" size="small" @click="handleSendWay">群发渠道配置</el-button>
      <div class="searchOne">
        <el-select v-model="searchData.seatchItem" size="small">
          <el-option
            v-for="item in searchItemList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          type="text"
          size="small"
          v-model="searchData.searchValue"
          v-if="searchData.seatchItem !== 'status'"
        ></el-input>
        <el-select
          v-model="searchData.searchValue"
          placeholder="请选择账号状态"
          size="small"
          clearable
          style="width: 200px"
          v-else
        >
          <el-option
            v-for="item in statusListData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
      <el-button type="normal" size="small" icon="el-icon-refresh-right">重置</el-button>
    </div>
    <!-- 表格数据 -->
    <div class="tableWrap">
      <el-table
        :data="customData"
        stripe
        @selection-change="handleSelectionChange"
        ref="customTableRef"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="account" label="账号" min-width="200px"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="overage" label="余额（元）"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" min-width="180px"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作" min-width="150px">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" size="small" @click="handleClick(scope.row)">上分</el-button>
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
    <!-- 弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <Configure :configData="configData" ref="configureRef"></Configure>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="handleSave">{{ confirmBtnText }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { testCustomData } from '@/utils/testData.js'
import Configure from './configure.vue'
export default {
  name: 'custom',
  components: {
    Configure
  },
  data() {
    return {
      selectedItems: [], // 被选中的项的id
      dialogTitle: '群发渠道配置', // 弹框的标题
      dialogVisible: false, // 弹框显示与否
      confirmBtnText: '确认更换', // 弹框确认按钮的文案
      searchData: {
        seatchItem: '',
        searchValue: ''
      },
      configData: {
        // 传id和类型，这个页面的弹框部分都合并到一个组件中了，需要通过flag来判断
        id: 1,
        flag: 1
      },
      searchItemList: [
        {
          name: '账号查询',
          value: 'account'
        },
        {
          name: '备注查询',
          value: 'remark'
        },
        {
          name: '账号状态',
          value: 'status'
        }
      ],
      statusListData: [
        {
          id: 1,
          name: '全部'
        },
        {
          id: 2,
          name: '正常'
        },
        {
          id: 3,
          name: '停用'
        }
      ],
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: testCustomData.length
      }
    }
  },
  computed: {
    customData() {
      return testCustomData
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
    createAccount() {
      // 点击开通账号事件
      this.$router.push('/custom/createCT')
    },
    handleUse() {
      // 点击启用账号事件
      if (this.selectedItems.length <= 0) {
        this.$message.error('请至少选择一项后再启用')
      }
    },
    handleClose() {
      // 点击停用账号事件
      if (this.selectedItems.length <= 0) {
        this.$message.error('请至少选择一项后再停用')
      }
    },
    handleSendWay() {
      // 群发渠道配置弹框
      this.dialogVisible = true
      this.dialogTitle = '群发渠道配置'
      this.confirmBtnText = '确认更换'
      this.configData.flag = 1
    },
    handleEdit() {
      // 点击编辑备注按钮事件
      this.dialogVisible = true
      this.dialogTitle = '编辑'
      this.confirmBtnText = '确定'
      this.configData.flag = 2
    },
    handleClick() {
      // 点击上分按钮事件
      this.dialogVisible = true
      this.dialogTitle = '上分设置'
      this.confirmBtnText = '确定保存'
      this.configData.flag = 3
    },
    handleSave() {
      this.$refs.configureRef.handleSubmit()
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
            this.$refs.customTableRef.toggleRowSelection(i)
          }
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.custom {
  .searchWrap {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .searchOne {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-left: 20px;
      .el-select {
        width: 120px;
        margin-right: -1px;
      }
      .el-input {
        width: 200px;
      }
      /deep/.el-select,
      /deep/.el-input {
        .el-input__inner {
          border-radius: 0;
        }
      }
    }
    .el-button {
      margin-left: 20px;
      &:first-child {
        margin-left: 0;
      }
    }
  }
  .tableWrap {
    margin-top: 20px;
  }
}
</style>
