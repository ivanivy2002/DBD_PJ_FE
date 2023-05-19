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
          {{ order.shopName }}
        </div>
        <div class="detail-item">
          <strong>商品名：</strong>
          {{ order.commodityName }}
        </div>
        <div class="detail-item">
          <strong>实付价格：</strong>
          {{ order.paidAmount }}
        </div>
        <div>
          <strong>商品图片：</strong>
          <img v-for="imageUrl in getImageUrls(order.imagePath)" :key="imageUrl" :src="imageUrl" />
        </div>
      </el-col>
      <el-col
        :span="12"
        v-if="order.status === 1 || order.status === 2 || order.status === 3 || order.status === 4"
      >
        <strong>订单状态：</strong>
        <el-steps :active="order.status" align-center>
          <el-step title="待支付"></el-step>
          <el-step title="待发货"></el-step>
          <el-step title="待收货"></el-step>
          <el-step title="已完成"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="12" v-if="order.status === 5 || order.status === 6">
        <strong>订单状态：</strong>
        <el-steps :active="order.status - 4" align-center>
          <el-step title="待商户退款"></el-step>
          <el-step title="退款成功"></el-step>
        </el-steps>
      </el-col>
      <el-col :span="12" v-if="order.status === 7">
        <strong>订单状态：</strong>
        <el-steps :active="1" :space="200" simple>
          <el-step title="已撤销" :icon="Delete"></el-step>
        </el-steps>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import { Delete } from '@element-plus/icons-vue'
export default {
  data() {
    return {
      orderId: '',
      order: {
        // id: '',
        // userId: '',
        // shopId: '',
        // commodityId: '',
        // commodityNum: '',
        // status: '',
        // paidAmount: '',
        // reductionAmount: '',
        // removeStatus: '',
        // createTime: ''
      }
    }
  },
  mounted() {
    this.orderId = localStorage.getItem('orderId') // 获取传过来的ID
    this.fetchOrderData()
  },
  methods: {
    async fetchOrderData() {
      await axios
        .get('/api/order/displayOne', {
          params: {
            orderId: this.orderId
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('获取order信息成功')
            this.order = response.data.data
            this.changeInfoById()
            this.order.status = this.setStatusNum(this.order.status) //转化成数字
          } else {
            console.log('获取订单信息失败')
          }
        })
    },
    // NOTE: 通过id查询order的具体各个属性
    async changeInfoById() {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      const order = this.order
      const commodityInfo = await this.getCommodityInfo(order.commodityId)
      const shopInfo = await this.getShopInfo(order.shopId)
      order.commodityName = commodityInfo.commodityName
      order.imagePath = commodityInfo.imagePath
      order.shopName = shopInfo.shopName
      // this.$set(this.orderData, i, order)
      this.order = { ...order } // 将order对象复制到orderData数组的第i个位置
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
    setStatusNum(status) {
      switch (status) {
        case '待支付':
          return 1
        case '待发货':
          return 2
        case '待收货':
          return 3
        case '已完成':
          return 4
        case '待退款':
          return 5
        case '已退款':
          return 6
        case '已撤销':
          return 7
        default:
          break
      }
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
    }
  }
}
</script>

<style scoped>
img {
  width: 100px;
  height: 100px;
}
.order-detail {
  max-width: 800px;
  margin: 50px auto 0;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #aedcf0;
  animation: pulse 2s infinite;
}

.detail-item {
  margin-bottom: 10px;
}

.detail-item strong {
  display: inline-block;
  width: 100px;
  font-weight: bold;
}

.el-steps {
  margin-top: 20px;
}

/* @keyframes pulse {
  0% {
    background-color: #00ff7f;
  }
  50% {
    background-color: #00bfff;
  }
  100% {
    background-color: #00ff7f;
  }
} */
</style>
