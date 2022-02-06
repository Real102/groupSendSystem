<template>
  <div class="task">
    <!-- 搜索区域 -->
    <div class="searchWrap">
      <div class="searchOne">
        <el-select v-model="searchData.taskName" size="small">
          <el-option
            v-for="item in taskSearchList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-input
          type="text"
          size="small"
          v-model="searchData.taskValue"
          v-if="searchData.taskName !== 'taskStatus'"
        ></el-input>
        <el-select
          v-model="searchData.taskValue"
          placeholder="请选择任务状态"
          size="small"
          clearable
          style="width: 200px"
          v-else
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
        <el-select v-model="searchData.timeName" size="small">
          <el-option
            v-for="item in timeSearchList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="searchData.timeValue"
          type="datetime"
          placeholder="选择日期时间"
          size="small"
        >
        </el-date-picker>
      </div>
      <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch"
        >查询</el-button
      >
      <el-button type="normal" size="small" icon="el-icon-refresh-right" @click="handleReset"
        >重置</el-button
      >
    </div>
    <!-- 表格展示数据 -->
    <div class="tableWrap">
      <el-table :data="sendData" stripe ref="sendTableRef">
        <el-table-column prop="order" label="序号" width="55"></el-table-column>
        <el-table-column prop="task_sn" label="任务id"></el-table-column>
        <el-table-column prop="account" label="用户账号"></el-table-column>
        <el-table-column prop="channel_name" label="当前群发渠道"></el-table-column>
        <el-table-column prop="task_name" label="任务名称"></el-table-column>
        <el-table-column prop="material_name" label="料子名称"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="task_num" label="任务数（条）"></el-table-column>
        <el-table-column prop="complete_num" label="完成数（条）"></el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="begin_time" label="开始时间"></el-table-column>
        <el-table-column prop="end_time" label="完成时间"></el-table-column>
        <el-table-column prop="err_reason" label="异常原因"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.operate"
              size="small"
              @change="handleChageOperation(scope.row)"
              placeholder="更多操作"
              clearable
            >
              <el-option
                v-for="item in handlerList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
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
      :title="sendDialogTitle"
      :visible.sync="sendDialogVisible"
      :close-on-click-modal="false"
      width="500px"
    >
      <div>
        <div class="sendDetailDialog" v-if="sendDialogTitle === '查看内容'">
          {{ err_reason }}
        </div>
        <div class="gsEdit" v-else>
          <span class="redStar">选择群发渠道：</span>
          <el-select v-model="sw" size="small" placeholder="请选择群发渠道">
            <el-option
              v-for="item in swList"
              :key="item.channel_id"
              :label="item.channel_name"
              :value="item.channel_id"
            ></el-option>
          </el-select>
          <div class="swTips">
            <p>规则：</p>
            <p>1、默认使用的筛数据服务为尚信筛数据接口。</p>
            <p>2、更换渠道时，只针对新的任务，不影响已经创建的任务。</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="sendDialogVisible = false"
          v-if="sendDialogTitle !== '查看内容'"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTaskList } from '@/api/manager.js'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'task',
  data() {
    return {
      sendDialogTitle: '查看内容', // 弹框标题
      sendDialogVisible: false, // 弹框显隐状态
      err_reason: '', // 当前弹框显示的异常内容
      sw: '',
      sendData: [],
      searchData: {
        taskName: 'taskname',
        taskValue: '',
        timeName: 'startTime',
        timeValue: ''
      },
      handlerList: [
        {
          name: '查看内容',
          value: 1
        },
        // {
        //   name: '停止任务',
        //   value: 2
        // },
        {
          name: '更换渠道执行',
          value: 3
        }
      ],
      taskSearchList: [
        {
          name: '任务名称',
          value: 'taskname'
        },
        {
          name: '任务ID',
          value: 'taskId'
        },
        {
          name: '用户账号',
          value: 'account'
        },
        {
          name: '任务状态',
          value: 'taskStatus'
        }
      ],
      timeSearchList: [
        {
          name: '开始时间',
          value: 'startTime'
        },
        {
          name: '结束时间',
          value: 'endTime'
        }
      ],
      taskStatusData: [
        {
          id: 3,
          name: '全部'
        },
        {
          id: 0,
          name: '待执行'
        },
        {
          id: 1,
          name: '执行中'
        },
        {
          id: 2,
          name: '已完成'
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
  watch: {
    'searchData.taskName': {
      handler: function () {
        this.searchData.taskValue = ''
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    swList() {
      return this.$store.state.swList
    }
  },
  mounted() {
    this.initTaskList()
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      this.initTaskList()
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.initTaskList()
    },
    handleReset() {
      this.searchData = this.$options.data().searchData
    },
    handleSearch() {
      this.paginationData.currentPage = 1
      this.initTaskList()
    },
    handleConfirm() {
      // 弹框点击确定按钮触发
      this.sendDialogVisible = false
      if (this.sendDialogTitle === '更换渠道') {
        // 如果是修改渠道，那么需要在点击确定按钮之后提交渠道信息
        // TODO: 需要对数据格式进行处理
      }
    },
    handleChageOperation(row) {
      // 切换操作的时候触发事件
      if (row.operate === 1) {
        this.sendDialogVisible = true
        this.sendDialogTitle = '查看内容'
        this.err_reason = row.err_reason || '暂无内容'
      } else if (row.operate === 3) {
        // 增加个判断，避免每次点击按钮都请求接口
        // if (this.swList.length <= 0) {
        //   this.$store.dispatch('getSwList').then(() => {
        //     this.sendDialogVisible = true
        //     this.sendDialogTitle = '更换渠道'
        //   })
        // } else {
        //   this.sendDialogVisible = true
        //   this.sendDialogTitle = '更换渠道'
        // }
        // 目前只有一个渠道，暂时只弹框提示用户
        this.$message.info('目前只有一个群发渠道，暂不支持更换！')
      } else {
        // 点击删除
        console.log(row.id)
      }
    },
    initTaskList() {
      const params = {
        page: this.paginationData.currentPage,
        'per-page': this.paginationData.pageSize,
        time_type: this.searchData.timeName === 'startTime' ? 1 : 2,
        // 字段用的都是同一个，但接口是分开的，所以...略微麻烦点
        begin_time:
          this.searchData.timeName === 'startTime'
            ? new Date(this.searchData.timeValue).getTime()
            : undefined,
        end_time:
          this.searchData.timeName === 'endTime'
            ? new Date(this.searchData.timeValue).getTime()
            : undefined,
        keyword: this.searchData.taskName === 'taskname' ? this.searchData.taskValue : undefined,
        account: this.searchData.taskName === 'account' ? this.searchData.taskValue : undefined,
        task_no: this.searchData.taskName === 'taskId' ? this.searchData.taskValue : undefined,
        status: this.searchData.taskName === 'taskStatus' ? this.searchData.taskValue : undefined
      }
      getTaskList(params)
        .then(res => {
          const { list } = res.data
          this.paginationData.total = res.data.total
          this.formatData(list)
        })
        .catch(err => {
          console.log(err)
        })
    },
    formatData(list) {
      // 列表数据格式化
      this.sendData = []
      list.forEach((item, index) => {
        item.begin_time = parseTime(item?.begin_time)
        item.end_time = parseTime(item?.end_time)
        item.status = this.taskStatusData.find(i => i.id === item.status)?.name
        item.order = ++index
        item.operate = ''
        this.sendData.push(item)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.task {
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
      &:first-child {
        margin-left: 0;
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
  .swTips {
    margin-top: 40px;
    p {
      text-align: left;
      text-indent: 20px;
      line-height: 24px;
    }
  }
}
</style>
