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
              <el-menu-item index="待支付">待支付</el-menu-item>
              <el-menu-item index="待发货">待发货</el-menu-item>
              <el-menu-item index="待收货">待收货</el-menu-item>
              <el-menu-item index="已完成">已完成</el-menu-item>
              <el-menu-item index="已撤销">已撤销</el-menu-item>
              <el-menu-item index="已退款">已退款</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="18">
          <el-table :data="orderData" stripe style="width: 100%">
            <el-table-column prop="id" label="订单号" width="180"> </el-table-column>
            <el-table-column prop="shopName" label="店铺"> </el-table-column>
            <el-table-column prop="commodityName" label="商品名称"> </el-table-column>
            <el-table-column prop="imagePath" label="商品图片">
              <template #default="{ row }">
                <img
                  v-for="imageUrl in getImageUrls(row.imagePath)"
                  :key="imageUrl"
                  :src="imageUrl"
                />
              </template>
            </el-table-column>
            <el-table-column prop="paidAmount" label="价格" width="120"> </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" disable-transitions>{{
                  row.status
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间" width="180"> </el-table-column>
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
import axios from 'axios'
export default {
  name: 'OrderList',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      orderData: [],
      allOrders: [], // 新增属性
      activeStatus: '待支付' // 代表当前页面是筛选哪个状态的订单
    }
  },
  created() {
    this.getAllOrders() // 新增方法
    // this.getOrderData() 放到了getAllOrders里面
  },
  methods: {
    getAllOrders() {
      // 新增方法
      const url = '/api/order/' + this.statusSelect(this.activeStatus)
      console.log('11' + url)
      axios
        .get(url, {
          params: { userId: localStorage.getItem('userId') }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            console.log('成功获取所有订单')
            this.allOrders = response.data.data
            this.currentPage = 1 // 重新设置 currentPage 变量
            this.pageSize = 10 // 重新设置 pageSize 变量
            this.getOrderData() // 更新数据和重新渲染
          } else {
            console.log('获取所有订单失败')
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },

    // getOrderData方法开始
    getOrderData() {
      // 计算当前页的起始和结束下标
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
      // 获取当前页的订单数据
      const orders = this.allOrders.slice(startIndex, endIndex)
      // 更新总订单数
      this.totalOrders = this.allOrders.length
      // 更新当前页的订单数据
      this.orderData = orders
    }, // getOrderData方法结束

    getImageUrls(imagePaths) {
      // NOTE: 从后端获取图片的url(特殊URL)
      //  || imagePaths == undefined || imagePaths == ''
      if (!imagePaths) {
        console.log('图片路径为空')
        return []
      }
      const baseUrl = '/api/display/commodity/'
      return imagePaths.split(',').map((imagePath) => `${baseUrl}${imagePath.trim()}`)
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
      console.log(key)
      this.activeStatus = key
      this.getAllOrders()
    },
    statusSelect(status) {
      switch (status) {
        case '待支付':
          return 'displayToBePaid'
        case '待发货':
          return 'displayToBeShipped'
        case '待收货':
          return 'displayToBeConfirmed'
        case '已完成':
          return 'displayFinished'
        case '已撤销':
          return 'displayRevoked'
        case '已退款':
          return 'displayRefunded'
        default:
          return ''
      }
    },
    statusTagType(status) {
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
