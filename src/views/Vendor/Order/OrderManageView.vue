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
import { ref } from 'vue'

export default {
  name: 'ManageOrderView',
  setup() {
    const currentView = ref('1')
    const orders = ref([]) // Replace with actual data fetching
    const returns = ref([]) // Replace with actual data fetching

    const handleSelect = (index) => {
      currentView.value = index
    }

    const handleDelivery = (order) => {
      // Handle delivery logic here
    }

    const handleRefund = (order) => {
      // Handle refund logic here
    }

    return {
      currentView,
      orders,
      returns,
      handleSelect,
      handleDelivery,
      handleRefund
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: 1px solid #eee;
}
</style>
