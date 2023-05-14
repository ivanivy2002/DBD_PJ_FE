<template>
  <el-container>
    <el-aside width="200px">
      <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1">发货管理</el-menu-item>
        <el-menu-item index="2">退货退款</el-menu-item>
      </el-menu>
    </el-aside>

    <el-main>
      <div v-if="currentView === '1'">
        <el-table :data="orders" style="width: 100%">
          <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <el-table-column prop="unitPrice" label="商品单价"></el-table-column>
          <el-table-column prop="quantity" label="购买数量"></el-table-column>
          <el-table-column prop="totalPrice" label="订单总价"></el-table-column>
          <el-table-column prop="purchaseTime" label="购买时间"></el-table-column>
          <el-table-column prop="address" label="收货地址"></el-table-column>
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button @click="handleDelivery(row)">发货</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-if="currentView === '2'">
        <el-table :data="returns" style="width: 100%">
          <el-table-column prop="orderNumber" label="订单编号"></el-table-column>
          <el-table-column prop="productName" label="商品名称"></el-table-column>
          <!-- other columns as needed -->
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button @click="handleRefund(row)">同意退款</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { reactive } from 'vue'
import axios from 'axios'
export default {
  name: 'ManageOrderView',
  data() {
    return {
      currentView: '1',
      orders: [], // Replace with actual data fetching
      returns: [] // Replace with actual data fetching
    }
  },
  created() {

  },
  methods: {
    getOrderInfo() {
      // 发送请求获取订单信息
      // await axios.get('/api/order/displayOrder', {
      //   params: {orderId: localStorage.getItem('orderId')}
      // })
      //   .then(res => {
      //     this.orderPrice = res.data.data.price;
      //   })
    },
    handleSelect(index) {
      this.currentView = index
    },
    handleDelivery(order) {
      
    },
    handleRefund(order) {
      
    }
  }
}
</script>


<style scoped>
.el-menu-vertical-demo {
  border-right: 1px solid #eee;
}
</style>
