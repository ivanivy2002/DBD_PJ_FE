<template>
  <div class="order-detail">
    <h2>订单详情</h2>
    <el-row>
      <el-col :span="12">
        <div class="detail-item">
          <strong>订单号：</strong>
          {{ order.id }}
        </div>
        <div class="detail-item">
          <strong>店铺名：</strong>
          {{ order.store }}
        </div>
        <div class="detail-item">
          <strong>商品名：</strong>
          {{ order.product }}
        </div>
        <div class="detail-item">
          <strong>商品价格：</strong>
          {{ order.price }}
        </div>
      </el-col>
      <el-col :span="12">
        <strong>订单状态：</strong>
        <el-steps :active="order.status" align-center>
          <el-step title="新订单"></el-step>
          <el-step title="已付款"></el-step>
          <el-step title="已发货"></el-step>
          <el-step title="已收货"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        id: '123456789',
        store: 'Amazing Store',
        product: 'Awesome Product',
        price: '99.99',
        status: 1
      }
    }
  }
}
</script>

<style scoped>
.order-detail {
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
}

.detail-item {
  margin-bottom: 10px;
}
</style>
