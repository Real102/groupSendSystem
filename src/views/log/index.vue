<template>
  <div class="log">
    <div class="searchWrap">
      <div class="searchOne">
        <span>业务类型：</span>
        <el-select
          v-model="searchData.taskType"
          placeholder="请选择业务类型"
          size="small"
          clearable
        >
          <el-option
            v-for="item in taskTypeData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="searchOne">
        <span>业务状态：</span>
        <el-select
          v-model="searchData.taskStatus"
          placeholder="请选择业务状态"
          size="small"
          clearable
        >
          <el-option
            v-for="item in taskStatusData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>
      <div class="searchOne">
        <span>账号查询：</span>
        <el-input placeholder="请输入账号" v-model="searchData.account" size="small"></el-input>
      </div>
      <div class="btnWrap">
        <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
        <el-button type="normal" size="small" icon="el-icon-refresh-right">重置</el-button>
      </div>
    </div>
    <div class="tableWrap">
      <el-table :data="logData" stripe ref="logTableRef">
        <el-table-column prop="order" label="序号" width="55"> </el-table-column>
        <el-table-column prop="taskType" label="业务类型"></el-table-column>
        <!-- TODO: 目标账号仅在管理员账号下可见 -->
        <el-table-column prop="targetAccount" label="目标账号" min-width="200px"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="overage" label="余额（元）"></el-table-column>
        <el-table-column prop="income" label="收入/支出"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180px"></el-table-column>
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
  </div>
</template>
<script>
import { testLogData, testTaskTypeData, testTaskStatusData } from '@/utils/testData.js'
export default {
  name: 'log',
  data() {
    return {
      searchData: {
        taskType: '',
        account: '',
        taskStatus: ''
      },
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: testLogData.length
      }
    }
  },
  computed: {
    // TODO: 以下都是测试数据，需要接口返回
    taskTypeData() {
      return testTaskTypeData
    },
    logData() {
      return testLogData
    },
    taskStatusData() {
      return testTaskStatusData
    }
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
    }
  }
}
</script>
<style lang="less" scoped>
.log {
  overflow: hidden;
  .searchWrap {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;
    .el-input,
    .el-select {
      width: 200px;
      margin-right: 20px;
    }
    .el-button {
      margin: 0 20px 0 0;
      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>
