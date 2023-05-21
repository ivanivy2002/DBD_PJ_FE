<template>
  <div class="commodity-detail">
    <div class="commodity-info">
      <div class="commodity-image">
        <!-- <img
          v-for="imageUrl in getImageUrls(commodityAllInfo.imagePath)"
          :key="imageUrl"
          :src="imageUrl"
        /> -->
        <img :src="getImageUrls(commodityAllInfo.imagePath)[0]" />
      </div>
      <div class="commodity-details">
        <h1 class="commodity-name">{{ commodityAllInfo.commodityName }}</h1>
        <div class="commodity-meta">
          <span class="shop-name">商店：{{ commodityAllInfo.shopName }}</span>
          <span class="activity-name">活动：{{ commodityAllInfo.activityName }}</span>
        </div>
        <div class="commodity-intro">商品简介：{{ commodityAllInfo.intro }}</div>
        <div class="commodity-price">
          <span class="price-label">价格：</span>
          <span class="price-value">{{ commodityAllInfo.price }}</span>
        </div>
        <div class="commodity-sales">
          <span class="sales-label">销量：</span>
          <span class="sales-value">{{ commodityAllInfo.salesNum }}</span>
        </div>
        <div class="commodity-action">
          <el-input-number
            v-model="commodityNum"
            :min="1"
            :max="10000"
            label="数量"
            controls-position="right"
            style="width: 120px"
          ></el-input-number>
          <el-button
            color="#626aef"
            @click="PunchaseDirect(commodityAllInfo.commodityId, commodityNum)"
          >
            直接购买
          </el-button>
          <el-button type="primary" @click="addToCart(commodityAllInfo.commodityId, commodityNum)"
            ><el-icon><ShoppingCart /></el-icon>添加到购物车</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { ElMessage } from 'element-plus'
export default {
  name: 'CommodityDetailView',
  data() {
    return {
      commodityNum: 1,
      showCommodityId: 0,
      showShopId: 0,
      commodityAllInfo: {}
    }
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.showCommodityId = localStorage.getItem('showCommodityId')
    this.showShopId = localStorage.getItem('showShopId')
    this.commodityAllInfo.commodityId = this.showCommodityId
    this.commodityAllInfo.shopId = this.showShopId
    this.commodityAllInfo.userId = localStorage.getItem('userId')

    this.changeInfoById(this.showCommodityId, this.showShopId)
  },
  methods: {
    // NOTE: 通过id查询order的具体各个属性
    async changeInfoById(commodityId, shopId) {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      const commodity = this.commodityAllInfo
      const commodityInfo = await this.getCommodityInfo(commodityId)
      const shopInfo = await this.getShopInfo(shopId)
      commodity.commodityName = commodityInfo.commodityName
      commodity.price = commodityInfo.price
      commodity.salesNum = commodityInfo.salesNum
      commodity.intro = commodityInfo.intro
      commodity.activityId = commodityInfo.activityId
      const activityInfo = await this.getActivityInfo(commodity.activityId) // 拿取活动信息
      commodity.activityName = activityInfo.activityName //  这里的activityName是从activityInfo中获取的
      commodity.imagePath = commodityInfo.imagePath
      commodity.shopName = shopInfo.shopName
      console.log(111)
      console.log(commodity)
      // this.$set(this.orderData, i, order)
      this.commodityAllInfo = commodity // 将order对象复制到orderData数组的第i个位置
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
    async getActivityInfo(activityId) {
      console.log('activityId', activityId)
      let activityInfo = {}
      if (activityId == -1) {
        activityInfo = {
          activityName: '暂无'
        }
        return activityInfo
      }
      await axios
        .get('/api/activity/display', {
          params: {
            activityId: activityId
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('成功获取活动信息')
            console.log(response.data.data)
            activityInfo = response.data.data
          } else {
            console.log('获取活动信息失败')
            activityInfo = {} // 返回一个空对象
          }
        })
        .catch((error) => {
          console.log(error)
          activityInfo = {} // 返回一个空对象
        })
      return activityInfo
    },
    // // NOTE: 通过commodityId查询commodity的各个属性
    // async getCommodityInfo(commodityId) {
    //   // let commodityInfo = {}
    //   await axios
    //     .get('/api/commodity/displayInfo', {
    //       params: { commodityId: commodityId }
    //     })
    //     .then((response) => {
    //       console.log(response)
    //       if (response.data.code == 200) {
    //         console.log('成功获取商品信息')
    //         console.log(response.data.data)
    //         this.commodityInfo = response.data.data
    //       } else {
    //         console.log('获取商品信息失败')
    //         this.commodityInfo = {} // 返回一个空对象
    //       }
    //     })
    //     .catch((error) => {
    //       console.log(error)
    //       this.commodityInfo = {} // 返回一个空对象
    //     })
    //   return commodityInfo
    // },
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
    // NOTE: 直接购买商品
    PunchaseDirect(commodityId, Num) {
      this.$confirm('确定要直接购买吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.commodityAllInfo.commodityNum = Num
        let commodityInfoArray = []
        commodityInfoArray.push(this.commodityAllInfo)
        localStorage.setItem('commodityArray', JSON.stringify(commodityInfoArray))
        this.$router.push('/home/orduser/order/create')
      })
      // .catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消购买'
      //   })
      // })
    },
    // NOTE: 添加商品到购物车
    addToCart(commodityId, quantity) {
      try {
        const response = axios
          .post('/api/shoppingCart/addCommodity/', {
            // NOTE: 传一个body
            id: null,
            userId: localStorage.getItem('userId'),
            shopId: localStorage.getItem('showShopId'),
            commodityId: commodityId,
            commodityNum: quantity,
            status: '有效'
          })
          .then((response) => {
            console.log(response)
            console.log(`Adding commodity with ID ${commodityId} to cart`)
            if (response.data.code === 200) {
              // this.commodityNum += quantity // 将添加的商品数量加入购物车数量
              ElMessage({
                //用于弹出消息提示
                showClose: true,
                type: 'success', //如果成功
                message: '添加成功'
              })
              axios
                .put('/api/recommend/userOperationRecord', {
                  // 用户点击记录
                  userId: localStorage.getItem('userId'),
                  commodityId: commodityId,
                  // shopId: shopId,
                  operationType: 1
                })
                .then((response) => {
                  console.log(response.data)
                  if (response.data.code == 200) {
                    console.log('用户点击记录成功')
                    // this.$router.push('/home/orduser/commodity/detail')
                  }
                })
            } else {
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '操作失败:' + response.data.msg
              })
            }
          })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style scoped>
.commodity-detail {
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.commodity-info {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.commodity-image {
  flex: 1;
  margin-right: 20px;
}

.commodity-image img {
  width: 100%;
  height: auto;
}

.commodity-details {
  flex: 2;
}

.commodity-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.commodity-meta {
  margin-bottom: 10px;
}

.shop-name {
  font-size: 16px;
  color: #999;
  margin-right: 10px;
}
.activity-name {
  font-size: 20px;
  color: #cc2d2d;
  margin-right: 10px;
}

.commodity-intro {
  font-size: 16px;
  margin-bottom: 20px;
}

.commodity-price,
.commodity-sales {
  font-size: 18px;
  margin-bottom: 10px;
}

.price-label,
.sales-label {
  font-weight: bold;
  margin-right: 10px;
}

.commodity-actions {
  margin-top: 20px;
}
</style>
