<template>
  <div class="order-create-container">
    <strong>填写并核对订单信息~</strong>
    <br />
    <br />
    <div class="order-create">
      <div class="address">
        <h3>收货地址</h3>
        <el-button v-if="selectAddress == false" @click="turnOnAddress">选择收货地址</el-button>
        <div v-if="selectAddress == true">
          <address-manage @select-address="handleSelectAddress"></address-manage>
        </div>
        <div v-if="ifselectedAddress == true">
          <el-card>
            <div slot="header">
              <strong>姓名： </strong>
              {{ selectAddressInfo.name }}
            </div>
            <br/>
            <div><strong>手机号： </strong>{{ selectAddressInfo.phoneNumber }}</div>
            <br/>
            <div><strong>地址： </strong>{{ selectAddressInfo.address }}</div>
          </el-card>
        </div>
      </div>
      <div class="order-detail">
        <h3>订单详情</h3>
        <el-divider></el-divider>
        <div>
          <el-card v-for="(commodity, index) in commodityArray" :key="index">
            <div slot="header"><div class="commodity-name">{{ commodity.commodityName }}</div></div>
            <div class="commodity-info">
              <p class="commodity-num">商品数量：{{ commodity.commodityNum }}</p>
              <p class="paid-amount">实付金额：{{ commodity.paidAmount }}</p>
              <p class="reduction" v-if="commodity.reductionAmount != 0">优惠金额：{{ commodity.reductionAmount }}</p>
              <p class="shop-name">店铺名称：{{ commodity.shopName }}</p>
              <p class="activity-name" v-if="commodity.activityName != null">活动：{{ commodity.activityName }}</p>
              <p class="photo">
                <div class="commodity-image">
                  <img
                    v-for="imageUrl in getImageUrls(commodity.imagePath)"
                    :key="imageUrl"
                    :src="imageUrl"
                  />
                </div>
              </p>
            </div>
          </el-card>
        </div>
      </div>
      <div class="settlement">
        <h3>结算金额</h3>
        <el-divider></el-divider>
        <div class="total-price">
          <span>总价：</span>
          <span>{{ totalPrice }}</span>
        </div>
        <div class="submit-btn">
          <el-button type="primary" @click="submitOrder">提交订单</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import AddressManage from '../../../components/OrdUserComponents/AddressManage.vue'
import { ElMessage } from 'element-plus'
export default {
  name: 'OrderCreateView',
  components: { AddressManage },
  data() {
    return {
      selectAddress: false, // 还没开始选择的时候会设置成false
      ifselectedAddress: false, // 如果选好了，会设置成true
      selectAddressId: '',
      selectAddressInfo: {},
      commodityArray: [],
      activityArray: [],
      tableData: [],
      orderIdArray: [],
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.commodityArray.forEach((item) => {
        total += item.paidAmount
      })
      return total.toFixed(2)
    }
  },
  filters: {
    formatPrice(price) {
      return price.toFixed(2)
    }
  },
  mounted() {
    this.commodityArray = JSON.parse(localStorage.getItem('commodityArray')) // 从localStorage里面取出商品信息
    this.displayCommodityInfo()
  },
  methods: {
    turnOnAddress() {
      this.selectAddress = true
    },
    handleSelectAddress(addressId) {
      // 接受子组件传来的地址ID
      console.log('Selected address ID:', addressId)
      this.selectAddress = false
      this.selectAddressId = addressId
      this.ifselectedAddress = true
      console.log('11111')
      this.getSelectAddressInfo() //​根据选择的地址ID获取地址信息
    },
    async getSelectAddressInfo() {
      // 根据选择的地址ID获取地址信息
      console.log('22222')
      await axios
        .get('/api/address/displayAddressInfo', {
          params: {
            addressId: this.selectAddressId
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('获取信息成功')
            this.selectAddressInfo = response.data.data
          } else {
            ElMessage({
              showClose: true,
              type: 'error', //如果失败输出状态码
              message: '获取信息失败:' + response.data.msg
            })
          }
        })
    },
    async displayCommodityInfo() {
      console.log(this.commodityArray)
      this.getActivityInfo() // 获取活动信息
      // this.calculateReduction() // 获取商品信息
      this.changeInfoById()
    },
    getActivityInfo() {
      // 获取活动信息
      this.activityArray = [] // 先清空数组
      const promises = [] // 用于存储所有的Promise对象
      this.commodityArray.forEach((commodity) => {
        if (commodity.activityId == -1) {
          console.log('该商品没有活动')
        } else {
          console.log(`商品${commodity.commodityName}的活动ID为${commodity.activityId}`)
          const promise = axios.get('/api/activity/display', {
            params: {
              activityId: commodity.activityId
            }
          }).then((response) => {
            if (response.data.code == 200) {
              console.log(`获取活动信息${response.data.data.activityName}成功`)
              commodity.activityName = response.data.data.activityName
              this.activityArray.push(response.data.data) // 将返回的数据存储到数组中 用push
            } else {
              ElMessage({
                showClose: true,
                type: 'error', //如果失败输出状态码
                message: '获取信息失败:' + response.data.msg
              })
            }
          })
          promises.push(promise) // 将Promise对象存储到数组中
        }
      })
      //NOTE： 该Promise对象在所有的Promise对象都成功完成后才会被解析
      Promise.all(promises).then(() => {  
        console.log('所有活动信息获取完毕')
        console.log(this.activityArray)
        this.calculateReduction() // 在这里调用是为了保证顺序执行
      })
    },
    calculateReduction() {
      // 计算优惠
      // 商品列表，包括商品的活动ID、价格和数量
      // let commodities = [
      //   { activityId: 1, price: 45, commodityNum: 2 },
      //   { activityId: -1, price: 55, commodityNum: 1 },
      //   { activityId: 2, price: 70, commodityNum: 3 },
      //   { activityId: 1, price: 80, commodityNum: 1 },
      //   { activityId: 1, price: 200, commodityNum: 1 }
      //   // ...
      // ]
      let commodities = this.commodityArray
      console.log(commodities)

      // 活动满减策略，键为活动ID，值为满减金额和满足条件的价格
      // let activityDiscounts = {
      //   1: { threshold: 100, discount: 50 },
      //   2: { threshold: 200, discount: 100 }
      //   // ...
      // }
      let activityDiscounts = this.activityArray
      console.log(activityDiscounts)
      // 按照活动ID对商品进行分组
      // 按照活动ID对商品进行分组
      let activities = {};
      commodities.forEach(commodity => {
        let { activityId } = commodity;
        if (!activities[activityId]) {
          activities[activityId] = [];
        }
        activities[activityId].push(commodity);
      });

      // 对每个活动内的商品进行满减计算
      for (let activityId in activities) {
        let commodities = activities[activityId];
        let total = commodities.reduce((sum, commodity) => sum + commodity.price * commodity.commodityNum, 0);
        let activityDiscount = activityDiscounts.find(discount => discount.id == activityId);
        if (activityDiscount) {
          // 只有在存在满减策略时才进行满减计算
          let { x, y } = activityDiscount;
          if (total >= x) {
            // 满足满减门槛条件才进行满减
            let discountSum = Math.floor(total / x) * y; // 总的满减金额

            commodities.forEach(commodity => {
              let ratio = (commodity.price * commodity.commodityNum) / total;
              let reductionAmount = discountSum * ratio;
              reductionAmount = Math.round(reductionAmount * 100) / 100; // 保留两位小数
              let paidAmount = commodity.price * commodity.commodityNum - reductionAmount;
              paidAmount = Math.round(paidAmount * 100) / 100; // 保留两位小数
              commodity.paidAmount = paidAmount;
              commodity.reductionAmount = reductionAmount;
            });
          } else {
            // 不满足满减门槛，商品原价付款，无满减金额
            commodities.forEach(commodity => {
              commodity.paidAmount = commodity.price * commodity.commodityNum;
              commodity.reductionAmount = 0;
            });
          }
        } else {
          // 不存在满减策略，商品原价付款，无满减金额
          commodities.forEach(commodity => {
            commodity.paidAmount = commodity.price * commodity.commodityNum;
            commodity.reductionAmount = 0;
          });
        }
      }

      // 输出每个商品的预估到手价和满减金额
      commodities.forEach((commodity, i) => {
        console.log(`商品${i + 1}的预估到手价为：${commodity.paidAmount}，满减金额为：${commodity.reductionAmount}`);
      });

      this.commodityArray = commodities
      console.log(this.commodityArray)
    },
    // NOTE: 通过id查询commodityArray的具体各个属性
    async changeInfoById() {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      for (let i = 0; i < this.commodityArray.length; i++) {
        const commodity = this.commodityArray[i]
        const commodityInfo = await this.getCommodityInfo(commodity.commodityId)
        const shopInfo = await this.getShopInfo(commodity.shopId)
        commodity.commodityName = commodityInfo.commodityName
        commodity.price = commodityInfo.price
        commodity.intro = commodityInfo.intro
        // commodity.activityId = commodityInfo.activityId //!
        commodity.imagePath = commodityInfo.imagePath
        commodity.shopName = shopInfo.shopName
        // this.$set(this.commodityArray, i, commodity)
        this.commodityArray[i] = { ...commodity } // 将commodityArray对象复制到commodityArray数组的第i个位置
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
    submitOrder() { // 提交订单
      if(this.ifselectedAddress == false) {
        this.$message({
          type: 'warning',
          message: '请选择收货地址'
        })
        return
      }
      this.commodityArray.forEach((commodity) => {
        commodity.addressId = this.selectAddressId
      })
      this.$confirm('确定要提交吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const promises = [] // 用于存储所有的Promise对象
        this.$message({
          type: 'success',
          message: '提交成功'
        })    
        this.commodityArray.forEach((commodity) => {
          const promise = axios.post('/api/order/create', commodity).then((response) => {
            if(response.data.code == 200) {
              console.log('成功创建订单')
              console.log(response.data)
              this.orderIdArray.push(response.data.data);
              console.log(this.orderIdArray)
            }
            else {
              this.$message({
                type: 'error',
                message: '提交失败: ' + response.data.message
              })
            }
          })
          promises.push(promise) // 将Promise对象存储到数组中
        })
        // NOTE: 控制执行逻辑
        Promise.all(promises).then(() => {
          console.log('所有订单创建成功')
          console.log(this.orderIdArray)
          localStorage.setItem('orderPrice', this.totalPrice) // 将订单价格存入localStorage
          localStorage.setItem('orderIdArray', JSON.stringify(this.orderIdArray)) // 将订单id存入localStorage
          // localStorage.setItem('orderId', row.id) // 将订单id存入localStorage
          this.$router.push('/home/orduser/order/pay') // 跳转到支付页面
        })
        // localStorage.setItem('orderPrice', this.totalPrice) // 将订单价格存入localStorage
        // localStorage.setItem('orderIdArray', JSON.stringify(this.orderIdArray)) // 将订单id存入localStorage
        // // localStorage.setItem('orderId', row.id) // 将订单id存入localStorage
        // this.$router.push('/home/orduser/order/pay') // 跳转到支付页面
      }).catch(() => {
        // 点击取消按钮
        this.$message({
          type: 'info',
          message: '已取消提交'
        })
      })
    }
  }
}
</script>

<style scoped>
.order-create-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.address {
  width: 80%;
}
.order-detail {
  width: 80%;
}
.order-summary {
  width: 80%;
}
.settlement {
  width: 80%;
}
.total-price {
  margin-top: 20px;
  font-size: 18px;
  font-weight: bold;
}
.submit-btn {
  margin-top: 20px;
  text-align: center;
}
.order-create {
  /* background-image: linear-gradient(-45deg, #24b8c6, #26d6cd); */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  padding: 30px;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
  margin-top: 20px;
  margin-bottom: 20px;
  width: 600px;
  max-width: 600px;
}
/* 这里是你的Vue.js组件的样式 */
.el-card {
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.el-card__header {
  font-size: 16px;
  font-weight: bold;
  padding: 16px;
  background-color: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.el-card__body {
  padding: 16px;
}

.el-card__footer {
  padding: 16px;
  background-color: #f5f7fa;
  border-top: 1px solid #ebeef5;
}
.commodity-name {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
}
.commodity-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 20px;
}

.commodity-info p {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.commodity-info .commodity-num {
  color: #333;
  font-weight: bold;
}

.commodity-info .paid-amount {
  color: #f60;
  font-weight: bold;
}

.commodity-info .reduction {
  color: #f00;
  font-weight: bold;
}

.commodity-info .shop-name {
  color: #666;
}

.commodity-info .activity-name {
  color: #999;
}

.total-price {
  font-size: 40px;
  font-weight: bold;
}
.photo {
  display: flex;
  justify-content: flex-end;
}

.commodity-image {
  order: 1;
}
img {
  /* float: right; */
  width: 80px;
  height: 80px;
  margin-right: 20px;
}
</style>
