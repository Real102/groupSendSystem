<template>
  <div class="send">
    <!-- 搜索区域 -->
    <div class="searchWrap">
      <el-button
        type="success"
        size="small"
        icon="el-icon-position"
        @click="handleEditTask('create')"
        >创建WS群发任务</el-button
      >
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
          value-format="timestamp"
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
        <el-table-column prop="task_sn" label="任务id" min-width="150px"></el-table-column>
        <el-table-column prop="task_name" label="任务名称"></el-table-column>
        <el-table-column prop="material_name" label="料子名称"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="task_num" label="任务数（条）"></el-table-column>
        <el-table-column prop="complete_num" label="完成数（条）"></el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="begin_time" label="开始时间" min-width="180px"></el-table-column>
        <el-table-column prop="end_time" label="完成时间" min-width="180px"></el-table-column>
        <el-table-column label="操作" width="210px" fixed="right">
          <template slot-scope="scope">
            <div class="tableBtn">
              <el-button type="text" size="small" @click="handleShow(scope.row)">
                查看内容
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="handleEditService(scope.row)"
                :disabled="!scope.row.isEditAble"
              >
                修改客服号
              </el-button>
              <el-button type="text" size="small" @click="handleExport(scope.row)">
                导出报表
              </el-button>
            </div>
            <!-- <div class="tableBtn">
              <el-button type="success" size="small" @click="handleEditTask(scope.row)">
                修改任务
              </el-button>
              <el-button type="success" size="small" @click="handleExport(scope.row)">
                导出报表
              </el-button>
            </div> -->
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
        <div class="sendDetailDialog" v-if="sendDialogTitle === '群发详情'">
          {{ err_reason }}
        </div>
        <div class="editPhoneDialog" v-else>
          <el-input type="textarea" v-model="sphone" rows="8" resize="none"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="small"
          @click="sendDialogVisible = false"
          v-if="sendDialogTitle !== '群发详情'"
          >取 消</el-button
        >
        <el-button size="small" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getTaskList } from '@/api/manager.js'
import { changeService, downloadReport } from '@/api/custom.js'
import { parseTime } from '@/utils/index.js'
export default {
  name: 'send',
  data() {
    return {
      sendDialogTitle: '群发详情', // 弹框标题
      sendDialogVisible: false, // 弹框显隐状态
      err_reason: '', // 当前弹框显示的内容
      currentId: '', // 当前选中项的id
      sphone: '', // 客服号
      sendData: [],
      searchData: {
        taskName: 'taskname',
        taskValue: undefined,
        timeName: 'startTime',
        timeValue: undefined
      },
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
          id: undefined,
          name: '全部'
        },
        {
          id: '0',
          name: '待执行'
        },
        {
          id: '1',
          name: '执行中'
        },
        {
          id: '2',
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
  mounted() {
    this.initSendList()
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
      this.initSendList()
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
      this.initSendList()
    },
    handleReset() {
      this.searchData = this.$options.data().searchData
    },
    handleSearch() {
      this.paginationData.currentPage = 1
      this.initSendList()
    },
    handleShow(row) {
      // 点击查看内容按钮
      this.sendDialogVisible = true
      this.sendDialogTitle = '群发详情'
      this.err_reason = row.err_reason || '暂无内容'
    },
    handleEditService(row) {
      // 点击修改客服号按钮
      this.sendDialogVisible = true
      this.sendDialogTitle = '修改客服号'
      this.currentId = row.id
    },
    handleConfirm() {
      // 弹框点击确定按钮触发
      this.sendDialogVisible = false
      if (this.sendDialogTitle === '修改客服号') {
        // 如果是修改客服号，那么需要在点击确定按钮之后提交客服号信息
        // TODO: 需要对数据格式进行处理
        const data = {
          id: this.currentId,
          customer_code: this.sphone
        }
        changeService(data)
          .then(() => {
            this.$message.success('修改成功')
            this.initSendList()
            this.sendDialogVisible = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    handleEditTask(row) {
      if (typeof row === 'object') {
        localStorage.setItem('sendData', JSON.stringify(row))
      } else {
        localStorage.removeItem('sendData')
      }
      this.$router.push('/send/sendTask')
    },
    handleExport(row) {
      downloadReport({ id: row.id })
        .then(res => {
          const { url } = res.data
          window.open(url)
        })
        .catch(err => {
          console.log(err)
        })
    },
    initSendList() {
      // 初始化列表数据
      const params = {
        page: this.paginationData.currentPage,
        'per-page': this.paginationData.pageSize,
        time_type: this.searchData.timeName === 'startTime' ? 1 : 2,
        // 字段用的都是同一个，但接口是分开的，所以...略微麻烦点
        // 这里的时间自动传了NAN，因为timeValue的默认值是undefined，getTime就变成了NAN了。目前接口不影响，暂未修改
        begin_time:
          this.searchData.timeName === 'startTime'
            ? String(this.searchData.timeValue)?.split('').splice(0, 10).join('')
            : undefined,
        end_time:
          this.searchData.timeName === 'endTime'
            ? String(this.searchData.timeValue)?.split('').splice(0, 10).join('')
            : undefined,
        keyword: this.searchData.taskName === 'taskname' ? this.searchData.taskValue : undefined,
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
        item.isEditAble = new Date().getTime() - item.begin_time < 0
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
.send {
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
    .tableBtn {
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 5px 0;
      .el-button {
        // width: 85px;
        margin: 0;
        // padding: 9px 10px;
        padding: 9px 5px !important;
        // &:first-child {
        //   margin-right: 10px;
        // }
      }
    }
  }
}
</style>
