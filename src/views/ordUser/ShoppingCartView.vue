<template>
  <div class="shopping-cart dark-bg">
    <el-card class="cart-card">
      <div slot="header" class="card-header">
        <h2 class="card-title" style="width: 20%">我的购物车</h2>
      </div>
      <!-- NOTE: 下面有一个多选框的监听 -->
      <el-table
        :data="cartItems"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column prop="commodityName" label="商品名称" width="180" />
        <!-- <el-table-column prop="intro" label="介绍" /> -->
        <el-table-column prop="commodityPrice" label="价格" width="120">
          <template #default="{ row }">
            <span>{{ row.commodityPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNum" label="数量" width="120" />
        <el-table-column label="状态" width="120">
          <template #default="{ row }">
            <!-- <el-tag v-if="row.regStatus == '有效'" type="success">正常</el-tag>
            <el-tag v-else type="danger">已失效</el-tag> -->
            <el-tag :type="row.status === '有效' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <!-- NOTE: 多选框 -->
        <el-table-column type="selection" width="55" />
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button type="danger" @click="removeCommodity(row.commodityId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <el-button type="danger" @click="removeSelected">批量删除</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { ElTable, ElTableColumn, ElTag, ElButton, ElCard } from 'element-plus'
// ElMessage
import axios from 'axios'

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
      const response = axios
        .get('http://localhost:9000/shoppingCart/displayInfo', {
          // TODO: 注意测试完之后改成this.id
          // params: { userId: 21 }
          params: { userId: localStorage.getItem('userId') }
        })
        .then((response) => {
          console.log(response.data.data)
          // console.log(Object.values(response.data.data))
          // const cartObjects = Object.fromEntries(Object.values(response.data.data))
          // console.log(cartObjects)
          // const shoppingCarts = Object.keys(response.data.data)[0]
          // console.log(shoppingCarts)
          // const cartItems = Object.values(shoppingCarts).flat().map(item => {
          //   return {
          //     name: item.commodityName,
          //     commodityIntro: item.intro,
          //     commodityPrice: item.commodityPrice,
          //     commodityNum: item.commodityNum,
          //     stats: item.status,
          //     id: item.id
          //   }
          // });
          // console.log(cartItems);
          // const ShoppingCart = {
          //   id: 1427763201,
          //   userId: 21,
          //   commodityId: 1,
          //   commodityPrice: 2342.0,
          //   commodityNum: 2,
          //   status: '有效'
          // };
          // const cartArray = eval(shoppingCarts)
          // console.log(cartArray)
          // NOTE: 用Objects.values()方法将对象转换为数组
          this.cartItems = response.data.data.map((row) => {
            // console.log(row)
            return row
          })
        })
    },
    // NOTE: 删除单个商品
    removeCommodity(commodityId) {
      const response = axios
        .delete('http://localhost:9000/shoppingCart/removeCommodity/', {
          params: {
            userId: localStorage.getItem('userId'),
            // userId: 21,
            // commodityIdArray: [commodityId] // 这是一个array
            commodityIdArray: commodityId.toString()
          }
        })
        .then((response) => {
          this.fetchData()
        })
    },
    // NOTE: 删除选中的商品
    async removeSelected() {
      // TODO：检查是否选中商品
      console.log(this.selectedItems)
      // if (this.selectedItems.length === 0) {
      //   console.log('你没有选中商品，删除失败')
      //   ElMessage({
      //     showClose: true,
      //     type: 'error', //如果失败,未连接上后端
      //     message: '请选择至少一个商品后删除'
      //   })
      //   return
      // }
      const commodityIdArray = this.selectedItems.map((item) => item.commodityId)
      console.log(commodityIdArray)
      const response = axios
        .delete('http://localhost:9000/shoppingCart/removeCommodity/', {
          params: {
            // userId: 21,
            userId: localStorage.getItem('userId'),
            commodityIdArray: this.joinWithComma(commodityIdArray)
          }
        })
        .then((response) => {
          this.fetchData()
          this.selectedItems = []
        })
    },
    // NOTE: 多选框即时更新（监听）
    handleSelectionChange(selection) {
      this.selectedItems = selection
    },
    joinWithComma(categories) {
      if (!Array.isArray(categories)) {
        throw new Error('Argument must be an array')
      }
      return categories.join(',')
    }
  }
}
</script>

<style scoped>
.shopping-cart {
  padding: 24px;
  background-color: #2c3b4d;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #ebeef5;
  background-color: #4b5a6b;
}

.card-title {
  margin: 0;
  font-size: 24px;
  color: #fff;
}

.cart-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 10px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: #3e4b5a;
}

.cart-item-enter-active,
.cart-item-leave-active {
  transition: all 0.3s ease;
}

.cart-item-enter,
.cart-item-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.el-table__row {
  background-color: #2c3b4d;
  color: #cfd8dc;
}

.el-table__header {
  background-color: #4b5a6b;
  color: #fff;
}

.footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
