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
        <el-table :data="orderData" style="width: 100%">
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
        <el-table :data="orderData" style="width: 100%">
          <el-table-column prop="id" label="订单号" width="80px"> </el-table-column>
          <!-- <el-table-column prop="shopName" label="店铺"> </el-table-column> -->
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
              <el-button @click="handleRefund(row)">同意退款</el-button>
              <el-button @click="handleRefund(row)" disabled>拒绝</el-button>
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
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      currentView: '1',
      orderData: [],
      allOrders: []
      // refundData: []
    }
  },
  created() {
    if (this.currentView == 1) {
      this.getOrderInfo()
    } else if (this.currentView == 2) {
      this.getRefundInfo()
    }
  },
  methods: {
    getOrderInfo() {
      // 发送请求获取订单信息
    },
    async getRefundInfo() {
      // 发送请求获取退款信息
      await axios
        .get('/api/order/displayToBeRefunded', {
          params: { shopId: localStorage.getItem('shopId') }
        })
        .then((res) => {
          if (res.data.code == 200) {
            console.log('拿取信息成功')
            this.allOrders = response.data.data
            // 在这里进行过滤
            this.allOrders = this.allOrders.filter((order) => order.removeStatus !== '已删除')
            // 分页设置，具体的注释看OrderDisplayView
            const startIndex = (this.currentPage - 1) * this.pageSize
            const endIndex = Math.min(startIndex + this.pageSize, this.allOrders.length)
            const orders = this.allOrders.slice(startIndex, endIndex)
            this.totalOrders = this.allOrders.length
            this.orderData = orders
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
    handleSelect(index) {
      this.currentView = index
    },
    handleDelivery(row) {
      // 发送请求，将订单状态改为已发货
      axios
        .post('/api/shop/deliverCommodity', {
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
            this.getOrderInfo()
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
    },
    handleRefund(row) {
      this.$confirm('确认同意退款', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          axios
            .post('/api/shop/handleOrderRefund', {
              params: {
                orderId: row.id
              }
            })
            .then((response) => {
              if (response.data.code == 200) {
                console.log('退款成功')
                this.$message({
                  type: 'success',
                  message: '退款成功'
                })
                this.getRefundInfo()
              } else {
                console.log('退款失败')
                this.$message({
                  type: 'error',
                  message: '退款失败:' + response.data.msg
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
    }
  }
}
</script>

<style scoped>
.el-menu-vertical-demo {
  border-right: 1px solid #eee;
}
</style>
