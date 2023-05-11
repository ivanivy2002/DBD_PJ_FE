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
        <el-table-column prop="commodityName" label="商品名称" width="180" />
        <el-table-column prop="commodityPrice" label="价格" width="120">
          <template #default="{ row }">
            <span>{{ row.commodityPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNum" label="数量" width="120" />
        <el-table-column label="状态" width="120">
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
        <el-button type="default" @click="submitOrder">提交订单</el-button>
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
      const commodityIdArray = this.selectedItems.map((item) => item.commodityId)
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
    joinWithComma(categories) {
      if (!Array.isArray(categories)) {
        throw new Error('Argument must be an array')
      }
      return categories.join(',')
    },
    // TODO: 参数还没写完
    submitOrder() {
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
</style>
