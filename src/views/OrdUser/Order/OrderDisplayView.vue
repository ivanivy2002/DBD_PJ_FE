<template>
  <el-container>
    <el-header>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>所有订单</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- NOTE: 这个方法挺厉害的，选中之后调用函数设置不同的activeStatus -->
          <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
            <el-submenu index="1">
              <template #title>
                <i class="el-icon-notebook-1"></i>
                订单分类
              </template>
              <el-menu-item index="1-1">待支付</el-menu-item>
              <el-menu-item index="1-2">待发货</el-menu-item>
              <el-menu-item index="1-3">待收货</el-menu-item>
              <el-menu-item index="1-4">已完成</el-menu-item>
              <el-menu-item index="1-5">已撤销</el-menu-item>
              <el-menu-item index="1-6">已退款</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="18">
          <el-table :data="orderData" stripe style="width: 100%">
            <el-table-column prop="orderNumber" label="订单号" width="180"> </el-table-column>
            <el-table-column prop="productName" label="商品名称"> </el-table-column>
            <el-table-column prop="price" label="价格" width="120"> </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusType(row.status)" disable-transitions>{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="date" label="下单时间" width="180"> </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10, 20, 50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalOrders"
          ></el-pagination>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: 'OrderList',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      orderData: [],
      activeStatus: ''
    }
  },
  created() {
    this.getOrderData()
  },
  methods: {
    getOrderData() {
      // 在此处获取订单数据，例如通过API调用
      // 根据当前页数、页面大小和订单状态筛选数据
      // 更新totalOrders和orderData
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getOrderData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getOrderData()
    },
    handleSelect(key) {
      // 切换订单状态
      this.activeStatus = key
      this.getOrderData()
    },
    statusType(status) {
      switch (status) {
        case '待支付':
          return 'info'
        case '待发货':
          return 'warning'
        case '待收货':
          return 'success'
        case '已完成':
          return 'success'
        case '已撤销':
          return 'danger'
        case '已退款':
          return 'danger'
        default:
          return ''
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');
.el-breadcrumb-item {
  color: #409eff;
}
.el-menu-vertical-demo {
  border-right: none;
}
.el-tag {
  margin-right: 5px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
