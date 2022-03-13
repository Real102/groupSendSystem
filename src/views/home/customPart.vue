<template>
  <div class="customPart">
    <div class="account">
      账户余额
      <span>{{ balance }}</span>
      元
    </div>
    <div class="present">
      <span>充值赠送说明</span>
      <el-table :data="czData" stripe>
        <el-table-column prop="amount" label="单次充值金额（元）"></el-table-column>
        <el-table-column prop="give" label="赠送（元）"></el-table-column>
      </el-table>
    </div>
    <div class="banner">
      <el-carousel>
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
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
import { getZSList } from '@/api/manager.js'
export default {
  name: 'customPart',
  data() {
    return {
      balance: '0.00',
      priceData: [],
      czData: []
    }
  },
  mounted() {
    this.initUserBalance()
    this.initPriceList()
    this.initZSList()
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
  .priceTable,
  .present {
    text-align: center;
    font-weight: 600;
    & > span {
      display: block;
      color: @main-fontcolor;
      font-size: 18px;
      margin: 25px 0 20px;
    }
  }
  .banner {
    /deep/.el-carousel {
      height: 200px;
      margin: 20px 0;
      .el-carousel__container {
        height: 100%;
        .el-carousel__item {
          height: 100%;
          background: grey;
          color: #fff;
        }
      }
    }
  }
}
</style>
