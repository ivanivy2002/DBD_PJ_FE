<template>
  <el-container>
    <!-- <el-aside width="200px">
      <el-menu default-active="1" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item index="1">发货管理</el-menu-item>
        <el-menu-item index="2">退货退款</el-menu-item>
      </el-menu>
    </el-aside> -->

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
              <el-menu-item index="所有订单">所有订单</el-menu-item>
              <el-menu-item index="发货管理">发货管理</el-menu-item>
              <el-menu-item index="退货管理">退货管理</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>
        <el-col :span="18">
          <el-table :data="orderData" style="width: 100%">
            <el-table-column prop="id" label="订单号" width="80px"> </el-table-column>
            <!-- <el-table-column prop="shopName" label="店铺"> </el-table-column> -->
            <el-table-column prop="commodityName" label="商品名称" width="180px"> </el-table-column>
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
            <el-table-column prop="commodityNum" label="数量" width="100"> </el-table-column>
            <el-table-column prop="status" label="状态" width="120">
              <template #default="{ row }">
                <el-tag :type="statusTagType(row.status)" disable-transitions>{{
                  row.status
                }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button
                  v-if="activeStatus === '发货管理'"
                  @click="handleDelivery(row)"
                  type="default"
                  >发货</el-button
                >
                <el-button
                  v-if="activeStatus === '退货管理'"
                  @click="handleRefund(row)"
                  type="success"
                  >同意</el-button
                >
                <el-button v-if="activeStatus === '退货管理'" disabled type="danger"
                  >拒绝</el-button
                >
              </template>
            </el-table-column>
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
import { ElMessage } from 'element-plus'
export default {
  name: 'ManageOrderView',
  data() {
    return {
      currentPage: '2',
      pageSize: 10,
      totalOrders: 0,
      currentView: '1',
      orderData: [],
      allOrders: [],
      activeStatus: '所有订单'
      // refundData: []
    }
  },
  mounted() {
    // if (this.currentView == '1') {
    //   this.getOrderInfo()
    // } else if (this.currentView == '2') {
    // this.getRefundInfo()
    this.getAllOrders()
    console.log(88)
    // }
  },
  methods: {
    getOrderInfo() {
      // 发送请求获取订单信息
    },
    async getAllOrders() {
      // 发送请求获取退款信息
      const url = '/api/order/' + this.statusSelect(this.activeStatus)
      await axios
        .get(url, {
          params: { shopId: localStorage.getItem('shopId') }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('拿取信息成功')
            this.allOrders = response.data.data
            console.log(this.allOrders)
            // 在这里进行过滤
            // this.allOrders = this.allOrders.filter((order) => order.removeStatus !== '已删除')
            console.log(this.allOrders)
            this.currentPage = 1 // 重新设置 currentPage 变量，这个很关键
            this.pageSize = 10 // 重新设置 pageSize 变量
            // 分页设置，具体的注释看OrderDisplayView
            const startIndex = (this.currentPage - 1) * this.pageSize
            const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
            const orders = this.allOrders.slice(startIndex, endIndex)
            // BUG: 这里order是空的，但是this.allOrders不是空的
            console.log(orders)
            this.totalOrders = this.allOrders.length
            this.orderData = orders
            console.log(this.orderData)
            // NOTE: 调用id查询函数
            this.changeInfoById()
          } else {
            console.log('拿取信息失败')
            this.$message({
              type: 'success',
              message: '撤销订单成功'
            })
          }
        })
    },
    // NOTE: 通过id查询order的具体各个属性
    async changeInfoById() {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      for (let i = 0; i < this.orderData.length; i++) {
        const order = this.orderData[i]
        const commodityInfo = await this.getCommodityInfo(order.commodityId)
        const shopInfo = await this.getShopInfo(order.shopId)
        order.commodityName = commodityInfo.commodityName
        order.price = commodityInfo.price
        order.imagePath = commodityInfo.imagePath
        order.shopName = shopInfo.shopName
        // this.$set(this.orderData, i, order)
        this.orderData[i] = { ...order } // 将order对象复制到orderData数组的第i个位置
      }
    },
    // NOTE: 通过commodityId查询commodity的各个属性
    async getCommodityInfo(commodityId) {
      let commodityInfo = {}
      await axios
        .get('/api/commodity/displayInfo', {
          params: { commodityId: commodityId }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            console.log('成功获取商品信息')
            console.log(response.data.data)
            commodityInfo = response.data.data
          } else {
            console.log('获取商品信息失败')
            commodityInfo = {} // 返回一个空对象
          }
        })
        .catch((error) => {
          console.log(error)
          commodityInfo = {} // 返回一个空对象
        })
      return commodityInfo
    },
    // NOTE: 通过shopId查询shop的各个属性
    async getShopInfo(shopId) {
      let shopInfo = {} //* 为了使整个函数返回一个对象，所以这里先定义一个空对象
      await axios
        .get('/api/shop/displayInfo', {
          params: { shopId: shopId }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            console.log('成功获取店铺信息')
            console.log(response.data.data)
            shopInfo = response.data.data
          } else {
            console.log('获取店铺信息失败')
            shopInfo = {} // 返回一个空对象
          }
        })
        .catch((error) => {
          console.log(error)
          shopInfo = {} // 返回一个空对象
        })
      return shopInfo
    },
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
    // 选择哪个视图
    handleSelect(key) {
      this.activeStatus = key
      this.getAllOrders()
    },
    handleDelivery(row) {
      // 发送请求，将订单状态改为已发货
      this.$confirm('确定要发货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .post('/api/shop/deliverCommodity', null, {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              console.log(response)
              if (response.data.code == 200) {
                console.log('发货成功')
                this.$message({
                  type: 'success',
                  message: '发货成功'
                })
                this.getAllOrders()
              } else {
                console.log('发货失败')
                this.$message({
                  type: 'error',
                  message: '发货失败: ' + response.data.msg
                })
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message({
                type: 'error',
                message: '发货失败'
              })
            })
        })
        .catch(() => {
          // 用户点击了取消按钮
        })
    },
    // NOTE: 允许退款
    handleRefund(row) {
      this.$confirm('确认同意退款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .post('/api/shop/handleOrderRefund', null, {
              params: {
                orderId: row.id,
                ifApprove: 1
              }
            })
            .then((response) => {
              if (response.data.code == 200) {
                console.log('退款成功')
                this.$message({
                  type: 'success',
                  message: '退款成功'
                })
                this.getAllOrders()
              } else {
                console.log('退款失败')
                console.log(response.data.msg)
                ElMessage({
                  //用于弹出消息提示
                  showClose: true,
                  type: 'danger', //如果失败
                  message: response.data.msg //弹出的消息内容
                })
              }
            })
            .catch((error) => {
              console.log(error)
              this.$message({
                type: 'error',
                message: '退款失败'
              })
            })
        })
        .catch(() => {
          // 点击取消按钮
        })
    },
    // NOTE: 和分页有关的方法
    handleSizeChange(val) {
      this.pageSize = val
      // 计算当前页的起始和结束下标
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
      // 获取当前页的订单数据
      const orders = this.allOrders.slice(startIndex, endIndex)
      // 更新总订单数
      this.totalOrders = this.allOrders.length
      // 更新当前页的订单数据
      this.orderData = orders
      // this.getAllOrders()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      // 计算当前页的起始和结束下标
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
      // 获取当前页的订单数据
      const orders = this.allOrders.slice(startIndex, endIndex)
      // 更新总订单数
      this.totalOrders = this.allOrders.length
      // 更新当前页的订单数据
      this.orderData = orders
    },
    statusSelect(status) {
      switch (status) {
        case '所有订单':
          return 'displayAllForShop'
        case '发货管理':
          return 'displayShipToUser'
        case '退货管理':
          return 'displayToBeRefunded'
        default:
          console.log('错误!!未知的status')
          console.log(status)
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
img {
  width: 50px;
  height: 50px;
}
.el-menu-vertical-demo {
  border-right: 1px solid #eee;
}
</style>
