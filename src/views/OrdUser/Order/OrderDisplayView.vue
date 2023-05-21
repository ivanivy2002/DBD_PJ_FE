<template>
  <div class="container">
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
                <el-menu-item index="所有订单">所有订单</el-menu-item>
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
              <el-table-column prop="id" label="订单号" width="80px"> </el-table-column>
              <el-table-column prop="shopName" label="店铺" style="width: 70px"> </el-table-column>
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
              <el-table-column prop="commodityNum" label="数量" width="50px"> </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="statusTagType(row.status)" disable-transitions>{{
                    row.status
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="下单时间" width="180"> </el-table-column>
              <el-table-column label="操作" width="320">
                <template #default="{ row }">
                  <el-button
                    v-if="activeStatus === '所有订单'"
                    type="default"
                    size="mini"
                    @click="navigateToOrderDetail(row)"
                    >详情</el-button
                  >
                  <el-button
                    v-if="activeStatus === '待支付'"
                    type="primary"
                    size="mini"
                    @click="handlePay(row)"
                    >支付</el-button
                  >
                  <el-button
                    v-if="activeStatus === '待支付'"
                    type="warning"
                    size="mini"
                    @click="handleCancel(row)"
                    >撤销</el-button
                  >
                  <el-button
                    v-if="activeStatus === '待收货'"
                    type="success"
                    size="mini"
                    @click="handleConfirm(row)"
                    >确认收货</el-button
                  >
                  <el-button
                    v-if="activeStatus === '待发货' || activeStatus === '待收货'"
                    type="warning"
                    size="mini"
                    @click="handleRefund(row)"
                    >申请退款</el-button
                  >
                  <el-button
                    v-if="
                      activeStatus === '已完成' ||
                      activeStatus === '已撤销' ||
                      activeStatus === '已退款'
                    "
                    type="danger"
                    size="mini"
                    @click="handleRemove(row)"
                    >删除记录</el-button
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
  </div>
</template>

<script>
import axios from 'axios'
// import { toRaw } from 'vue'
export default {
  name: 'OrderList',
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      orderData: [],
      allOrders: [], // 新增属性
      activeStatus: '所有订单' // 代表当前页面是筛选哪个状态的订单
    }
  },
  created() {
    localStorage.setItem('orderPrice', 0) // 初始化订单价格
    localStorage.setItem('orderId', 0) // 初始化订单ID
    this.getAllOrders() // 新增方法
    // this.getOrderData() 放到了getAllOrders里面
  },
  methods: {
    async getAllOrders() {
      const url = '/api/order/' + this.statusSelect(this.activeStatus)
      await axios
        .get(url, {
          params: { userId: localStorage.getItem('userId') }
        })
        .then((response) => {
          console.log(response)
          if (response.data.code == 200) {
            console.log('成功获取所有订单')
            this.allOrders = response.data.data
            // 在这里进行过滤
            this.allOrders = this.allOrders.filter((order) => order.removeStatus !== '已删除')
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
    async getOrderData() {
      // 计算当前页的起始和结束下标
      const startIndex = (this.currentPage - 1) * this.pageSize
      const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
      // 获取当前页的订单数据
      const orders = this.allOrders.slice(startIndex, endIndex)
      // 更新总订单数
      this.totalOrders = this.allOrders.length
      // 更新当前页的订单数据
      this.orderData = orders
      // console.log(toRaw(this.orderData))
      await this.changeInfoById() // 新增调用changeInfoById函数
    }, // getOrderData方法结束

    // NOTE: 通过id查询order的具体各个属性
    async changeInfoById() {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      for (let i = 0; i < this.orderData.length; i++) {
        const order = this.orderData[i]
        const commodityInfo = await this.getCommodityInfo(order.commodityId)
        const shopInfo = await this.getShopInfo(order.shopId)
        order.commodityName = commodityInfo.commodityName
        order.category = commodityInfo.category
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
    // NOTE: 和API有关的方法
    handlePay(row) {
      // this.$confirm('确定要支付吗？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // })
      //   .then(() => {
      localStorage.setItem('category', row.category)
      localStorage.setItem('orderPrice', row.paidAmount) // 将订单价格存入localStorage
      // localStorage.setItem('orderId', row.id) // 将订单id存入localStorage
      let orderIdArray = []
      orderIdArray.push(row.id)
      localStorage.setItem('orderIdArray', JSON.stringify(orderIdArray)) // 将订单id存入localStorage
      this.$router.push('/home/orduser/order/pay') // 跳转到支付页面
      // })
      // .catch(() => {
      //   // 用户点击了取消按钮
      // })
    },
    handleCancel(row) {
      this.$confirm('确定要撤销订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .put('/api/order/revoke', null, {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              console.log(response)
              if (response.data.code == 200) {
                console.log('成功撤销订单')
                this.$message({
                  type: 'success',
                  message: '撤销订单成功'
                })
                this.getAllOrders() //* 重新获取所有订单
              } else {
                console.log('撤销订单失败')
                this.$message({
                  type: 'error',
                  message: '撤销订单失败: ' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          // 用户点击了取消按钮
        })
    },
    handleConfirm(row) {
      this.$confirm('确认已收到货', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .put('/api/order/confirmReceipt', null, {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              console.log(response)
              if (response.data.code == 200) {
                console.log('成功确认收货')
                this.$message({
                  type: 'success',
                  message: '确认收货成功'
                })
                this.getAllOrders() //* 重新获取所有订单
              } else {
                console.log('确认收货失败')
                this.$message({
                  type: 'error',
                  message: '确认收货失败: ' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          // 用户点击了取消按钮
        })
    },
    handleRefund(row) {
      this.$confirm('确定要申请退款吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .put('/api/order/refund', null, {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              console.log(response)
              if (response.data.code == 200) {
                console.log('成功申请退款')
                this.$message({
                  type: 'success',
                  message: '已提交退款申请'
                })
                this.getAllOrders() //* 重新获取所有订单
              } else {
                console.log('提交申请退款失败')
                this.$message({
                  type: 'error',
                  message: '提交申请退款失败: ' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          // 用户点击了取消按钮
        })
    },
    handleRemove(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .delete('/api/order/remove', {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              console.log(response)
              if (response.data.code == 200) {
                console.log('成功删除订单')
                this.$message({
                  type: 'success',
                  message: '删除订单成功'
                })
                this.getAllOrders() //* 重新获取所有订单
              } else {
                console.log('删除订单失败')
                this.$message({
                  type: 'error',
                  message: '删除订单失败: ' + response.data.msg
                })
              }
            })
        })
        .catch(() => {
          // 用户点击了取消按钮
        })
    },
    // NOTE: 和分页有关的方法
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
        case '所有订单':
          return 'displayAllForUser'
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
          console.log('status出错了!!')
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
    },
    navigateToOrderDetail(row) {
      localStorage.setItem('orderId', row.id)
      this.$router.push('/home/orduser/order/detail')
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900');

.container {
  position: relative;
  top: 35px;
}
img {
  width: 50px;
  height: 50px;
}
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
