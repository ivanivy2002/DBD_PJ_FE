<template>
  <div class="shopping-cart">
    <el-table :data="cartItems" style="width: 100%" stripe>
      <el-table-column prop="name" label="商品名称" width="180" />
      <el-table-column prop="description" label="介绍" />
      <el-table-column prop="price" label="价格" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.price | currency }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="quantity" label="数量" width="120" />
      <el-table-column label="失效" width="120">
        <template slot-scope="{ row }">
          <el-tag v-if="row.invalid" type="danger">已失效</el-tag>
          <el-tag v-else type="success">正常</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { ElTable, ElTableColumn, ElTag } from 'element-plus'
import { method } from 'lodash'
import axios from 'axios'

export default {
  components: {
    ElTable,
    ElTableColumn,
    ElTag
  },
  data() {
    return {
      userId: 0,
      cartItems: []
    }
  },
  filters: {
    currency(value) {
      return '¥' + parseFloat(value).toFixed(2)
    }
  },
  mounted() {
    this.userId = localStorage.getItem('userId')
    // console.log(this.cartItems)
    this.fetchData()
  },
  methods: {
    fetchData() {
      const response = axios
        .get('http://localhost:9000/shoppingCart/displayShoppingCart', {
          params: { userId: this.userId }
        })
        .then((response) => {
          console.log(response.data)
          this.cartItems = response.data.data.map((row) => {
            console.log(row)
            return row
          })
        })
    },
    removeCommodity(commodityId) {
      const response = axios.delete('http://localhost:9000/shoppingCart/removeCommodity/', {
        params: {
          userId: this.userId,
          // TODO: 数组考虑如何传数据
          commodityIdArray: ''
        }
      })
    }
  }
}
</script>

<style scoped>
.shopping-cart {
  padding: 24px;
  background-color: #f5f5f5;
}

.el-table {
  animation: fadeIn 1s ease;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
