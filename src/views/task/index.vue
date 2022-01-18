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
          v-model="searchData.taskStatus"
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
      <el-button type="primary" size="small" icon="el-icon-search">查询</el-button>
      <el-button type="normal" size="small" icon="el-icon-refresh-right">重置</el-button>
    </div>
    <!-- 表格展示数据 -->
    <div class="tableWrap">
      <el-table :data="sendData" stripe ref="sendTableRef">
        <el-table-column prop="order" label="序号" width="55"></el-table-column>
        <el-table-column prop="taskId" label="任务id"></el-table-column>
        <el-table-column prop="account" label="用户账号"></el-table-column>
        <el-table-column prop="sendWay" label="当前群发渠道"></el-table-column>
        <el-table-column prop="taskName" label="任务名称"></el-table-column>
        <el-table-column prop="materialName" label="料子名称"></el-table-column>
        <el-table-column prop="amount" label="金额（元）"></el-table-column>
        <el-table-column prop="taskNum" label="任务数（条）"></el-table-column>
        <el-table-column prop="resolveNum" label="完成数（条）"></el-table-column>
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="status" label="状态"></el-table-column>
        <el-table-column prop="startTime" label="开始时间"></el-table-column>
        <el-table-column prop="endTime" label="完成时间"></el-table-column>
        <el-table-column prop="reason" label="异常原因"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-select
              v-model="operate"
              size="small"
              @change="handleChageOperation(scope.row)"
              placeholder="更多操作"
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
          这是内容这是内容这是内容这是内容这是内容这是内容这是内容
          这是内容这是内容这是内容这是内容这是内容这是内容这是内容
          这是内容这是内容这是内容这是内容这是内容这是内容这是内容
        </div>
        <div class="gsEdit" v-else>
          <span class="redStar">选择群发渠道：</span>
          <el-select v-model="sw" size="small" placeholder="请选择群发渠道">
            <el-option
              v-for="item in swList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
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
import { testSendData } from '@/utils/testData.js'
export default {
  name: 'task',
  data() {
    return {
      sendDialogTitle: '查看内容', // 弹框标题
      sendDialogVisible: false, // 弹框显隐状态
      sw: '',
      searchData: {
        taskName: 'taskname',
        taskValue: '',
        timeName: 'startTime',
        timeValue: ''
      },
      operate: '',
      handlerList: [
        {
          name: '查看内容',
          value: 1
        },
        {
          name: '停止任务',
          value: 2
        },
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
          id: 1,
          name: '全部'
        },
        {
          id: 2,
          name: '待执行'
        },
        {
          id: 3,
          name: '执行中'
        },
        {
          id: 4,
          name: '已完成'
        }
      ],
      swList: [
        {
          name: '使用尚信群发接口',
          id: 1
        },
        {
          name: '使用xx群发接口',
          id: 2
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
    sendData() {
      return testSendData
    }
  },
  methods: {
    handleSizeChange(val) {
      this.paginationData.pageSize = val
    },
    handleCurrentChange(val) {
      this.paginationData.currentPage = val
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
      if (this.operate === 1) {
        this.sendDialogVisible = true
        this.sendDialogTitle = '查看内容'
      } else if (this.operate === 3) {
        this.sendDialogVisible = true
        this.sendDialogTitle = '更换渠道'
      } else {
        // 点击删除
        console.log(row.id)
      }
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
