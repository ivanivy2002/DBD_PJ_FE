<template>
  <div class="shopping-cart">
    <el-card class="cart-card">
      <div class="card-header">
        <h2 class="card-title">我的购物车</h2>
      </div>
      <!-- NOTE: 下面有一个多选框的监听 -->
      <el-table
        :data="cartItems"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="commodityName" label="商品名称" width="120" />
        <el-table-column prop="intro" label="介绍" width="80" />
        <el-table-column prop="price" label="价格" width="70" />
        <el-table-column label="数量" width="170">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                type="primary"
                icon="Minus"
                size="small"
                plain
                @click="updateNum(row.id, row.commodityNum - 1)"
              ></el-button>
              <el-button size="small">{{ row.commodityNum }}</el-button>
              <el-button
                type="primary"
                icon="Plus"
                size="small"
                plain
                @click="updateNum(row.id, row.commodityNum + 1)"
              ></el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column prop="activityId" label="活动" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === '有效' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column type="selection" width="55" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="danger" @click="removeCommodity(row.commodityId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="default" @click="submitOrder" :disabled="selectedItems.length === 0"
          >提交订单</el-button
        >
        <el-button type="danger" @click="removeSelected" :disabled="selectedItems.length === 0"
          >批量删除</el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import { ElTable, ElTableColumn, ElTag, ElButton, ElCard, ElMessage } from 'element-plus'
import axios from 'axios'
import { Minus, Plus } from '@element-plus/icons-vue'

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElTag,
    ElButton,
    ElCard
  },
  data() {
    return {
      userId: 0,
      cartItems: [],
      selectedItems: []
    }
  },
  filters: {
    currency(value) {
      return '¥' + parseFloat(value).toFixed(2)
    }
  },
  mounted() {
    this.userId = localStorage.getItem('userId')
    this.fetchData()
  },
  methods: {
    fetchData() {
      axios
        .get('/api/shoppingCart/displayInfo', {
          params: { userId: this.userId }
        })
        .then((response) => {
          this.cartItems = response.data.data
          console.log(response.data.data)
          this.changeInfoById()
        })
    },
    removeCommodity(commodityId) {
      axios
        .delete('/api/shoppingCart/removeCommodity/', {
          params: {
            userId: this.userId,
            commodityIdArray: commodityId.toString()
          }
        })
        .then(() => {
          this.fetchData()
        })
    },
    async removeSelected() {
      if (this.selectedItems.length === 0) {
        ElMessage({
          showClose: true,
          type: 'error',
          message: '请选择至少一个商品后删除'
        })
        return
      }
      const commodityIdArray = this.selectedItems.map((item) => item.commodityId) //* 这里将多选框的选中的商品的commodityId提取出来，拼成一个数组
      axios
        .delete('/api/shoppingCart/removeCommodity/', {
          params: {
            userId: this.userId,
            commodityIdArray: this.joinWithComma(commodityIdArray)
          }
        })
        .then(() => {
          this.fetchData()
          this.selectedItems = []
        })
    },
    handleSelectionChange(selection) {
      this.selectedItems = selection
    },
    updateNum(shoppingCartId, num) {
      axios
        .put('/api/shoppingCart/update', null, {
          params: {
            commodityNum: num,
            shoppingCartId: shoppingCartId
          }
        })
        .then((response) => {
          if (response.data.code == 200) {
            console.log('修改成功')
            this.fetchData()
          }
        })
    },
    joinWithComma(categories) {
      if (!Array.isArray(categories)) {
        throw new Error('Argument must be an array')
      }
      return categories.join(',')
    },
    // NOTE: 通过id查询cartItem的具体各个属性
    async changeInfoById() {
      // NOTE: 下面的这个想法很好，在别的地方应该可以复用
      for (let i = 0; i < this.cartItems.length; i++) {
        const cartItem = this.cartItems[i]
        const commodityInfo = await this.getCommodityInfo(cartItem.commodityId)
        const shopInfo = await this.getShopInfo(cartItem.shopId)
        cartItem.commodityName = commodityInfo.commodityName
        cartItem.price = commodityInfo.price
        cartItem.intro = commodityInfo.intro
        cartItem.activityId = commodityInfo.activityId //!
        cartItem.imagePath = commodityInfo.imagePath
        cartItem.shopName = shopInfo.shopName
        // this.$set(this.cartItems, i, cartItem)
        this.cartItems[i] = { ...cartItem } // 将cartItem对象复制到cartItems数组的第i个位置
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
    async getActivityInfo() {},
    // TODO: 参数还没写完
    submitOrder() {
      const commodityArray = this.selectedItems.map((item) => item) //* 这里将多选框选中的商品的commodityId提取出来，拼成一个数组
      console.log(commodityArray) // 这里应该是一个object数组
      localStorage.setItem('commodityArray', JSON.stringify(commodityArray))
      console.log(localStorage.getItem('commodityArray'))
      this.removeSelected() //! 删除购物车中已提交的商品
      this.fetchData()
      // for (commodity of commodityArray) {
      //   axios
      //     .post('/api/shoppingCart/removeCommodity/', commodity)
      //     .then((response) => {
      //       if(response.data.code == 200){
      //         console.log('成功提交订单')
      //         ElMessage({
      //         showClose: true,
      //         type: 'success',
      //         message: '订单提交成功'
      //       })
      //       this.removeSelected() //! 删除购物车中已提交的商品
      //       this.fetchData()
      //       } else {
      //         console.log('提交订单失败')
      //         ElMessage({
      //         showClose: true,
      //         type: 'error',
      //         message: '订单提交失败'
      //       })
      //       }
      //     })
      // }
      this.$router.push('/home/orduser/order/create')
      // TODO: 下面这种传参的方式可参考
      // this.$router.push({
      //   path: '/home/orduser/order/create',
      //   query: {
      //     userId: this.userId,
      //     commodityIdArray: this.joinWithComma(this.selectedItems.map((item) => item.commodityId))
      //   }
      // })
    }
  }
}
</script>

<style scoped>
.shopping-cart {
  padding: 24px;
  background-color: #ffffff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #ebeef5;
  background-color: #24b8c6;
  color: #fff;
}

.card-title {
  margin: 0;
  font-size: 24px;
}

.cart-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #fff;
}

.el-table__row {
  background-color: #f5f5f5;
}

.el-table__header {
  background-color: #24b8c6;
  color: #fff;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

@font-face {
  font-family: 'element-icons';
  src: url('path/to/element-icons.woff') format('woff'),
    url('path/to/element-icons.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}
</style>
