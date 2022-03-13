<template>
  <div class="system">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="赠送金额" name="present">
        <div class="ps-one" v-for="(item, index) in czData" :key="index">
          <div class="ps-item">
            <span>充值金额（$）：</span>
            <el-input type="text" clearable size="small" v-model="item.amount"></el-input>
          </div>
          <div class="ps-item">
            <span>赠送金额（$）：</span>
            <el-input type="text" clearable size="small" v-model="item.give"></el-input>
          </div>
          <el-button
            type="primary"
            size="small"
            @click="handleAdd"
            v-if="index === czData.length - 1"
            >新增</el-button
          >
          <el-button type="danger" size="small" @click="handleDelete(item)">删除</el-button>
        </div>
        <!-- <el-button type="success" size="small" class="saveBtn" @click="handleSave">保存</el-button> -->
      </el-tab-pane>
      <el-tab-pane label="群发设置" name="send">
        <div class="send-tab">
          <p>
            群发完成率为：<el-input size="small" type="text" v-model="rate"></el-input
            >%时，停止群发，视为完成任务。
          </p>
          <el-button type="success" size="small" @click="handleConfirm">保存</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getZSList, deleteZSItem, addZSItem } from '@/api/manager.js'
export default {
  name: 'system',
  data() {
    return {
      activeName: 'present',
      czData: [],
      rate: null
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initZSList()
    })
  },
  methods: {
    initZSList() {
      getZSList()
        .then(res => {
          this.czData = res.data.list
          // 补充一条空数据
          this.czData.push({
            amount: null,
            give: null
          })
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClick() {},
    handleAdd() {
      const arr = [...this.czData]
      const len = this.czData.length
      if (arr[len - 1].amount && arr[len - 1].give) {
        const data = {
          amount: arr[len - 1].amount,
          give: arr[len - 1].give
        }
        addZSItem(data)
          .then(() => {
            this.$message.success('添加成功')
            this.czData.push({
              amount: undefined,
              give: undefined,
              id: undefined
            })
          })
          .catch(err => {
            this.$message.warning(err.message)
          })
      } else {
        this.$message.warning('请填完当前项再添加')
      }
    },
    handleDelete(item) {
      this.$confirm('请再次确认是否要删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: item.id
          }
          deleteZSItem(data)
            .then(() => {
              this.$message.success('删除成功！')
              this.initZSList()
            })
            .catch(err => {
              this.$message.warning(err.data)
            })
        })
        .catch(e => {
          console.log(e)
        })
    },
    handleSave() {
      const arr = [...this.czData]
      const len = arr.length
      if (!Object.values(arr[len - 1]).some(v => !!v)) {
        arr.pop()
      }
      if (arr.length > 0) {
        // 如果有填写的话，提交数据，没有填写则不提交
      } else {
        this.$message.warning('请至少填写一项后再提交')
      }
    },
    handleConfirm() {}
  }
}
</script>
<style lang="less" scoped>
.system {
  width: 100%;
  .ps-one {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 20px;
    .ps-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-right: 20px;
      span {
        width: 110px;
        flex-shrink: 0;
        text-align: left;
      }
    }
    .el-button {
      margin: 0;
      margin-right: 20px;
    }
  }
  .saveBtn {
    float: left;
    margin-left: 350px;
  }
  .send-tab {
    text-align: left;
    .el-input {
      width: 100px;
      margin-right: 10px;
    }
    .el-button {
      margin-left: 200px;
      margin-top: 20px;
    }
  }
}
</style>
