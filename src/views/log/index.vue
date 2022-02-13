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
            :key="item.value"
            :label="item.name"
            :value="item.value"
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
            :key="item.value"
            :label="item.name"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="searchOne" v-if="role === 0">
        <span>账号查询：</span>
        <el-input placeholder="请输入账号" v-model="searchData.account" size="small"></el-input>
      </div>
      <div class="btnWrap">
        <el-button type="primary" size="small" icon="el-icon-search" @click="initLogList"
          >查询</el-button
        >
        <el-button type="normal" size="small" icon="el-icon-refresh-right" @click="resetSearch"
          >重置</el-button
        >
      </div>
    </div>
    <div class="tableWrap">
      <el-table :data="logData" stripe ref="logTableRef">
        <el-table-column prop="order" label="序号" width="55"> </el-table-column>
        <el-table-column prop="taskType" label="业务类型"></el-table-column>
        <!-- TODO: 目标账号仅在管理员账号下可见 -->
        <el-table-column prop="account" label="目标账号" v-if="role === 0"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="balance" label="余额（元）"></el-table-column>
        <el-table-column prop="income" label="收入/支出"></el-table-column>
        <el-table-column prop="create_time" label="创建时间"></el-table-column>
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
import { getLog, getLogType } from '@/api/sign.js'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'log',
  data() {
    return {
      logData: [],
      searchData: {
        taskType: '',
        account: '',
        taskStatus: ''
      },
      taskTypeData: [],
      taskStatusData: [
        {
          name: '收入',
          value: 0
        },
        {
          name: '支出',
          value: 1
        }
      ],
      paginationData: {
        // 表单数据
        currentPage: 1,
        sizes: [10, 30, 50, 100],
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    role() {
      return this.$store.state.user.userInfo.role
    }
  },
  mounted() {
    this.initLogType()
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      this.initLogList()
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.initLogList()
    },
    initLogList() {
      // 初始化表格数据
      this.logData = []
      const params = {
        page: this.paginationData.currentPage,
        'per-page': this.paginationData.pageSize,
        keyword: this.searchData.account || undefined,
        type: this.searchData.taskType || undefined,
        inc_dec_type: this.searchData.taskStatus || undefined
      }
      getLog(params)
        .then(res => {
          const { list } = res.data
          this.logData = []
          list.forEach((item, index) => {
            const tt = this.taskTypeData.find(i => i.value === item.type)
            const ts = this.taskStatusData.find(i => i.value === item.inc_dec_type)
            this.logData.push({
              ...item,
              order: ++index,
              taskType: tt?.name || '',
              income: ts?.name || '',
              create_time: parseTime(item.create_time)
            })
          })
          this.paginationData.total = res.data.total
        })
        .catch(err => {
          console.log(err)
        })
    },
    initLogType() {
      // 初始化日志中的业务类型/日志类型选项
      if (Object.keys(this.taskTypeData).length <= 0) {
        // 如果已经有了，那么就不重复获取了，减少http请求
        getLogType()
          .then(res => {
            this.taskTypeData = res.data
            this.initLogList()
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    resetSearch() {
      this.searchData = this.$options.data().searchData
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
