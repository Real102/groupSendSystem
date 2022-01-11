<template>
  <div class="customPart">
    <div class="account">账户余额<span>111,222,000</span>元</div>
    <div class="priceTable">
      <span>产品价格明细</span>
      <el-table :data="priceData">
        <el-table-column prop="country" label="国家"></el-table-column>
        <el-table-column prop="price" label="单价（元）"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'customPart',
  data() {
    return {
      priceData: [
        {
          country: '中国',
          price: '1000'
        },
        {
          country: '俄罗斯',
          price: '1000'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.customPart {
  width: 100%;
}
</style>
