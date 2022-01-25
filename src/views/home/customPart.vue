<template>
  <div class="customPart">
    <div class="account">
      账户余额
      <span>{{ balance }}</span>
      元
    </div>
    <div class="priceTable">
      <span>产品价格明细</span>
      <el-table :data="priceData" stripe>
        <el-table-column prop="country_name" label="国家"></el-table-column>
        <el-table-column prop="price" label="单价（元）"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getUserBalance, getPriceList } from '@/api/custom.js'
export default {
  name: 'customPart',
  data() {
    return {
      balance: '0.00',
      priceData: []
    }
  },
  mounted() {
    this.initUserBalance()
    this.initPriceList()
  },
  methods: {
    initPriceList() {
      // 初始化产品价格明细
      getPriceList()
        .then(res => {
          this.priceData = res.data.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    initUserBalance() {
      // 用户账户余额
      getUserBalance()
        .then(res => {
          this.balance = res.data.balance
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="less" scoped>
.customPart {
  width: 100%;
  padding: 30px;
  .account {
    text-align: left;
    color: @main-fontcolor;
    font-size: 20px;
    display: flex;
    align-items: center;
    span {
      font-size: 60px;
      color: #3c8dbc;
      margin: 0 20px;
      font-weight: 600;
    }
  }
  .priceTable {
    text-align: left;
    & > span {
      display: block;
      color: @main-fontcolor;
      font-size: 18px;
      margin: 25px 0 20px;
    }
  }
}
</style>
